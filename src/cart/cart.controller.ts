import { Body, Controller, Get, Param, ParseIntPipe, Post, Session} from '@nestjs/common';
import { SessionEntity } from 'src/typeorm/Session';
import { CartService } from './cart.service';
import { CreateCartDto } from './dtos/CreateCart.dto';

@Controller('cart')
export class CartController {

    constructor(private cartService: CartService) {} 

    @Post()
    createCart(@Body() createCartDto: CreateCartDto){
        return this.cartService.createCart(null,{session: null,items:[]});
    }
     
    @Get(':id')
    getCart(@Param('id', ParseIntPipe) id: number,) {
        // return this.cartService.findCart(id);
    }

    @Get() // get cart assigned to user session id
    async getSessionIdCart(@Session() session: Record<string, any>) {
        console.log(session.id);
        const searchedSession = await this.cartService.findSessionById(session.id);
        console.log(searchedSession);
        if(!searchedSession){
            console.log("NO session in db");
            //create new cart with session id
            session.authenticated = true;
            await this.cartService.createCart(session.id, {session: null, items:[]});
        } else {
            console.log('session in db');
            return await this.cartService.findCart(searchedSession);
        }

        //if 
    }

    @Get('sessions')
    async getSessions(){
        return this.cartService.findSessions();
    }

    
}

