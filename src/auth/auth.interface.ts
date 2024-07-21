import { LoginResponseDto } from './dto/login.dto';

export interface Payload {
  sub: string;
  email: string;
  iat: number;
  exp: number;
}

export interface JwtSign {
  accessToken: string;
  accessTokenExp: number;
  refreshToken: string;
  refreshTokenExp: number;
}

export interface LoginReturn {
  loginResponse: LoginResponseDto;
  jwtSign: JwtSign;
}
