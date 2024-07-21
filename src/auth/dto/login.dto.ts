import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { UserEntity } from 'src/user/entities/user.entity';

export class LoginDto {
  @IsEmail({ require_tld: false })
  @Transform(({ value }) => value.toLowerCase())
  @IsNotEmpty()
  @ApiProperty({ example: 'example@example.org' })
  email!: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'password' })
  password!: string;
}

export class LoginResponseDto {
  @ApiProperty()
  userId!: string;

  @IsEmail({ require_tld: false })
  @ApiProperty()
  userEmail!: string;
}

export function mapLoginResponse(entity: UserEntity): LoginResponseDto {
  return {
    userId: entity.id,
    userEmail: entity.email,
  };
}
