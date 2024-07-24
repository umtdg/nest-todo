import { Logger, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import configuration from './configuration';
import { TaskModule } from './task/task.module';
import { TokenModule } from './token/token.module';
import { UserModule } from './user/user.module';

const NODE_ENV = process.env.NODE_ENV;
Logger.log(`Node environment: ${NODE_ENV}`);

const imports = [
  AuthModule,
  ConfigModule.forRoot({
    envFilePath: !NODE_ENV ? '.env' : `.env.${NODE_ENV}`,
    load: [configuration],
    isGlobal: true,
  }),
  TaskModule,
  TokenModule,
  TypeOrmModule.forRootAsync({
    useFactory: (config: ConfigService) => ({
      ...config.get<TypeOrmModuleOptions>('db'),
    }),
    inject: [ConfigService],
    imports: [],
  }),
  UserModule,
];

@Module({
  imports: [...imports],
  providers: [],
})
export class AppModule {}
