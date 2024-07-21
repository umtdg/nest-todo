import { ApiProperty } from '@nestjs/swagger';
import { IsEmail } from 'class-validator';
import { UserEntity } from '../entities/user.entity';

export class UserDto {
  @ApiProperty()
  id!: string;

  @IsEmail({ require_tld: false })
  @ApiProperty()
  email!: string;
}

export class UserResponseDto extends UserDto {
  @ApiProperty()
  createdAt!: Date;

  @ApiProperty()
  updatedAt!: Date;
}

export function mapSimpleUser(entity: UserEntity): UserDto {
  return {
    id: entity.id,
    email: entity.email,
  };
}

export function mapUser(entity: UserEntity): UserResponseDto {
  return {
    ...mapSimpleUser(entity),
    createdAt: entity.createdAt,
    updatedAt: entity.updatedAt,
  };
}
