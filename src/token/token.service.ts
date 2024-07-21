import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TokenBlacklistEntity } from './entities/token-blacklist.entity';

@Injectable()
export class TokenService {
  constructor(@InjectRepository(TokenBlacklistEntity) private blacklistRepository: Repository<TokenBlacklistEntity>) {}

  async isBlacklisted(token: string): Promise<boolean> {
    const blacklistedToken = await this.blacklistRepository.findOneBy({ token });
    return !!blacklistedToken;
  }

  async blacklistToken(token: string, expiresAt: Date): Promise<void> {
    await this.blacklistRepository.save({ token, expiresAt });
  }
}
