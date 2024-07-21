import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { join } from 'path';
import { AuthModule } from './auth/auth.module';
import { TaskModule } from './task/task.module';
import { TokenModule } from './token/token.module';
import { UserModule } from './user/user.module';

const imports = [
  AuthModule,
  TaskModule,
  TokenModule,
  TypeOrmModule.forRoot({
    type: 'mysql',
    host: 'localhost',
    port: 3306,
    username: 'root',
    password: 'root',
    database: 'todoapp_db',
    synchronize: false,
    entities: [join(__dirname, '**', '*.entity.{ts,js}')],
  }),
  UserModule,
];

@Module({
  imports: [...imports],
  providers: [],
})
export class AppModule {}
