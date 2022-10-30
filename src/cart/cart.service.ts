import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateCartParams, UpdateCartParams } from 'src/utils/types';
import { Repository } from 'typeorm';
import { Cart } from './cart.model';

@Injectable()
export class CartService {
    constructor (
        @InjectRepository(Cart)
        private cartRepository: Repository<Cart>,
        
    ) {}

    findCarts() {
        return this.cartRepository.find();
    }

    findCart(id: number){
        return this.cartRepository.findOne({
            where: {
                id: id,
            },
        });
    }


    createCart(cartDetails: CreateCartParams) {
        const newCart = this.cartRepository.create({...cartDetails});
        return this.cartRepository.save(newCart);
    }

    updateCart(id:number, updatedCartDetails: UpdateCartParams) {
        return this.cartRepository.update({id},{ ...updatedCartDetails });
    }
    
    deleteCart(id:number){
        return this.cartRepository.delete({id});
    }
}
