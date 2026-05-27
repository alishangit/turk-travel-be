import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(private readonly config: ConfigService) {}

  validateCredentials(email: string, password: string): string {
    const adminEmail = this.config.get<string>('ADMIN_EMAIL');
    const adminPassword = this.config.get<string>('ADMIN_PASSWORD');

    if (!adminEmail || !adminPassword) {
      throw new UnauthorizedException('Админ не настроен на сервере');
    }

    if (email !== adminEmail || password !== adminPassword) {
      throw new UnauthorizedException('Неверный email или пароль');
    }

    return this.getLoginToken();
  }

  verifyCode(loginToken: string, code: string) {
    if (loginToken !== this.getLoginToken()) {
      throw new UnauthorizedException('Неверный токен');
    }

    const expectedCode = this.config.get<string>('ADMIN_2FA_CODE', '000000');
    if (code !== expectedCode) {
      throw new UnauthorizedException('Неверный код подтверждения');
    }

    const email = this.config.get<string>('ADMIN_EMAIL', '');
    const accessToken =
      this.config.get<string>('ADMIN_TOKEN') ?? 'secret-token';

    const tokenPayload = {
      id: 'admin',
      email,
      fullname: 'Admin',
      phone: '',
      role: 'Admin' as const,
    };

    return {
      accessToken,
      tokenPayload,
      profile: tokenPayload,
    };
  }

  private getLoginToken(): string {
    return this.config.get<string>('ADMIN_LOGIN_TOKEN', 'admin-login-token');
  }
}
