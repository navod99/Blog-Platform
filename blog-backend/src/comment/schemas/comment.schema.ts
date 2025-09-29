import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { User } from '../../user/schemas/user.schema';
import { Post } from '../../post/schemas/post.schema';

export type CommentDocument = Comment & Document;

export enum CommentStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  SPAM = 'spam',
}

@Schema({
  timestamps: true,
  collection: 'comments',
})
export class Comment {
  @Prop({
    required: true,
    minlength: 1,
    maxlength: 2000,
  })
  content: string;

  @Prop({
    type: Types.ObjectId,
    ref: 'User',
    required: true,
  })
  author: User | Types.ObjectId;

  @Prop({
    type: Types.ObjectId,
    ref: 'Post',
    required: true,
  })
  post: Post | Types.ObjectId;

  @Prop({
    type: Types.ObjectId,
    ref: 'Comment',
    default: null,
  })
  parentComment?: Comment | Types.ObjectId | null;

  @Prop({
    type: [{ type: Types.ObjectId, ref: 'Comment' }],
    default: [],
  })
  replies: Comment[] | Types.ObjectId[];

  @Prop({
    type: String,
    enum: CommentStatus,
    default: CommentStatus.APPROVED,
  })
  status: CommentStatus;

  @Prop({
    default: 0,
  })
  likesCount: number;

  @Prop({
    default: false,
  })
  isEdited: boolean;

  @Prop()
  editedAt?: Date;

  @Prop({
    type: [{ type: Types.ObjectId, ref: 'User' }],
    default: [],
  })
  mentions: User[] | Types.ObjectId[];
}

export const CommentSchema = SchemaFactory.createForClass(Comment);

// Add indexes
CommentSchema.index({ post: 1, status: 1, createdAt: -1 });
CommentSchema.index({ author: 1 });
CommentSchema.index({ parentComment: 1 });
CommentSchema.index({ status: 1 });
