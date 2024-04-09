import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "src/auth/models/user.class";
import { UserEntity } from "src/auth/models/user.entity";
import { Repository } from "typeorm";

@Injectable()
export class UserRepository {
    constructor(
        @InjectRepository(UserEntity)
        private readonly userRepository: Repository<UserEntity>,
    ) { }



    async findOneByEmail(email: string): Promise<User> {
        return await this.userRepository.findOneBy({ email: email })

    }

    async findOneById(id: string): Promise<User> {
        return await this.userRepository.findOneBy({ id: id })
    }
}