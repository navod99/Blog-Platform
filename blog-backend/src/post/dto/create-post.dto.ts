import {
  IsString,
  IsOptional,
  IsEnum,
  IsArray,
  MinLength,
  MaxLength,
} from 'class-validator';
import { PostStatus } from '../schemas/post.schema';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreatePostDto {
  @ApiProperty({
    example: 'My Awesome Blog Post',
    description: 'Post title',
    minLength: 3,
    maxLength: 200,
  })
  @IsString()
  @MinLength(3)
  @MaxLength(200)
  title: string;

  @ApiPropertyOptional({
    example: 'my-awesome-blog-post',
    description: 'URL-friendly slug',
  })
  @IsOptional()
  @IsString()
  slug?: string;

  @ApiProperty({
    example: 'This is the content of my blog post...',
    description: 'Post content',
    minLength: 10,
  })
  @IsString()
  @MinLength(10)
  content: string;

  @ApiPropertyOptional({
    example: 'A brief summary of the post',
    description: 'Post excerpt',
    maxLength: 500,
  })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  excerpt?: string;

  @ApiPropertyOptional({
    enum: PostStatus,
    example: PostStatus.DRAFT,
    description: 'Post status',
  })
  @IsOptional()
  @IsEnum(PostStatus)
  status?: PostStatus;

  @ApiPropertyOptional({
    type: [String],
    example: ['javascript', 'nestjs', 'backend'],
    description: 'Post tags',
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];

  @ApiPropertyOptional({
    example: 'https://example.com/image.jpg',
    description: 'Featured image URL',
  })
  @IsOptional()
  @IsString()
  featuredImage?: string;
}
