import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { hash } from 'bcrypt';
import { SignUpDto } from 'src/auth/dto/signup.dto';
import { SALT_ROUNDS } from 'src/constants';
import { Repository } from 'typeorm';
import { UserEntity } from './entities/user.entity';

@Injectable()
export class UserService {
  constructor(@InjectRepository(UserEntity) private userRepository: Repository<UserEntity>) {}

  async getById(id: string): Promise<UserEntity | null> {
    return this.userRepository.findOneBy({ id });
  }

  async getByEmail(email: string, withPassword?: boolean): Promise<UserEntity | null> {
    const builder = this.userRepository.createQueryBuilder('user').where({ email });

    if (withPassword) {
      builder.addSelect('user.password');
    }

    return builder.getOne();
  }

  async create(dto: Partial<UserEntity> | SignUpDto): Promise<UserEntity> {
    const user = await this.getByEmail(dto.email);
    if (user) {
      throw new BadRequestException('Email already in use');
    }

    const payload: Partial<UserEntity> = { ...dto };
    if (payload.password) {
      payload.password = await hash(payload.password, SALT_ROUNDS);
    }

    return this.userRepository.save(payload);
  }
}
