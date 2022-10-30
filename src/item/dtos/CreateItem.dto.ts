import { Cart } from "src/cart/cart.model";
import { Product } from "src/products/product.model";

export class CreateItemDto {
    quantity: number;
    cart: Cart;
    product: Product;
}