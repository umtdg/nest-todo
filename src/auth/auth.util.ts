import { Request } from 'express';
import { jwtConstants } from 'src/constants';
import { JwtSign } from './auth.interface';

export function jwtFromCokkie(request: Request) {
  const jwtSignCookie = request.cookies?.[jwtConstants.cookieKey];
  if (!jwtSignCookie) return null;

  const jwtSign = JSON.parse(jwtSignCookie) as JwtSign;
  if (jwtSign) return jwtSign.accessToken;

  return null;
}

export function jwtRefreshFromCookie(request: Request) {
  const jwtSignCookie = request.cookies?.[jwtConstants.cookieKey];
  if (!jwtSignCookie) return null;

  const jwtSign = JSON.parse(jwtSignCookie) as JwtSign;
  if (jwtSign) return jwtSign.refreshToken;

  return null;
}
