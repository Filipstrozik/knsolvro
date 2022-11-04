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
        newItem.product = prod;
        newItem.price = prod.price * newItem.quantity;
        cart.sumPrice += newItem.price;
        this.cartRepository.save(cart);
        return await this.itemRepository.save(newItem);
    }

    async setCartToItem(id: number, updatedItemDetails: CreateItemParams) {
        return await this.itemRepository.update({id},{ ...updatedItemDetails });
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
        const item  = await this.itemRepository.find({
            where: {
                cart: cart,
            },
            relations: ['product']
        });
        console.log(item);
        return item;
    }
//TODO
    // async getItemProduct(itemId: number){
    //     return await this.productRepository.findOne({
    //         where: {
    //             items:itemId;
    //         },
    //         relations: ['product']
    //     })
    // }

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
        return this.productRepository.findOneBy({id},);
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
        //if already has then minus the sum
        if(cart.delivery != null) {
            cart.sumPrice -= cart.delivery.price;
        }
        const delivery = await this.deliveryRepository.findOneBy({id:deliveryId});
        cart.delivery = delivery;
        cart.sumPrice += delivery.price;
        return this.cartRepository.save(cart);
    }


    getSharedLink(sessionId: string) {
        let link = 'http://localhost:3000/cart/copy/';
        return link += sessionId;
    }

    async copyCart(session: string, cartSessionToCopy: string) {
        const sessionToCopy = await this.findSessionById(cartSessionToCopy)
        const newSessionEntity = await this.findSessionById(session);
        
        const cartToCopy = await this.findCart(sessionToCopy);
        console.log('cart to copY');
        console.log(cartToCopy);
        console.log('creating new cart');
        const newCart = this.cartRepository.create();
        console.log('finding delivery');
        // const delivery = await this.deliveryRepository.findOneBy({id:cartToCopy.delivery.id});
        // if(delivery != null) {
        //     newCart.delivery = delivery;
        // }

        newCart.delivery = cartToCopy.delivery;
        console.log('set cart, copy price');
        newCart.sumPrice = cartToCopy.sumPrice;
        console.log('set price, copy session');
        newCart.session = newSessionEntity;

        console.log('copy items...');
        //to items chyba nie dziala

        const itemList: Item[] = await this.getCartItems(cartSessionToCopy);
        console.log('seve new cart');
        
        console.log(newCart);

        await this.cartRepository.save(newCart);
        
        itemList.forEach( 
             item => this.copyItem(item, newCart)
        );
        
     
        return newCart;
        //stworzy nowy - skopuj delivery, dla kazdego itemu stworzy nowy item do nowego koszuka
    }

    async copyItem(item:Item, newCart: Cart){
        console.log('product of item:');
        console.log(item.product);
        console.log('creating new item');
        const newItem = this.itemRepository.create({});
        newItem.price = item.price;
        newItem.quantity = item.quantity;
        newItem.product = item.product;
        newItem.id = item.id*2; //xddd
        newItem.cart = newCart;
        console.log('seve new item');
        console.log(newItem);
        await this.itemRepository.save(newItem);
    }
    
}
