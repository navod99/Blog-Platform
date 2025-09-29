import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Like, LikeDocument, LikeTargetType } from './schemas/like.schema';
import { ToggleLikeDto } from './dto/toggle-like.dto';
import { PostService } from '../post/post.service';
import { CommentService } from '../comment/comment.service';

@Injectable()
export class LikeService {
  constructor(
    @InjectModel(Like.name) private likeModel: Model<LikeDocument>,
    private postService: PostService,
    private commentService: CommentService,
  ) {}

  async toggleLike(
    toggleLikeDto: ToggleLikeDto,
    userId: string,
  ): Promise<{ liked: boolean; likesCount: number }> {
    const { targetId, targetType } = toggleLikeDto;

    // Validate target exists
    await this.validateTarget(targetId, targetType);

    // Check if like already exists
    const existingLike = await this.likeModel.findOne({
      user: userId,
      targetId: new Types.ObjectId(targetId),
      targetType,
    });

    let liked = false;
    let likesCount = 0;

    if (existingLike) {
      // Unlike
      await this.likeModel.deleteOne({ _id: existingLike._id });
      
      // Decrement likes count
      if (targetType === LikeTargetType.POST) {
        await this.postService.decrementLikes(targetId);
      } else {
        await this.commentService.decrementLikes(targetId);
      }
      
      liked = false;
    } else {
      // Like
      const newLike = new this.likeModel({
        user: userId,
        targetId: new Types.ObjectId(targetId),
        targetType,
      });
      
      await newLike.save();
      
      // Increment likes count
      if (targetType === LikeTargetType.POST) {
        await this.postService.incrementLikes(targetId);
      } else {
        await this.commentService.incrementLikes(targetId);
      }
      
      liked = true;
    }

    // Get updated likes count
    likesCount = await this.getLikesCount(targetId, targetType);

    return { liked, likesCount };
  }

  async getUserLikes(
    userId: string,
    targetType?: LikeTargetType,
  ): Promise<LikeDocument[]> {
    const filter: any = { user: userId };
    
    if (targetType) {
      filter.targetType = targetType;
    }

    return this.likeModel
      .find(filter)
      .sort({ createdAt: -1 })
      .exec();
  }

  async getTargetLikes(
    targetId: string,
    targetType: LikeTargetType,
  ): Promise<LikeDocument[]> {
    return this.likeModel
      .find({
        targetId: new Types.ObjectId(targetId),
        targetType,
      })
      .populate('user', 'username firstName lastName avatar')
      .sort({ createdAt: -1 })
      .exec();
  }

  async getLikesCount(
    targetId: string,
    targetType: LikeTargetType,
  ): Promise<number> {
    return this.likeModel.countDocuments({
      targetId: new Types.ObjectId(targetId),
      targetType,
    });
  }

  async checkUserLiked(
    userId: string,
    targetId: string,
    targetType: LikeTargetType,
  ): Promise<boolean> {
    const like = await this.likeModel.findOne({
      user: userId,
      targetId: new Types.ObjectId(targetId),
      targetType,
    });

    return !!like;
  }

  async checkMultipleUserLiked(
    userId: string,
    targetIds: string[],
    targetType: LikeTargetType,
  ): Promise<Map<string, boolean>> {
    const objectIds = targetIds.map(id => new Types.ObjectId(id));
    
    const likes = await this.likeModel.find({
      user: userId,
      targetId: { $in: objectIds },
      targetType,
    });

    const likedMap = new Map<string, boolean>();
    
    targetIds.forEach(id => {
      likedMap.set(id, false);
    });
    
    likes.forEach(like => {
      likedMap.set(like.targetId.toString(), true);
    });

    return likedMap;
  }

  private async validateTarget(
    targetId: string,
    targetType: LikeTargetType,
  ): Promise<void> {
    if (!Types.ObjectId.isValid(targetId)) {
      throw new BadRequestException('Invalid target ID format');
    }

    try {
      if (targetType === LikeTargetType.POST) {
        await this.postService.findOne(targetId);
      } else if (targetType === LikeTargetType.COMMENT) {
        await this.commentService.findOne(targetId);
      } else {
        throw new BadRequestException('Invalid target type');
      }
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException(`${targetType} not found`);
      }
      throw error;
    }
  }
}