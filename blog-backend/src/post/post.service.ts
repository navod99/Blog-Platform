import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Post, PostDocument, PostStatus } from './schemas/post.schema';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { QueryPostDto } from './dto/query-post.dto';

@Injectable()
export class PostService {
  constructor(@InjectModel(Post.name) private postModel: Model<PostDocument>) {}

  async create(
    createPostDto: CreatePostDto,
    userId: string,
  ): Promise<PostDocument> {
    const createdPost = new this.postModel({
      ...createPostDto,
      author: userId,
    });

    return createdPost.save();
  }

  async findAll(query: QueryPostDto) {
    const {
      page = 1,
      limit = 10,
      status,
      author,
      tag,
      search,
      sortBy = 'publishedAt',
      sortOrder = 'desc',
    } = query;

    const filter: any = {};

    if (status) {
      filter.status = status;
    }

    if (author) {
      filter.author = author;
    }

    if (tag) {
      filter.tags = { $in: [tag] };
    }

    if (search) {
      filter.$text = { $search: search };
    }

    const skip = (page - 1) * limit;
    const sort = { [sortBy]: sortOrder === 'desc' ? -1 : 1 };

    const [posts, total] = await Promise.all([
      this.postModel
        .find(filter)
        .populate('author', 'username firstName lastName avatar')
        .sort(sort as any)
        .skip(skip)
        .limit(limit)
        .exec(),
      this.postModel.countDocuments(filter),
    ]);

    return {
      posts,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findPublished(query: QueryPostDto) {
    return this.findAll({
      ...query,
      status: PostStatus.PUBLISHED,
    });
  }

  async findOne(id: string): Promise<PostDocument> {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid ID format');
    }

    const post = await this.postModel
      .findById(id)
      .populate('author', 'username firstName lastName avatar bio')
      .exec();

    if (!post) {
      throw new NotFoundException(`Post with ID ${id} not found`);
    }

    return post;
  }

  async findBySlug(slug: string): Promise<PostDocument> {
    const post = await this.postModel
      .findOne({ slug })
      .populate('author', 'username firstName lastName avatar bio')
      .exec();

    if (!post) {
      throw new NotFoundException(`Post with slug ${slug} not found`);
    }

    return post;
  }

  async findByAuthor(authorId: string, query: QueryPostDto) {
    return this.findAll({
      ...query,
      author: authorId,
    });
  }

  async update(
    id: string,
    updatePostDto: UpdatePostDto,
    userId: string,
  ): Promise<PostDocument> {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid ID format');
    }

    const post = await this.postModel.findById(id);

    if (!post) {
      throw new NotFoundException(`Post with ID ${id} not found`);
    }

    // Check if user is the author
    if (post.author.toString() !== userId) {
      throw new ForbiddenException('You can only edit your own posts');
    }

    const updateData: any = { ...updatePostDto };

    // Update publishedAt if changing to published status
    if (
      updatePostDto.status === PostStatus.PUBLISHED &&
      post.status !== PostStatus.PUBLISHED
    ) {
      updateData.publishedAt = new Date();
    }

    const updatedPost = await this.postModel
      .findByIdAndUpdate(id, updateData, {
        new: true,
        runValidators: true,
      })
      .populate('author', 'username firstName lastName avatar')
      .exec();

    return updatedPost!;
  }

  async remove(id: string, userId: string): Promise<void> {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid ID format');
    }

    const post = await this.postModel.findById(id);

    if (!post) {
      throw new NotFoundException(`Post with ID ${id} not found`);
    }

    // Check if user is the author
    if (post.author.toString() !== userId) {
      throw new ForbiddenException('You can only delete your own posts');
    }

    await this.postModel.deleteOne({ _id: id }).exec();
  }

  async incrementLikes(id: string): Promise<void> {
    await this.postModel
      .updateOne({ _id: id }, { $inc: { likesCount: 1 } })
      .exec();
  }

  async decrementLikes(id: string): Promise<void> {
    await this.postModel
      .updateOne({ _id: id }, { $inc: { likesCount: -1 } })
      .exec();
  }

  async incrementComments(id: string): Promise<void> {
    await this.postModel
      .updateOne({ _id: id }, { $inc: { commentsCount: 1 } })
      .exec();
  }

  async decrementComments(id: string): Promise<void> {
    await this.postModel
      .updateOne({ _id: id }, { $inc: { commentsCount: -1 } })
      .exec();
  }

  async getRelatedPosts(
    postId: string,
    limit: number = 5,
  ): Promise<PostDocument[]> {
    const post = await this.findOne(postId);

    return this.postModel
      .find({
        _id: { $ne: postId },
        status: PostStatus.PUBLISHED,
        tags: { $in: post.tags },
      })
      .populate('author', 'username firstName lastName avatar')
      .limit(limit)
      .exec();
  }
}
