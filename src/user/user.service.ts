import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserParams, UpdateUserParams } from 'src/utils/types';
import { Repository } from 'typeorm';
import { User } from './user.model';


@Injectable()
export class UserService {
    constructor (
        @InjectRepository(User)
        private usersRepository: Repository<User>,
    ) {}

    findUsers() {
        return this.usersRepository.find();
    }


    createUser(userDetails: CreateUserParams) {
        const newUser = this.usersRepository.create({...userDetails});
        return this.usersRepository.save(newUser);
    }

    updateUser(id:number, updatedUserDetails: UpdateUserParams) {
        return this.usersRepository.update({id},{ ...updatedUserDetails });
    }
    
    deleteUser(id:number){
        return this.usersRepository.delete({id});
    }
}
