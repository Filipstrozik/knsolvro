import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SessionEntity } from 'src/typeorm/Session';
import { CartController } from './cart.controller';
import { Cart } from './cart.model';
import { CartService } from './cart.service';

@Module({
  imports: [TypeOrmModule.forFeature([Cart, SessionEntity])],
  controllers: [CartController],
  providers: [CartService]
})
export class CartModule {}
