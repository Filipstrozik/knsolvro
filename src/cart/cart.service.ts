import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Delivery } from 'src/delivery/delivery.model';
import { Item } from 'src/item/item.model';
import { Product } from 'src/products/product.model';
import { Promo } from 'src/promotion/promo.model';
import { SessionEntity } from 'src/session/Session';
import { CreateCartParams, CreateItemParams, CreateProductParams, UpdateCartParams, UpdateItemParams, UpdateProductParams, CreateDeliveryParams, CreatePromoParams } from 'src/utils/types';
import { Repository } from 'typeorm';
import { Cart } from './cart.model';

@Injectable()
export class CartService {

    constructor(
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
        @InjectRepository(Promo)
        private promoRepository: Repository<Promo>,
    ) { }

    findCarts() {
        return this.cartRepository.find({
            relations: ['session', 'items']
        });
    }

    async findCart(session: SessionEntity) {
        const foundCart = await this.cartRepository.findOne({
            where: {
                session: session,
            },
            relations: ['session', 'items', 'delivery', 'promo'],
        });
        // console.log(foundCart);
        return foundCart;
    }
    //items

    async addItem(sessionId: string, itemDetails: CreateItemParams, prodId: number) {
        const sessionEntity = await this.findSessionById(sessionId);
        const cart = await this.findCart(sessionEntity);
        const prod = await this.findProductById(prodId);
        const newItem = this.itemRepository.create({ ...itemDetails });
        newItem.product = prod;
        newItem.price = prod.price * newItem.quantity;
        cart.sumPrice += newItem.price;
        newItem.cart = cart;
        await this.cartRepository.save(cart);
        return await this.itemRepository.save(newItem);
    }

    async setCartToItem(id: number, updatedItemDetails: CreateItemParams) {
        return await this.itemRepository.update({ id }, { ...updatedItemDetails });
    }

    async changeItemQuantity(sessionId: string, id: number, updatedItemDetails: UpdateItemParams) {
        const sessionEntity = await this.findSessionById(sessionId);
        const cart = await this.findCart(sessionEntity);
        const item = await this.itemRepository.findOneBy({ id });
        const prodPrice = item.price / item.quantity
        cart.sumPrice -= item.price;
        cart.sumPrice += updatedItemDetails.quantity * prodPrice;//TODO nie wiem czy on to pobierze
        await this.cartRepository.save(cart);
        return await this.itemRepository.update({ id }, { ...updatedItemDetails, price: updatedItemDetails.quantity * prodPrice});
    }

    async deleteCartItem(sessionId: string, id: number) {
        const sessionEntity = await this.findSessionById(sessionId);
        const cart = await this.findCart(sessionEntity);
        const item = await this.itemRepository.findOneBy({ id });
        cart.sumPrice -= item.price;
        await this.cartRepository.save(cart);
        return this.itemRepository.delete({ id });
    }


    async getCartItems(sessionId: string) {
        const sessionEntity = await this.findSessionById(sessionId);
        const cart = await this.findCart(sessionEntity);
        const item = await this.itemRepository.find({
            where: {
                cart: cart,
            },
            relations: ['product']
        });
        return item;
    }

    //cart
    async createCart(sessionId: string,
        cartDetails: CreateCartParams) {

        const newSessionEntity = await this.findSessionById(sessionId);
        const newCart = this.cartRepository.create({ ...cartDetails });

        // await this.sessionRepository.save(newSessionEntity);
        newCart.session = newSessionEntity;
        return this.cartRepository.save(newCart);
    }

    updateCart(id: number, updatedCartDetails: UpdateCartParams) {
        return this.cartRepository.update({ id }, { ...updatedCartDetails });
    }

    deleteCart(id: number) {
        return this.cartRepository.delete({ id });
    }

    //sessions
    findSessions() {
        return this.sessionRepository.find();
    }

    findSessionById(id: string) {
        return this.sessionRepository.findOne({
            where: {
                id: id,
            }
        });
    }

    //product
    findProductById(id: number) {
        return this.productRepository.findOneBy({ id },);
    }



    addProduct(productDetails: CreateProductParams) {
        const product = this.productRepository.create({ ...productDetails });
        return this.productRepository.save(product);
    }

    deleteProduct(id: number) {
        return this.productRepository.delete({ id });
    }

    updateProduct(id: number, productDetails: UpdateProductParams) {
        return this.productRepository.update({ id }, { ...productDetails });
    }




    //delivery
    addDelivery(deliveryDetails: CreateDeliveryParams) {
        const delivery = this.deliveryRepository.create({ ...deliveryDetails });
        return this.deliveryRepository.save(delivery);
    }

    async setCartDelivery(sessionId: string, deliveryId: number) {
        const sessionEntity = await this.findSessionById(sessionId);
        const cart = await this.findCart(sessionEntity);
        //if already has then minus the sum
        if (cart.delivery != null) {
            cart.sumPrice -= cart.delivery.price;
        }
        const delivery = await this.deliveryRepository.findOneBy({ id: deliveryId });
        cart.delivery = delivery;
        cart.sumPrice += delivery.price;
        return this.cartRepository.save(cart);
    }


    //promo
    addPromo(promoDetails: CreatePromoParams) {
        const promo = this.promoRepository.create({ ...promoDetails });
        return this.promoRepository.save(promo);
    }

    //set promo
    async setCartPromo(sessionId: string, promoName: string) {
        const sessionEntity = await this.findSessionById(sessionId);
        const cart = await this.findCart(sessionEntity);
        if (cart.promo != null) {
            if (cart.promo.discount < 1.0) { //procentowo
                cart.sumPrice /= cart.promo.discount;
            } else { // kwotowo
                cart.sumPrice += cart.promo.discount;
            }
        }
        const promo = await this.promoRepository.findOneBy({ name: promoName });
        cart.promo = promo;
        if (promo.discount < 1.0) { //procentowo
            cart.sumPrice *= promo.discount;
        } else { // kwotowo
            cart.sumPrice -= promo.discount;
        }
        return this.cartRepository.save(cart);
    }


    //share
    getSharedLink(sessionId: string): string {
        let link = 'http://localhost:3000/cart/copy/';
        return link += sessionId;
    }

    async copyCart(session: string, cartSessionToCopy: string) {
        const sessionToCopy = await this.findSessionById(cartSessionToCopy)
        const newSessionEntity = await this.findSessionById(session);
        const cartToCopy = await this.findCart(sessionToCopy);
        const newCart = this.cartRepository.create();

        newCart.delivery = cartToCopy.delivery;
        newCart.sumPrice = cartToCopy.sumPrice;
        newCart.session = newSessionEntity;
        newCart.promo = cartToCopy.promo;

        const itemList: Item[] = await this.getCartItems(cartSessionToCopy);
        await this.cartRepository.save(newCart);

        itemList.forEach(
            item => this.copyItem(item, newCart)
        );

        return newCart;
    }

    async copyItem(item: Item, newCart: Cart) {
        const newItem = this.itemRepository.create({});
        newItem.price = item.price;
        newItem.quantity = item.quantity;
        newItem.product = item.product;
        newItem.cart = newCart;
        await this.itemRepository.save(newItem);
    }

}
