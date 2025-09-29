import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsOptional,
  MinLength,
  MaxLength,
  IsMongoId,
  IsArray,
} from 'class-validator';

export class CreateCommentDto {
  @ApiProperty({
    example: 'This is a great post!',
    description: 'Comment content',
    minLength: 1,
    maxLength: 2000,
  })
  @IsString()
  @MinLength(1)
  @MaxLength(2000)
  content: string;

  @ApiProperty({
    example: '507f1f77bcf86cd799439011',
    description: 'Post ID this comment belongs to',
  })
  @IsMongoId()
  post: string;

  @ApiPropertyOptional({
    example: '507f1f77bcf86cd799439012',
    description: 'Parent comment ID for nested replies',
  })
  @IsOptional()
  @IsMongoId()
  parentComment?: string;

  @ApiPropertyOptional({
    type: [String],
    example: ['507f1f77bcf86cd799439013'],
    description: 'User IDs mentioned in comment',
  })
  @IsOptional()
  @IsArray()
  @IsMongoId({ each: true })
  mentions?: string[];
}
