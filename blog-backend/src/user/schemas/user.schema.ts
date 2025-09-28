import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema({
  timestamps: true,
  collection: 'users',
})
export class User {
  @Prop({
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
  })
  email: string;

  @Prop({
    required: true,
    unique: true,
    trim: true,
    minlength: 3,
    maxlength: 30,
  })
  username: string;

  @Prop({
    required: true,
  })
  password: string;

  @Prop({
    required: true,
    minlength: 2,
    maxlength: 50,
  })
  firstName: string;

  @Prop({
    required: true,
    minlength: 2,
    maxlength: 50,
  })
  lastName: string;

  @Prop({
    maxlength: 500,
  })
  bio?: string;

  @Prop()
  avatar?: string;

  @Prop({
    default: true,
  })
  isActive: boolean;

  @Prop({
    type: [String],
    enum: ['user', 'admin', 'moderator'],
    default: ['user'],
  })
  roles: string[];

  @Prop()
  lastLogin?: Date;

  @Prop()
  refreshToken?: string;
}

export const UserSchema = SchemaFactory.createForClass(User);

// Add indexes
UserSchema.index({ email: 1 });
UserSchema.index({ username: 1 });
UserSchema.index({ createdAt: -1 });