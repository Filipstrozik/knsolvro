import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Item } from 'src/item/item.model';
import { Product } from 'src/products/product.model';
import { SessionEntity } from 'src/typeorm/Session';
import { CreateCartParams, CreateItemParams, CreateProductParams, UpdateCartParams } from 'src/utils/types';
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
        return this.cartRepository.find({
            relations: ['session', 'items']
        });
    }

    async findCart(session: SessionEntity){
        const foundCart = await this.cartRepository.findOne({
            where: {
                session: session,
            },
        });
        // console.log(foundCart);
        return foundCart;
    }

    
    async addItem(sessionId: string, itemDetails: CreateItemParams, prodId: number) {
        const sessionEntity = await this.findSessionById(sessionId);
        const cart = await this.findCart(sessionEntity);
        const prod = await this.findProductById(prodId);
        const newItem  = this.itemRepository.create({...itemDetails});
        newItem.cart = cart;
        newItem.product = prod
        return await this.itemRepository.save(newItem);
    }
    
    async createCart(sessionId: string,
                cartDetails: CreateCartParams) {
                    
        const newSessionEntity = await this.findSessionById(sessionId);
        const newCart = this.cartRepository.create({...cartDetails});

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

    findSessionById(id: string){
        return this.sessionRepository.findOne({
            where: {
                id: id,
            }
        });
    }

    //product

    findProductById(id: number){
        return this.productRepository.findOne({
            where: {
                id: id,
            }
        });
    }

    addProduct(productDetails: CreateProductParams){
        const product = this.productRepository.create({...productDetails});
        return this.productRepository.save(product);
    }
}
