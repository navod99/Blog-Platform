import { IsOptional, IsEnum, IsString, IsNumber, Min } from 'class-validator';
import { Transform } from 'class-transformer';
import { PostStatus } from '../schemas/post.schema';
import { ApiProperty } from '@nestjs/swagger';

export class QueryPostDto {
  @ApiProperty({
    description: 'Page number for pagination',
    example: 1,
    required: false,
    type: Number,
    minimum: 1,
    default: 1,
  })
  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  @IsNumber()
  @Min(1)
  page?: number = 1;

  @ApiProperty({
    description: 'Number of posts per page',
    example: 10,
    required: false,
    type: Number,
    minimum: 1,
    default: 10,
  })
  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  @IsNumber()
  @Min(1)
  limit?: number = 10;

  @ApiProperty({
    description: 'Filter posts by status',
    example: PostStatus.PUBLISHED,
    required: false,
    enum: PostStatus,
  })
  @IsOptional()
  @IsEnum(PostStatus)
  status?: PostStatus;

  @ApiProperty({
    description: 'Filter posts by author ID',
    example: '507f1f77bcf86cd799439011',
    required: false,
    type: String,
  })
  @IsOptional()
  @IsString()
  author?: string;

  @ApiProperty({
    description: 'Filter posts by tag',
    example: 'tech',
    required: false,
    type: String,
  })
  @IsOptional()
  @IsString()
  tag?: string;

  @ApiProperty({
    description: 'Search posts by keyword in title or content',
    example: 'javascript',
    required: false,
    type: String,
  })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiProperty({
    description: 'Field to sort posts by',
    example: 'publishedAt',
    required: false,
    type: String,
    default: 'publishedAt',
  })
  @IsOptional()
  @IsString()
  sortBy?: string = 'publishedAt';

  @ApiProperty({
    description: 'Sort order for posts',
    example: 'desc',
    required: false,
    enum: ['asc', 'desc'],
    default: 'desc',
  })
  @IsOptional()
  @IsEnum(['asc', 'desc'])
  sortOrder?: 'asc' | 'desc' = 'desc';
}
