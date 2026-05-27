import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { dataSource } from './conf/conf';
import { ToursModule } from './tours/tours.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: dataSource,
      inject: [ConfigService],
    }),
    ToursModule,
    AuthModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
