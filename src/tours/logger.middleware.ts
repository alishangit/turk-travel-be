import { Injectable } from '@nestjs/common';
import { NestMiddleware } from '@nestjs/common';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  use(req: any, res: any, next: (erroe?: any) => void) {
    const fullUrl = `${req.protocol}://${req.get('host')}${req.originalUrl}`;
    console.log(`[${req.method}] ${fullUrl}`);
    next();
  }
}