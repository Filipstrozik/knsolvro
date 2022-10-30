import { Body, Controller, Get, Param, ParseIntPipe, Post, Redirect, Res, Session} from '@nestjs/common';
import { CreateItemDto } from 'src/item/dtos/CreateItem.dto';
import { SessionEntity } from 'src/typeorm/Session';
import { CartService } from './cart.service';
import { CreateCartDto } from './dtos/CreateCart.dto';

@Controller('cart')
export class CartController {

    constructor(private cartService: CartService) {} 

    @Post()
    createCart(@Body() createItemDto: CreateItemDto){
        return this.cartService.addItem(createItemDto);
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

