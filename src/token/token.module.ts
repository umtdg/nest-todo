import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TokenBlacklistEntity } from './entities/token-blacklist.entity';
import { TokenService } from './token.service';

@Module({
  imports: [TypeOrmModule.forFeature([TokenBlacklistEntity])],
  providers: [TokenService],
  exports: [TokenService],
})
export class TokenModule {}
