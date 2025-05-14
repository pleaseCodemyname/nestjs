import {
  Body,
  Controller,
  Headers,
  Post,
  UseGuards,
  Request
} from '@nestjs/common';
import { AuthService } from './auth.service';
import {
  MaxLengthPipe,
  MinLengthPipe,
  PasswordPipe
} from './pipe/password.pipe';
import { BasicTokenGuard } from './guard/basic-token.guard';
import {
  AccessTokenGuard,
  RefreshTokenGuard
} from './guard/bearer-token.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('token/access')
  @UseGuards(RefreshTokenGuard)
  postTokenAccess(@Headers('authorization') rawToken: string) {
    const token = this.authService.extractTokenFromHeader(rawToken, true);

    const newToken = this.authService.rotateToken(token, false); // accessToken 발급

    /**
     * 반환
     * {accessToken: {token}}
     */

    return {
      accessToken: newToken // Header에 반환
    };
  }

  @Post('token/refresh')
  @UseGuards(RefreshTokenGuard)
  postTokenRefresh(@Headers('authorization') rawToken: string) {
    const token = this.authService.extractTokenFromHeader(rawToken, true);

    const newToken = this.authService.rotateToken(token, true); // refreshToken 발급

    /**
     * 반환
     * {refreshToken: {token}}
     */

    return {
      refreshToken: newToken // Header에 반환
    };
  }

  // Post는 Body 요청
  @Post('login/email')
  @UseGuards(BasicTokenGuard)
  // loginEmail(@Body('email') email: string, @Body('password') password: string) {
  // body에서 email과 password를 받는 형식 --> header에서 token을 받는 형식으로 변경
  postLoginEmail(@Headers('authorization') rawToken: string, @Request() req) {
    const token = this.authService.extractTokenFromHeader(rawToken, false);

    const credentials = this.authService.decodeBaiscToken(token); // token은 실제로 추출된 토큰 from extractTokenFromHeader
    // email:password -> base64 인코딩 -> email:password -> 컬럼 기준으로 split
    return this.authService.loginWithEmail(credentials);
  }

  @Post('register/email')
  postRegisterEmail(
    @Body('nickname') nickname: string,
    @Body('email') email: string,
    // @Body('password', PasswordPipe) password: string
    @Body('password', new MaxLengthPipe(8, '비밀번호'), new MinLengthPipe(3))
    password: string
  ) {
    return this.authService.registerWithEmail({
      nickname,
      email,
      password
    });
  }
}
