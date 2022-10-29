import { Body, Controller, Get, Param, ParseIntPipe, Post } from '@nestjs/common';
import { CartService } from './cart.service';
import { CreateCartDto } from './dtos/CreateCart.dto';

@Controller('cart')
export class CartController {

    constructor(private cartService: CartService) {} 

    @Post()
    createCart(@Body() createCartDto: CreateCartDto){
        return this.cartService.createCart({items:[]});
    }
     
    @Get(':id')
    getCart(@Param('id', ParseIntPipe) id: number,) {
        return this.cartService.findCart(id);
    }

    @Get()
    async getAllCarts() {
        return this.cartService.findCarts();
    }
}

