import { Body, Controller, Post } from '@nestjs/common';
import { CartService } from './cart.service';
import { CreateCartDto } from './dtos/CreateCart.dto';

@Controller('cart')
export class CartController {

    constructor(private cartService: CartService) {} 

    @Post()
    createCart(@Body() createCartDto: CreateCartDto){
        return this.cartService.createCart({items:[]});
    }
}

