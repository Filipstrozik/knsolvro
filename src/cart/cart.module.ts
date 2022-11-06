import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Delivery } from 'src/delivery/delivery.model';
import { Item } from 'src/item/item.model';
import { Product } from 'src/products/product.model';
import { Promo } from 'src/promotion/promo.model';
import { SessionEntity } from 'src/session/Session';
import { CartController } from './cart.controller';
import { Cart } from './cart.model';
import { CartService } from './cart.service';

@Module({
  imports: [TypeOrmModule.forFeature([Cart, SessionEntity, Product, Item, Delivery, Promo])],
  controllers: [CartController],
  providers: [CartService]
})
export class CartModule {}
