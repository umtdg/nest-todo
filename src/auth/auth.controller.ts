import { Body, Controller, Logger, Post, Res, UseGuards } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { JWT_COOKIE_KEY } from 'src/constants';
import { UserResponseDto } from 'src/user/dto/user.dto';
import { UserEntity } from 'src/user/entities/user.entity';
import { JwtSign, Payload } from './auth.interface';
import { AuthService } from './auth.service';
import { Cookies } from './decorators/cookies.decorator';
import { ReqUser } from './decorators/req-user.decorator';
import { LoginDto, LoginResponseDto } from './dto/login.dto';
import { SignUpDto } from './dto/signup.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { JwtRefreshGuard } from './guards/jwt-refresh.guard';
import { LocalAuthGuard } from './guards/local-auth.guard';

@ApiBearerAuth()
@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private config: ConfigService,
  ) {}

  private setJwtCookies(response: Response, jwtSign: JwtSign): void {
    response.cookie(JWT_COOKIE_KEY, JSON.stringify(jwtSign), { httpOnly: true });
  }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  @ApiResponse({ type: LoginResponseDto })
  async login(
    @ReqUser() user: UserEntity,
    @Res({ passthrough: true }) response: Response,
    @Body() dto: LoginDto,
  ): Promise<LoginResponseDto> {
    Logger.log(`Received login request for ${JSON.stringify(dto.email)}`);
    const { loginResponse, jwtSign } = await this.authService.login(user);

    this.setJwtCookies(response, jwtSign);

    return loginResponse;
  }

  @UseGuards(JwtAuthGuard)
  @Post('logout')
  async logout(@ReqUser() user: Payload, @Cookies(JWT_COOKIE_KEY) jwtSignJson: string): Promise<void> {
    Logger.log(`Received logout request for ${JSON.stringify(user.email)}`);
    const jwtSign: JwtSign = JSON.parse(jwtSignJson);
    return this.authService.logout(jwtSign);
  }

  @Post('signup')
  @ApiResponse({ type: UserResponseDto })
  async signup(@Body() dto: SignUpDto): Promise<UserResponseDto> {
    Logger.log(`Received signup request for ${JSON.stringify(dto.email)}`);
    return this.authService.signup(dto);
  }

  @UseGuards(JwtRefreshGuard)
  @Post('refresh')
  async refresh(
    @ReqUser() user: Payload,
    @Res({ passthrough: true }) response: Response,
    @Cookies(JWT_COOKIE_KEY) jwtSignJson: string,
  ): Promise<void> {
    Logger.log(`Received refresh request for ${JSON.stringify(user)}`);

    const refreshToken = (JSON.parse(jwtSignJson) as JwtSign).refreshToken;
    const jwtSign = await this.authService.refresh(user, refreshToken);

    this.setJwtCookies(response, jwtSign);
  }
}
