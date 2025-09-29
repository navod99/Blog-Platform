import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { LikeService } from './like.service';
import { ToggleLikeDto } from './dto/toggle-like.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { Public } from '../common/decorators/public.decorator';
import { LikeTargetType } from './schemas/like.schema';
import type { AuthenticatedUser } from 'src/common/interfaces/auth.interface';
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';

@Controller('likes')
export class LikeController {
  constructor(private readonly likeService: LikeService) {}

  @UseGuards(JwtAuthGuard)
  @Post('toggle')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Toggle like on a post or comment' })
  toggleLike(
    @Body() toggleLikeDto: ToggleLikeDto,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.likeService.toggleLike(toggleLikeDto, user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('user')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Get all likes by current user' })
  getUserLikes(
    @CurrentUser() user: AuthenticatedUser,
    @Query('targetType') targetType?: LikeTargetType,
  ) {
    return this.likeService.getUserLikes(user.id, targetType);
  }

  @Public()
  @Get('target/:targetId')
  @ApiOperation({ summary: 'Get all users who liked a target' })
  getTargetLikes(
    @Param('targetId') targetId: string,
    @Query('targetType') targetType: LikeTargetType,
  ) {
    return this.likeService.getTargetLikes(targetId, targetType);
  }

  @Public()
  @Get('count/:targetId')
  @ApiOperation({ summary: 'Get likes count for a target' })
  getLikesCount(
    @Param('targetId') targetId: string,
    @Query('targetType') targetType: LikeTargetType,
  ) {
    return this.likeService.getLikesCount(targetId, targetType);
  }

  @UseGuards(JwtAuthGuard)
  @Get('check/:targetId')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Check if current user liked a target' })
  checkUserLiked(
    @Param('targetId') targetId: string,
    @Query('targetType') targetType: LikeTargetType,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.likeService.checkUserLiked(user.id, targetId, targetType);
  }
}
