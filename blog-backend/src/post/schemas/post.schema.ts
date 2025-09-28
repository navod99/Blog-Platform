import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { User } from '../../user/schemas/user.schema';

export type PostDocument = Post & Document;

export enum PostStatus {
  DRAFT = 'draft',
  PUBLISHED = 'published',
}

@Schema({
  timestamps: true,
  collection: 'posts',
})
export class Post {
  @Prop({
    required: true,
    minlength: 3,
    maxlength: 200,
  })
  title: string;

  @Prop({
    unique: true,
    sparse: true,
  })
  slug: string;

  @Prop({
    required: true,
    minlength: 10,
  })
  content: string;

  @Prop({
    maxlength: 500,
  })
  excerpt?: string;

  @Prop({
    type: Types.ObjectId,
    ref: 'User',
    required: true,
  })
  author: User | Types.ObjectId;

  @Prop({
    type: String,
    enum: PostStatus,
    default: PostStatus.DRAFT,
  })
  status: PostStatus;

  @Prop({
    type: [String],
    default: [],
  })
  tags: string[];

  @Prop()
  featuredImage?: string;

  @Prop({
    default: 0,
  })
  likesCount: number;

  @Prop({
    default: 0,
  })
  commentsCount: number;

  @Prop()
  publishedAt?: Date;
}

export const PostSchema = SchemaFactory.createForClass(Post);

// Add indexes
PostSchema.index({ author: 1, status: 1 });
PostSchema.index({ tags: 1 });
PostSchema.index({ status: 1, publishedAt: -1 });
PostSchema.index({ slug: 1 });
PostSchema.index({ title: 'text', content: 'text', tags: 'text' });

// Pre-save hook to generate slug
PostSchema.pre('save', function (next) {
  if (this.isModified('title') && !this.slug) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/--+/g, '-')
      .trim();
  }
  
  // Set publishedAt when status changes to published
  if (this.isModified('status') && this.status === PostStatus.PUBLISHED && !this.publishedAt) {
    this.publishedAt = new Date();
  }
  
  next();
});