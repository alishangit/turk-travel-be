import { join } from 'path';

import { ConfigService } from '@nestjs/config';
import { DataSourceOptions } from 'typeorm';

export const dataSource = (
  configService: ConfigService,
): DataSourceOptions => ({
  type: 'postgres',
  host: configService.get<string>('POSTGRES_HOST'),
  port: Number(configService.get<number>('POSTGRES_PORT')),
  username: configService.get<string>('POSTGRES_USER'),
  password: configService.get<string>('POSTGRES_PASSWORD'),
  database: configService.get<string>('POSTGRES_DATABASE'),
  entities: [join(__dirname, '..', '/**/*.entity{.ts,.js}')],
  migrations: [join(__dirname, '..', '/migrations/*{.ts,.js}')],
  synchronize: configService.get<string>('TYPEORM_SYNC') === 'true',
  logging: configService.get<string>('TYPEORM_LOGGING') === 'true',
  maxQueryExecutionTime: configService.get<number>('TYPEORM_EXECUTIONTIME'),
  migrationsRun: configService.get<string>('RUN_MIGRATIONS') === 'true',
  migrationsTransactionMode: 'each',
  dropSchema: configService.get<string>('DROP_SCHEMA') === 'true',
});
