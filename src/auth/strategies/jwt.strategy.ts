import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-jwt';
import { Payload } from '../auth.interface';
import { jwtFromCokkie } from '../auth.util';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private config: ConfigService) {
    const secret = config.get<string>('auth.jwt.secret');
    super({
      jwtFromRequest: jwtFromCokkie,
      secretOrKey: secret,
      ignoreExpiration: false,
    });
  }

  async validate(payload: Payload): Promise<Payload> {
    return payload;
  }
}
