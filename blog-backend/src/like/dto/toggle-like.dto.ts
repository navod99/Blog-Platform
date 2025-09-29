import { IsEnum, IsMongoId } from 'class-validator';
import { LikeTargetType } from '../schemas/like.schema';
import { ApiProperty } from '@nestjs/swagger';

export class ToggleLikeDto {
  @ApiProperty({
    example: '507f1f77bcf86cd799439011',
    description: 'ID of the post or comment to like/unlike',
  })
  @IsMongoId()
  targetId: string;

  @ApiProperty({
    enum: LikeTargetType,
    example: LikeTargetType.POST,
    description: 'Type of target (post or comment)',
  })
  @IsEnum(LikeTargetType)
  targetType: LikeTargetType;
}
