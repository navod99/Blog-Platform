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
import { CommentService } from './comment.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { QueryCommentDto } from './dto/query-comment.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { Public } from '../common/decorators/public.decorator';
import { CommentStatus } from './schemas/comment.schema';
import { ForbiddenException } from '@nestjs/common';
import type { AuthenticatedUser } from 'src/common/interfaces/auth.interface';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('comments')
@Controller('comments')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  // Create a new comment
  @UseGuards(JwtAuthGuard)
  @Post()
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Create a new comment' })
  @ApiResponse({
    status: 201,
    description: 'Comment created successfully',
  })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Post or parent comment not found' })
  create(
    @Body() createCommentDto: CreateCommentDto,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.commentService.create(createCommentDto, user.id);
  }

  // Get all comments with pagination
  @Public()
  @Get()
  @ApiOperation({ summary: 'Get all comments with pagination' })
  @ApiResponse({
    status: 200,
    description: 'Returns paginated comments',
  })
  findAll(@Query() query: QueryCommentDto) {
    return this.commentService.findAll(query);
  }

  // Get all comments for a specific post
  @Public()
  @Get('post/:postId')
  @ApiOperation({ summary: 'Get all comments for a specific post' })
  findByPost(@Param('postId') postId: string, @Query() query: QueryCommentDto) {
    return this.commentService.findByPost(postId, query);
  }

  // Get a comment by ID
  @Public()
  @Get(':id')
  @ApiOperation({ summary: 'Get a comment by ID' })
  @ApiResponse({
    status: 200,
    description: 'Returns the comment',
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid ID format',
  })
  @ApiResponse({
    status: 404,
    description: 'Comment not found',
  })
  findOne(@Param('id') id: string) {
    return this.commentService.findOne(id);
  }

  // Get comment thread with all nested replies
  @Public()
  @Get(':id/thread')
  @ApiOperation({ summary: 'Get comment thread with all nested replies' })
  @ApiResponse({
    status: 200,
    description: 'Returns comment thread with nested replies',
  })
  getThread(@Param('id') id: string) {
    return this.commentService.getCommentThread(id);
  }

  // Update a comment
  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Update a comment' })
  @ApiResponse({
    status: 200,
    description: 'Comment updated successfully',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - You can only edit your own comments',
  })
  @ApiResponse({
    status: 404,
    description: 'Comment not found',
  })
  update(
    @Param('id') id: string,
    @Body() updateCommentDto: UpdateCommentDto,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    const isAdmin = user.roles?.includes('admin') || false;
    return this.commentService.update(id, updateCommentDto, user.id, isAdmin);
  }

  // Moderate a comment (admin/moderator only)
  @UseGuards(JwtAuthGuard)
  @Patch(':id/moderate')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Moderate a comment (admin/moderator only)' })
  @ApiResponse({
    status: 200,
    description: 'Comment moderated successfully',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Only admins and moderators can moderate',
  })
  moderate(
    @Param('id') id: string,
    @Body('status') status: CommentStatus,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    // Only admin/moderator can moderate
    if (!user.roles?.includes('admin') && !user.roles?.includes('moderator')) {
      throw new ForbiddenException(
        'Only admins and moderators can moderate comments',
      );
    }
    return this.commentService.moderateComment(id, status);
  }

  // Delete a comment
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Delete a comment' })
  @ApiResponse({
    status: 200,
    description: 'Comment deleted successfully',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - You can only delete your own comments',
  })
  @ApiResponse({
    status: 404,
    description: 'Comment not found',
  })
  async remove(
    @Param('id') id: string,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    const isAdmin = user.roles?.includes('admin') || false;
    await this.commentService.remove(id, user.id, isAdmin);
    return { message: 'Comment deleted successfully' };
  }
}
