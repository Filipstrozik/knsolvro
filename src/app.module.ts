import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { Product } from './products/product.model';
import { CartModule } from './cart/cart.module';
import { Cart } from './cart/cart.model';
import { Item } from './item/item.model';
import { SessionEntity } from './session/Session';
import { Delivery } from './delivery/delivery.model';
import { Promo } from './promotion/promo.model';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      //for mysql db
      // type: 'mysql',
      // host: 'sql11.freemysqlhosting.net',
      // port: 3306,
      // username: 'sql11529680',
      // password: 'RRUsaQ4qFS',
      // database: 'sql11529680',
      //for local oracle xe db
      type: 'oracle',
      host: 'localhost',
      port: 1521,
      username: 'hr',
      password: 'hr',
      serviceName: 'XEPDB1',
      entities: [Product, Cart, Item, SessionEntity, Delivery, Promo],
      synchronize: true,
      dropSchema: false
    }),
    CartModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  constructor(private dataSoure:DataSource){}
}
