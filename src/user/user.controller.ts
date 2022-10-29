import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, Session } from '@nestjs/common';
import { CreateUserDto } from './dtos/CreateUser.dto';
import { UpdateUserDto } from './dtos/UpdateUser.dto';
import { UserService } from './user.service';


@Controller('user')
export class UserController {

    constructor(private userService: UserService) {
        
    }

    @Get()
    async getUsers(@Session() session: Record<string, any>) {
        session.authenticated = true;
        console.log(session.id);
        console.log(session);
        const users = await this.userService.findUsers();
        return users;
    }

    @Post()
    createUser(@Body() createUserDto: CreateUserDto) {
        return this.userService.createUser(createUserDto);
    }

    @Put(':id')
    async updateUserById(
        @Param('id', ParseIntPipe) id: number,
        @Body() updateUserDto: UpdateUserDto) {
        await this.userService.updateUser(id, updateUserDto);
    }

    @Delete(':id')
    async deleteUserById(@Param('id', ParseIntPipe) id: number) {
        await this.userService.deleteUser(id);
    }

}
