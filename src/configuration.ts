import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export interface TodoAppSystemConfig {
  port: number;
}

export interface TodoAppJwtConfig {
  secret: string;
  expiresIn: string;
}

export interface TodoAppPaginationConfig {
  defaultLimit: number;
}

export interface TodoAppConfig {
  system: TodoAppSystemConfig;
  db: TypeOrmModuleOptions;
  auth: {
    jwt: TodoAppJwtConfig;
    jwtRefresh: TodoAppJwtConfig;
  };
  pagination: TodoAppPaginationConfig;
}

export default (): TodoAppConfig => ({
  system: {
    port: parseInt(process.env.PORT, 10) || 3000,
  },
  db: {
    type: 'mysql',
    host: process.env.DATABASE_HOST || 'localhost',
    port: parseInt(process.env.DATABASE_PORT, 10) || 3306,
    username: process.env.DATABASE_USER || 'root',
    password: process.env.DATABASE_PASS || 'root',
    database: process.env.DATABASE_NAME || 'todoapp_db',
    synchronize: !!process.env.DATABASE_SYNC || false,
    autoLoadEntities: true,
  },
  auth: {
    jwt: {
      secret: process.env.JWT_SECRET || 'JWT SECRET TO BE REPLACED',
      expiresIn: process.env.JWT_EXPIRES_IN || '5m',
    },
    jwtRefresh: {
      secret: process.env.JWT_REFRESH_SECRET || 'JWT REFRESH SECRET TO BE REPLACED',
      expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
    },
  },
  pagination: {
    defaultLimit: 20,
  },
});
