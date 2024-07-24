import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { compareSync } from 'bcrypt';
import { TokenService } from 'src/token/token.service';
import { UserResponseDto, mapUser } from 'src/user/dto/user.dto';
import { UserEntity } from 'src/user/entities/user.entity';
import { UserService } from 'src/user/user.service';
import { JwtSign, LoginReturn, Payload } from './auth.interface';
import { LoginResponseDto, mapLoginResponse } from './dto/login.dto';
import { SignUpDto } from './dto/signup.dto';

@Injectable()
export class AuthService {
  constructor(
    private config: ConfigService,
    private jwtService: JwtService,
    private tokenService: TokenService,
    private userService: UserService,
  ) {}

  async login(user: UserEntity): Promise<LoginReturn> {
    const jwtSign: JwtSign = this.jwtSign({ sub: user.id, email: user.email });
    const loginResponse: LoginResponseDto = mapLoginResponse(user);

    Logger.log(`Successfull login attempt for user ${user.email}`);
    return {
      loginResponse,
      jwtSign,
    };
  }

  async logout(jwtSign: JwtSign): Promise<void> {
    await this.tokenService.blacklistToken(jwtSign.accessToken, new Date(jwtSign.accessTokenExp));
    Logger.log(`Blacklisted access token ${jwtSign.accessToken}`);

    await this.tokenService.blacklistToken(jwtSign.refreshToken, new Date(jwtSign.refreshTokenExp));
    Logger.log(`Blacklisted refresh token ${jwtSign.refreshToken}`);
  }

  async signup(signupDto: SignUpDto): Promise<UserResponseDto> {
    const user = await this.userService.create(signupDto);

    Logger.log(`New user registered with email ${JSON.stringify(user)}`);
    return mapUser(user);
  }

  async refresh(payload: Payload, refreshToken: string): Promise<JwtSign> {
    await this.tokenService.blacklistToken(refreshToken, new Date(payload.exp));
    Logger.log(`Blacklisted refresh token ${refreshToken}`);

    const result = this.jwtSign({ sub: payload.sub, email: payload.email });
    Logger.debug(`Refreshed tokens for user '${payload.email}'`);

    return result;
  }

  async validateUser(email: string, password: string): Promise<UserEntity> {
    let user = await this.userService.getByEmail(email, true);
    if (user && !this.validatePassword(password, user)) {
      user = null;
    }

    if (!user) {
      Logger.warn(`Failed login attempt for user ${email}`);
      throw new UnauthorizedException('Incorrect email or password');
    }

    return user;
  }

  private jwtSign(payload: Omit<Payload, 'exp' | 'iat'>): JwtSign {
    const accessToken = this.jwtService.sign(payload, {
      expiresIn: this.config.get<string>('auth.jwt.expiresIn'),
      secret: this.config.get<string>('auth.jwt.secret'),
    });
    const accessTokenExp = this.jwtService.decode<Payload>(accessToken).exp;

    const refreshToken = this.jwtService.sign(payload, {
      expiresIn: this.config.get<string>('auth.jwtRefresh.expiresIn'),
      secret: this.config.get<string>('auth.jwtRefresh.secret'),
    });
    const refreshTokenExp = this.jwtService.decode<Payload>(refreshToken).exp;

    return { accessToken, accessTokenExp, refreshToken, refreshTokenExp };
  }

  private validatePassword(inputPassword: string, user: UserEntity): boolean {
    if (!user || !user.password) {
      return false;
    }

    return compareSync(inputPassword, user.password);
  }
}
