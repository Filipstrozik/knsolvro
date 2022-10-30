import { Item } from "src/item/item.model"
import { SessionEntity } from "src/typeorm/Session"

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
}

export type UpdateCartParams = {
    session: SessionEntity;
    items: Item[];
}

