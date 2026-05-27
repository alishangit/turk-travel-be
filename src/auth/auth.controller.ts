import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login-token')
  loginToken(@Body() body: { email: string; password: string }) {
    const token = this.authService.validateCredentials(
      body.email,
      body.password,
    );
    return { token };
  }

  @Post('login')
  login(@Body() body: { token: string; code: string }) {
    return this.authService.verifyCode(body.token, body.code);
  }
}
