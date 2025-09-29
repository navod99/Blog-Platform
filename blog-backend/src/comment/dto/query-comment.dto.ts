import { IsOptional, IsEnum, IsMongoId, IsNumber, Min } from 'class-validator';
import { Transform } from 'class-transformer';
import { CommentStatus } from '../schemas/comment.schema';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class QueryCommentDto {
  @ApiPropertyOptional({ example: 1 })
  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  @IsNumber()
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({ example: 20 })
  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  @IsNumber()
  @Min(1)
  limit?: number = 20;

  @ApiPropertyOptional({ example: '507f1f77bcf86cd799439011' })
  @IsOptional()
  @IsMongoId()
  post?: string;

  @ApiPropertyOptional({ example: '507f1f77bcf86cd799439012' })
  @IsOptional()
  @IsMongoId()
  author?: string;

  @ApiPropertyOptional({ example: '507f1f77bcf86cd799439013' })
  @IsOptional()
  @IsMongoId()
  parentComment?: string;

  @ApiPropertyOptional({ enum: CommentStatus, example: CommentStatus.APPROVED })
  @IsOptional()
  @IsEnum(CommentStatus)
  status?: CommentStatus;

  @ApiPropertyOptional({
    enum: ['createdAt', 'likesCount'],
    example: 'createdAt',
  })
  @IsOptional()
  @IsEnum(['createdAt', 'likesCount'])
  sortBy?: string = 'createdAt';

  @ApiPropertyOptional({ enum: ['asc', 'desc'], example: 'desc' })
  @IsOptional()
  @IsEnum(['asc', 'desc'])
  sortOrder?: 'asc' | 'desc' = 'desc';
}
