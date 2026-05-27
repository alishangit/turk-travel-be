import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.useStaticAssets(join(process.cwd(), 'public', 'tours'), {
    prefix: '/public/tours/',
  });

  app.useGlobalPipes(new ValidationPipe({ transform: true }));

  const defaultCorsOrigins =
    'http://localhost:3001,https://toursanatolia.com,https://www.toursanatolia.com';

  const corsOrigins = [
    ...new Set(
      (process.env.CORS_ORIGINS ?? defaultCorsOrigins)
        .split(',')
        .map((origin) => origin.trim())
        .filter(Boolean)
        .concat('http://localhost:3001'),
    ),
  ];

  app.enableCors({
    origin: corsOrigins,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization', 'authorganization'],
    credentials: true,
  });

  const port = Number(process.env.PORT ?? 3000);
  await app.listen(port, '0.0.0.0');
}
bootstrap();
