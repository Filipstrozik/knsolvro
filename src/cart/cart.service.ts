import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Delivery } from 'src/delivery/delivery.model';
import { Item } from 'src/item/item.model';
import { Product } from 'src/products/product.model';
import { SessionEntity } from 'src/typeorm/Session';
import { CreateCartParams, CreateItemParams, CreateProductParams, UpdateCartParams, UpdateItemParams, UpdateProductParams , CreateDeliveryParams} from 'src/utils/types';
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
        private itemRepository: Repository<Item>,
        @InjectRepository(Delivery)
        private deliveryRepository: Repository<Delivery>,

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
            relations: ['session', 'items', 'delivery'],
        });
        // console.log(foundCart);
        return foundCart;
    }
    //items
    
    async addItem(sessionId: string, itemDetails: CreateItemParams, prodId: number) {
        const sessionEntity = await this.findSessionById(sessionId);
        const cart = await this.findCart(sessionEntity);
        const prod = await this.findProductById(prodId);
        const newItem  = this.itemRepository.create({...itemDetails});
        newItem.cart = cart;
        newItem.product = prod
        return await this.itemRepository.save(newItem);
    }

    async changeItemQuantity(id:number, updatedItemDetails: UpdateItemParams) {
        return this.itemRepository.update({id},{ ...updatedItemDetails });
    }

    deleteCartItem(id: number){
        return this.itemRepository.delete({id});
    }


    async getCartItems(sessionId: string){
        const sessionEntity = await this.findSessionById(sessionId);
        const cart = await this.findCart(sessionEntity);
        return await this.itemRepository.find({
            where: {
                cart: cart,
            }
        })
    }

    //cart
    
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

    //sessions

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
        return this.productRepository.findOneBy({id});
    }

    addProduct(productDetails: CreateProductParams){
        const product = this.productRepository.create({...productDetails});
        return this.productRepository.save(product);
    }

    deleteProduct(id: number) {
        return this.productRepository.delete({id});
    }

    updateProduct(id:number, productDetails: UpdateProductParams) {
        return this.productRepository.update({id},{ ...productDetails });
    }
    


    //delivery

    addDelivery(deliveryDetails: CreateDeliveryParams) {
        const delivery = this.deliveryRepository.create({...deliveryDetails});
        return this.deliveryRepository.save(delivery);
    }

    async setCartDelivery(sessionId: string, deliveryId: number){
        const sessionEntity = await this.findSessionById(sessionId);
        const cart = await this.findCart(sessionEntity);
        cart.delivery = await this.deliveryRepository.findOneBy({id:deliveryId});
        return this.cartRepository.save(cart);
    }
    
}
