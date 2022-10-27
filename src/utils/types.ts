import { Item } from "src/item/item.model"

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
    items: Item[];
}

export type UpdateCartParams = {
    items: Item[];
}