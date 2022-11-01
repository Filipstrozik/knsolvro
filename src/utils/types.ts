import { Item } from "src/item/item.model"
import { SessionEntity } from "src/typeorm/Session"
import { Cart } from "src/cart/cart.model";
import { Product } from "src/products/product.model";
import { Delivery } from "src/delivery/delivery.model";

export type CreateUserParams = {
    username: string,
    password: string
}

export type UpdateUserParams = {
    username: string,
    password: string
}

export type CreateProductParams = {
    title: string;
    desc: string;
    price: number;
}

export type UpdateProductParams = {
    title: string;
    desc: string;
    price: number;
}

export type CreateCartParams = {
    session: SessionEntity;
    items: Item[];
    delivery: Delivery;

}

export type UpdateCartParams = {
    session: SessionEntity;
    items: Item[];
    delivery: Delivery;
}


export type CreateItemParams  = {
    quantity: number;
    cart: Cart;
    product: Product;
}

export type UpdateItemParams  = {
    quantity: number;
    cart: Cart;
    product: Product;
}


export type CreateDeliveryParams = {
    type: string;
    price: number;
}