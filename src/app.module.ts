import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProductModule } from './products/product.module';
import { UserModule } from './user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { User } from './user/user.model';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [ProductModule, UserModule,
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'sql11.freemysqlhosting.net',
      port: 3306,
      username: 'sql11529680',
      password: 'RRUsaQ4qFS',
      database: 'sql11529680',
      entities: [User],
      synchronize: true,
      dropSchema: true
    }),
    AuthModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  constructor(private dataSoure:DataSource){}
}
