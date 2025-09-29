import {
  IsString,
  IsOptional,
  MinLength,
  MaxLength,
  IsEnum,
} from 'class-validator';
import { CommentStatus } from '../schemas/comment.schema';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateCommentDto {
  @ApiPropertyOptional({
    example: 'Updated comment content',
    description: 'New comment content',
  })
  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(2000)
  content?: string;

  @ApiPropertyOptional({
    enum: CommentStatus,
    example: CommentStatus.APPROVED,
    description: 'Comment status (admin only)',
  })
  @IsOptional()
  @IsEnum(CommentStatus)
  status?: CommentStatus;
}
