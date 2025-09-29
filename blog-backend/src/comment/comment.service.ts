import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import {
  Comment,
  CommentDocument,
  CommentStatus,
} from './schemas/comment.schema';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { QueryCommentDto } from './dto/query-comment.dto';
import { PostService } from '../post/post.service';

@Injectable()
export class CommentService {
  constructor(
    @InjectModel(Comment.name) private commentModel: Model<CommentDocument>,
    private postService: PostService,
  ) {}

  async create(
    createCommentDto: CreateCommentDto,
    userId: string,
  ): Promise<CommentDocument> {
    // Verify post exists
    await this.postService.findOne(createCommentDto.post);

    // If it's a reply, verify parent comment exists and belongs to same post
    if (createCommentDto.parentComment) {
      const parentComment = await this.commentModel.findById(
        createCommentDto.parentComment,
      );

      if (!parentComment) {
        throw new NotFoundException('Parent comment not found');
      }

      if (parentComment.post.toString() !== createCommentDto.post) {
        throw new BadRequestException(
          'Parent comment does not belong to this post',
        );
      }
    }

    const comment = new this.commentModel({
      ...createCommentDto,
      author: userId,
    });

    const savedComment = await comment.save();

    // If it's a reply, add it to parent's replies array
    if (createCommentDto.parentComment) {
      await this.commentModel.updateOne(
        { _id: createCommentDto.parentComment },
        { $push: { replies: savedComment._id } },
      );
    }

    // Increment post's comment count
    await this.postService.incrementComments(createCommentDto.post);

    return savedComment.populate([
      { path: 'author', select: 'username firstName lastName avatar' },
    ]);
  }

  async findAll(query: QueryCommentDto) {
    const {
      page = 1,
      limit = 20,
      post,
      author,
      parentComment,
      status = CommentStatus.APPROVED,
      sortBy = 'createdAt',
      sortOrder = 'desc',
    } = query;

    const filter: any = { status };

    if (post) {
      filter.post = post;
    }

    if (author) {
      filter.author = author;
    }

    // Only get top-level comments if not specified
    if (parentComment !== undefined) {
      filter.parentComment = parentComment;
    } else {
      filter.parentComment = null;
    }

    const skip = (page - 1) * limit;
    const sort = { [sortBy]: sortOrder === 'desc' ? -1 : 1 };

    const [comments, total] = await Promise.all([
      this.commentModel
        .find(filter)
        .populate('author', 'username firstName lastName avatar')
        .populate({
          path: 'replies',
          populate: {
            path: 'author',
            select: 'username firstName lastName avatar',
          },
          match: { status: CommentStatus.APPROVED },
        })
        .sort(sort as any)
        .skip(skip)
        .limit(limit)
        .exec(),
      this.commentModel.countDocuments(filter),
    ]);

    return {
      comments,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findByPost(postId: string, query: QueryCommentDto) {
    return this.findAll({
      ...query,
      post: postId,
    });
  }

  async findOne(id: string): Promise<CommentDocument> {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid ID format');
    }

    const comment = await this.commentModel
      .findById(id)
      .populate('author', 'username firstName lastName avatar')
      .populate({
        path: 'replies',
        populate: {
          path: 'author',
          select: 'username firstName lastName avatar',
        },
      })
      .exec();

    if (!comment) {
      throw new NotFoundException(`Comment with ID ${id} not found`);
    }

    return comment;
  }

  async update(
    id: string,
    updateCommentDto: UpdateCommentDto,
    userId: string,
    isAdmin: boolean = false,
  ): Promise<CommentDocument> {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid ID format');
    }

    const comment = await this.commentModel.findById(id);

    if (!comment) {
      throw new NotFoundException(`Comment with ID ${id} not found`);
    }

    // Only author can edit content, admin can change status
    if (!isAdmin && comment.author.toString() !== userId) {
      throw new ForbiddenException('You can only edit your own comments');
    }

    const updateData: any = { ...updateCommentDto };

    if (updateCommentDto.content && !isAdmin) {
      if (comment.author.toString() !== userId) {
        throw new ForbiddenException('You can only edit your own comments');
      }
      updateData.isEdited = true;
      updateData.editedAt = new Date();
    }

    const updatedComment = await this.commentModel
      .findByIdAndUpdate(id, updateData, {
        new: true,
        runValidators: true,
      })
      .populate('author', 'username firstName lastName avatar')
      .exec();

    return updatedComment!;
  }

  async remove(
    id: string,
    userId: string,
    isAdmin: boolean = false,
  ): Promise<void> {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid ID format');
    }

    const comment = await this.commentModel.findById(id);

    if (!comment) {
      throw new NotFoundException(`Comment with ID ${id} not found`);
    }

    // Check if user is the author or admin
    if (!isAdmin && comment.author.toString() !== userId) {
      throw new ForbiddenException('You can only delete your own comments');
    }

    // Remove from parent's replies if it's a reply
    if (comment.parentComment) {
      await this.commentModel.updateOne(
        { _id: comment.parentComment },
        { $pull: { replies: comment._id } },
      );
    }

    // Delete all nested replies
    await this.deleteReplies(id);

    // Delete the comment
    await this.commentModel.deleteOne({ _id: id }).exec();

    // Decrement post's comment count
    await this.postService.decrementComments(comment.post.toString());
  }

  private async deleteReplies(commentId: string): Promise<void> {
    const replies = await this.commentModel.find({ parentComment: commentId });

    for (const reply of replies) {
      await this.deleteReplies(reply.id);
      await this.commentModel.deleteOne({ _id: reply._id });
    }
  }

  async moderateComment(
    id: string,
    status: CommentStatus,
  ): Promise<CommentDocument> {
    return this.update(id, { status }, '', true);
  }

  async getCommentThread(commentId: string): Promise<CommentDocument> {
    const comment = await this.findOne(commentId);

    // Recursively populate all replies
    await this.populateReplies(comment);

    return comment;
  }

  private async populateReplies(comment: any): Promise<void> {
    if (comment.replies && comment.replies.length > 0) {
      for (let i = 0; i < comment.replies.length; i++) {
        if (typeof comment.replies[i] === 'string') {
          comment.replies[i] = await this.commentModel
            .findById(comment.replies[i])
            .populate('author', 'username firstName lastName avatar')
            .exec();
        }
        if (comment.replies[i]) {
          await this.populateReplies(comment.replies[i]);
        }
      }
    }
  }

  async incrementLikes(id: string): Promise<void> {
    await this.commentModel
      .updateOne({ _id: id }, { $inc: { likesCount: 1 } })
      .exec();
  }

  async decrementLikes(id: string): Promise<void> {
    await this.commentModel
      .updateOne({ _id: id }, { $inc: { likesCount: -1 } })
      .exec();
  }
}
