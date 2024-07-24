import { Request } from 'express';
import { JWT_COOKIE_KEY } from 'src/constants';
import { JwtSign } from './auth.interface';

export function jwtFromCokkie(request: Request) {
  const jwtSignCookie = request.cookies?.[JWT_COOKIE_KEY];
  if (!jwtSignCookie) return null;

  const jwtSign = JSON.parse(jwtSignCookie) as JwtSign;
  if (jwtSign) return jwtSign.accessToken;

  return null;
}

export function jwtRefreshFromCookie(request: Request) {
  const jwtSignCookie = request.cookies?.[JWT_COOKIE_KEY];
  if (!jwtSignCookie) return null;

  const jwtSign = JSON.parse(jwtSignCookie) as JwtSign;
  if (jwtSign) return jwtSign.refreshToken;

  return null;
}
