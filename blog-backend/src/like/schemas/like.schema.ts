import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { User } from '../../user/schemas/user.schema';

export type LikeDocument = Like & Document;

export enum LikeTargetType {
  POST = 'post',
  COMMENT = 'comment',
}

@Schema({
  timestamps: true,
  collection: 'likes',
})
export class Like {
  @Prop({
    type: Types.ObjectId,
    ref: 'User',
    required: true,
  })
  user: User | Types.ObjectId;

  @Prop({
    type: Types.ObjectId,
    required: true,
  })
  targetId: Types.ObjectId;

  @Prop({
    type: String,
    enum: LikeTargetType,
    required: true,
  })
  targetType: LikeTargetType;
}

export const LikeSchema = SchemaFactory.createForClass(Like);

// Create compound index to ensure unique likes
LikeSchema.index({ user: 1, targetId: 1, targetType: 1 }, { unique: true });
LikeSchema.index({ targetId: 1, targetType: 1 });
LikeSchema.index({ user: 1 });
