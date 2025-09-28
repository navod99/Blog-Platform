import { IsEmail, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({
    description: 'The email address of the user',
    example: 'john.doe@example.com',
    maxLength: 100,
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description:
      'The password for the user account (must contain at least one uppercase letter, one lowercase letter, one number, and one special character)',
    example: 'SecurePass123!',
    minLength: 8,
    maxLength: 100,
  })
  @IsString()
  @MinLength(8)
  password: string;
}