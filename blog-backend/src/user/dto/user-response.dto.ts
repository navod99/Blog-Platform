import { Exclude, Expose, Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class UserResponseDto {
  @ApiProperty({
    description: 'The unique identifier of the user',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @Expose()
  @Transform(({ obj }) => obj._id.toString())
  id: string;

  @ApiProperty({
    description: 'The email address of the user',
    example: 'john.doe@example.com',
  })
  @Expose()
  email: string;

  @ApiProperty({
    description: 'The username of the user',
    example: 'john_doe123',
  })
  @Expose()
  username: string;

  @ApiProperty({
    description: 'The first name of the user',
    example: 'John',
  })
  @Expose()
  firstName: string;

  @ApiProperty({
    description: 'The last name of the user',
    example: 'Doe',
  })
  @Expose()
  lastName: string;

  @ApiProperty({
    description: 'A short biography of the user',
    example: 'Loves writing about travel and photography',
    required: false,
  })
  @Expose()
  bio?: string;

  @ApiProperty({
    description: 'URL to the user’s avatar image',
    example: 'https://example.com/avatar.jpg',
    required: false,
  })
  @Expose()
  avatar?: string;

  @ApiProperty({
    description: 'Whether the user account is active',
    example: true,
  })
  @Expose()
  isActive: boolean;

  @ApiProperty({
    description: 'List of user roles',
    example: ['user'],
    enum: ['user', 'admin', 'moderator'],
    isArray: true,
  })
  @Expose()
  roles: string[];

  @ApiProperty({
    description: 'The date and time of the user’s last login',
    example: '2025-09-28T10:49:00+05:30',
    required: false,
  })
  @Expose()
  lastLogin?: Date;

  @ApiProperty({
    description: 'The date and time the user was created',
    example: '2025-09-28T10:49:00+05:30',
  })
  @Expose()
  createdAt: Date;

  @ApiProperty({
    description: 'The date and time the user was last updated',
    example: '2025-09-28T10:49:00+05:30',
  })
  @Expose()
  updatedAt: Date;

  @Exclude()
  password: string;

  @Exclude()
  refreshToken?: string;

  constructor(partial: Partial<UserResponseDto>) {
    Object.assign(this, partial);
  }
}