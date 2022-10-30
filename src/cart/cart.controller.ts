import { Body, Controller, Get, Param, ParseIntPipe, Post, Redirect, Res, Session} from '@nestjs/common';
import { CreateItemDto } from 'src/item/dtos/CreateItem.dto';
import { CreateProductDto } from 'src/products/dtos/CreateProduct.dto';
import { SessionEntity } from 'src/typeorm/Session';
import { CartService } from './cart.service';
import { CreateCartDto } from './dtos/CreateCart.dto';

@Controller('cart')
export class CartController {

    constructor(private cartService: CartService) {} 

    @Post(":id")
    addItem(@Session() session: Record<string, any>,
                @Body() createItemDto: CreateItemDto,
                @Param('id', ParseIntPipe) prodId: number){
        return this.cartService.addItem(session.id,createItemDto, prodId);
    }

    @Post('prod')
    createProduct(@Body() createProductDto: CreateProductDto){
        return this.cartService.addProduct(createProductDto);
    }

    @Get('/carts') 
    async getCarts() {
        return this.cartService.findCarts();
    }

    @Get('session')
    async getUserCart(@Session() session: Record<string, any>){
        // const searchedSession = await this.cartService.findSessionById(session.id);
        // console.log(searchedSession);
        const newCart = await this.cartService.createCart(session.id, {session: null, items:[]});
        return newCart;
    }

     
    @Get(':id')
    getCart(@Param('id', ParseIntPipe) id: number,) {
        // return this.cartService.findCart(id);
    }

    @Get('')
    // @Redirect('http://localhost:3000/cart/session', 201) // get cart assigned to user session id
    async getSessionIdCart(@Session() session: Record<string, any>, @Res() res) {
        console.log(session.id);
        const searchedSession = await this.cartService.findSessionById(session.id);
        // console.log(searchedSession);
        if(!searchedSession){
            console.log("NO session in db");
            //create new cart with session id
            session.authenticated = true;
            // session.save();// co to robi?
            // return this.cartService.findSessions();
            // const newCart = await this.cartService.createCart(session.id, {session: null, items:[]});
            // return newCart;
        } else {
            console.log('session in db');
            // const userCart =  await this.cartService.findCart(searchedSession);
            // console.log(userCart);
            // return userCart;
            // return this.cartService.findSessions();
        }
        return res.redirect('http://localhost:3000/cart/session');
    }



    @Get('sessions')
    async getSessions(){
        return this.cartService.findSessions();
    }


    
}

