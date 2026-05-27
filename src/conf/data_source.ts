import dotenv from 'dotenv';
import { DataSource, DataSourceOptions } from 'typeorm';
dotenv.config();

/**
 * use this dotenv.config() as typeorm does not understand the configuration module (@nestjs/config) from nestjs
 */
const getMigrationConfig = (): DataSourceOptions => {
  const environment = process.env.NODE_ENV;

  return {
    type: process.env.DB_TYPE as 'postgres',
    host: process.env.POSTGRES_HOST ?? 'localhost',
    port: Number(process.env.POSTGRES_PORT),
    username: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_DATABASE,
    entities:
      environment === 'test'
        ? ['src/**/*.entity{.js,.ts}']
        : ['dist/**/*.entity{.ts,.js}'],
    migrations: ['dist/migrations/*{.ts,.js}'],
    synchronize: process.env.TYPEORM_SYNC === 'true',
    logging: process.env.TYPEORM_LOGGING === 'true',
    migrationsRun: process.env.RUN_MIGRATIONS === 'true',
    migrationsTransactionMode: 'each',
    dropSchema: process.env.DROP_SCHEMA === 'true',
  };
};

export default new DataSource(getMigrationConfig());
