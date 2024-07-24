import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-jwt';
import { Payload } from '../auth.interface';
import { jwtRefreshFromCookie } from '../auth.util';

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
  constructor(private config: ConfigService) {
    const secret = config.get<string>('auth.jwtRefresh.secret');
    super({
      jwtFromRequest: jwtRefreshFromCookie,
      secretOrKey: secret,
      ignoreExpiration: false,
    });
  }

  async validate(payload: Payload): Promise<Payload> {
    return payload;
  }
}
