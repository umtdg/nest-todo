import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-jwt';
import { jwtConstants } from 'src/constants';
import { Payload } from '../auth.interface';
import { jwtRefreshFromCookie } from '../auth.util';

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
  constructor() {
    super({
      jwtFromRequest: jwtRefreshFromCookie,
      secretOrKey: jwtConstants.refreshSecret,
      ignoreExpiration: false,
    });
  }

  async validate(payload: Payload): Promise<Payload> {
    return payload;
  }
}
