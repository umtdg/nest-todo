import { ExecutionContext, Injectable, Logger } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { TokenService } from 'src/token/token.service';
import { jwtRefreshFromCookie } from '../auth.util';

@Injectable()
export class JwtRefreshGuard extends AuthGuard('jwt-refresh') {
  constructor(private tokenService: TokenService) {
    super();
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    if (await this.checkBlacklist(context)) {
      return false;
    }

    return (await super.canActivate(context)) as boolean;
  }

  private async checkBlacklist(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const token = jwtRefreshFromCookie(request);
    if (!token || token.length === 0) {
      Logger.log('Authorization attempt with empty token');
    }

    const blacklisted = await this.tokenService.isBlacklisted(token);
    if (blacklisted) {
      Logger.log(`Authorization attempt with blacklisted token "${token}"`);
    }

    return blacklisted;
  }
}
