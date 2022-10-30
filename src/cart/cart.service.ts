import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Item } from 'src/item/item.model';
import { Product } from 'src/products/product.model';
import { SessionEntity } from 'src/typeorm/Session';
import { CreateCartParams, UpdateCartParams } from 'src/utils/types';
import { Repository } from 'typeorm';
import { Cart } from './cart.model';

@Injectable()
export class CartService {
    constructor (
        @InjectRepository(Cart)
        private cartRepository: Repository<Cart>,
        @InjectRepository(SessionEntity)
        private sessionRepository: Repository<SessionEntity>,
        @InjectRepository(Product)
        private productRepository: Repository<Product>,
        @InjectRepository(Item)
        private itemRepository: Repository<Item>

    ) {}

    findCarts() {
        return this.cartRepository.find();
    }

    findCart(session: SessionEntity){
        return this.cartRepository.findOne({
            where: {
                session: session,
            },
        });
    }


    
    async createCart(sessionId: string,
                cartDetails: CreateCartParams) {
        var newCart = this.cartRepository.create({...cartDetails});

        var newSessionEntity = await this.findSessionById(sessionId);
        // await this.sessionRepository.save(newSessionEntity);
        newCart.session = newSessionEntity;
        return this.cartRepository.save(newCart);
    }

    updateCart(id:number, updatedCartDetails: UpdateCartParams) {
        return this.cartRepository.update({id},{ ...updatedCartDetails });
    }
    
    deleteCart(id:number){
        return this.cartRepository.delete({id});
    }

    findSessions(){
        return this.sessionRepository.find();
    }

    async findSessionById(id: string){
        return await this.sessionRepository.findOne({
            where: {
                id: id,
            }
        });

    }
}
