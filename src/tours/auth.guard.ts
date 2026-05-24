import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthRequest } from './auth.types';
import { Role } from './role.enum';

@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<AuthRequest>();
    const authHeader = request.headers['authorganization'];
    const adminToken = process.env.ADMIN_TOKEN ?? 'secret-token';

    if (authHeader === adminToken) {
      request.user = { role: Role.ADMIN };
      return true;
    }

    throw new UnauthorizedException('Нет доступа');
  }
}
