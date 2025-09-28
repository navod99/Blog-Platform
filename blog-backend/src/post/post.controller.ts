import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
} from '@nestjs/common';
import { PostService } from './post.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { QueryPostDto } from './dto/query-post.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { Public } from '../common/decorators/public.decorator';
import type { AuthenticatedUser } from 'src/common/interfaces/auth.interface';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiBody,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';

@ApiTags('posts')
@Controller('posts')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Create a new Post' })
  @ApiBody({ type: CreatePostDto })
  @ApiResponse({ status: 201, description: 'Post created successfully' })
  @ApiResponse({ status: 400, description: 'Invalid input' })
  @Post()
  create(
    @Body() createPostDto: CreatePostDto,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.postService.create(createPostDto, user.id);
  }

  // Get all posts with pagination and filters
  @Public()
  @Get()
  @ApiOperation({ summary: 'Get all posts with pagination and filters' })
  @ApiResponse({
    status: 200,
    description: 'Returns paginated posts',
    schema: {
      example: {
        posts: [
          {
            _id: '507f1f77bcf86cd799439011',
            title: 'Blog Post Title',
            slug: 'blog-post-title',
            excerpt: 'Post excerpt...',
            status: 'published',
            author: {
              _id: '507f1f77bcf86cd799439012',
              username: 'johndoe',
              firstName: 'John',
              lastName: 'Doe',
            },
            tags: ['javascript'],
            views: 100,
            likesCount: 10,
            commentsCount: 5,
            publishedAt: '2024-01-01T00:00:00.000Z',
          },
        ],
        pagination: {
          total: 50,
          page: 1,
          limit: 10,
          totalPages: 5,
        },
      },
    },
  })
  findAll(@Query() query: QueryPostDto) {
    return this.postService.findAll(query);
  }

  // Get all published posts
  @Public()
  @Get('published')
  @ApiOperation({ summary: 'Get all published posts' })
  @ApiResponse({
    status: 200,
    description: 'Returns published posts only',
  })
  findPublished(@Query() query: QueryPostDto) {
    return this.postService.findPublished(query);
  }

  // Get a post by ID
  @Public()
  @Get(':id')
  @ApiOperation({ summary: 'Get a post by ID' })
  @ApiParam({
    name: 'id',
    type: String,
    description: 'MongoDB ObjectId',
    example: '507f1f77bcf86cd799439011',
  })
  @ApiResponse({
    status: 200,
    description: 'Returns the post',
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid ID format',
  })
  @ApiResponse({
    status: 404,
    description: 'Post not found',
  })
  async findOne(@Param('id') id: string) {
    const post = await this.postService.findOne(id);
    return post;
  }

  // Get a post by slug
  @Public()
  @Get('slug/:slug')
  @ApiOperation({ summary: 'Get a post by slug' })
  @ApiParam({
    name: 'slug',
    type: String,
    description: 'URL-friendly slug',
    example: 'my-blog-post',
  })
  @ApiResponse({
    status: 200,
    description: 'Returns the post',
  })
  @ApiResponse({
    status: 404,
    description: 'Post not found',
  })
  async findBySlug(@Param('slug') slug: string) {
    const post = await this.postService.findBySlug(slug);
    return post;
  }

  // Get related posts based on tags
  @Public()
  @Get(':id/related')
  @ApiOperation({ summary: 'Get related posts based on tags' })
  @ApiParam({
    name: 'id',
    type: String,
    description: 'Post ID',
    example: '507f1f77bcf86cd799439011',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    example: 5,
  })
  @ApiResponse({
    status: 200,
    description: 'Returns related posts',
  })
  @ApiResponse({
    status: 404,
    description: 'Post not found',
  })
  getRelatedPosts(@Param('id') id: string, @Query('limit') limit?: number) {
    return this.postService.getRelatedPosts(id, limit);
  }

  // Get all posts by a specific author
  @UseGuards(JwtAuthGuard)
  @Get('author/:authorId')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Get all posts by a specific author' })
  @ApiParam({
    name: 'authorId',
    type: String,
    description: 'Author user ID',
    example: '507f1f77bcf86cd799439012',
  })
  @ApiQuery({ name: 'page', required: false, type: Number, example: 1 })
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 10 })
  @ApiQuery({
    name: 'status',
    required: false,
    enum: ['draft', 'published'],
  })
  @ApiResponse({
    status: 200,
    description: 'Returns posts by author',
  })
  findByAuthor(
    @Param('authorId') authorId: string,
    @Query() query: QueryPostDto,
  ) {
    return this.postService.findByAuthor(authorId, query);
  }

  // Update a post
  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Update a post' })
  @ApiParam({
    name: 'id',
    type: String,
    description: 'Post ID',
    example: '507f1f77bcf86cd799439011',
  })
  @ApiResponse({
    status: 200,
    description: 'Post updated successfully',
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid ID format',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - You can only edit your own posts',
  })
  @ApiResponse({
    status: 404,
    description: 'Post not found',
  })
  update(
    @Param('id') id: string,
    @Body() updatePostDto: UpdatePostDto,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.postService.update(id, updatePostDto, user.id);
  }

  // Delete a post
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Delete a post' })
  @ApiParam({
    name: 'id',
    type: String,
    description: 'Post ID',
    example: '507f1f77bcf86cd799439011',
  })
  @ApiResponse({
    status: 200,
    description: 'Post deleted successfully',
    schema: {
      example: {
        message: 'Post deleted successfully',
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid ID format',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - You can only delete your own posts',
  })
  @ApiResponse({
    status: 404,
    description: 'Post not found',
  })
  async remove(
    @Param('id') id: string,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    await this.postService.remove(id, user.id);
    return { message: 'Post deleted successfully' };
  }
}
