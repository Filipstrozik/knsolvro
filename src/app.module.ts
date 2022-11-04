import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProductModule } from './products/product.module';
import { UserModule } from './user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { User } from './user/user.model';
import { AuthModule } from './auth/auth.module';
import { Product } from './products/product.model';
import { CartModule } from './cart/cart.module';
import { Cart } from './cart/cart.model';
import { Item } from './item/item.model';
import { SessionEntity } from './typeorm/Session';
import { Delivery } from './delivery/delivery.model';
import { Promo } from './promotion/promo.model';

@Module({
  imports: [ProductModule, UserModule,
    TypeOrmModule.forRoot({
      // type: 'mysql',
      // host: 'sql11.freemysqlhosting.net',
      // port: 3306,
      // username: 'sql11529680',
      // password: 'RRUsaQ4qFS',
      // database: 'sql11529680',
      type: 'oracle',
      host: 'localhost',
      port: 1521,
      username: 'hr',
      password: 'hr',
      serviceName: 'XEPDB1',
      entities: [User, Product, Cart, Item, SessionEntity, Delivery, Promo],
      synchronize: true,
      dropSchema: false
    }),
    AuthModule,
    CartModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  constructor(private dataSoure:DataSource){}
}
