import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ToursModule } from './tours/tours.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LoggerMiddleware } from './tours/logger.middleware';
import {
  MiddlewareConfigProxy,
  MiddlewareConsumer,
} from '@nestjs/common/interfaces';

@Module({
  imports: [
    ToursModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST ?? 'localhost',
      port: Number(process.env.DB_PORT ?? 5432),
      username: process.env.DB_USERNAME ?? 'postgres',
      password: process.env.DB_PASSWORD ?? 'postgres',
      database: process.env.DB_NAME ?? 'turk-travel',
      autoLoadEntities: true,
      synchronize: true,
      ...(process.env.DB_HOST &&
        !['localhost', '127.0.0.1'].includes(process.env.DB_HOST) && {
          ssl: { rejectUnauthorized: false },
        }),
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*')
  }
}
