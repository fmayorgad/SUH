import { Injectable, Inject, Logger } from '@nestjs/common';
import { UsersRepository } from '@context/users/domain/users.repository';
import type { Users } from '@models/user.model';
import { generalStateTypes } from '@enums/general-state-type';
import { dataPaginationResponse } from '@models/app.model';

@Injectable()
export class GetAllUsers {
    constructor(@Inject('userRepository') private readonly userRepository: UsersRepository) {}

    async execute(filter?: any): Promise<Users[] | dataPaginationResponse> {
        return await this.userRepository.getAll(filter);
    }
}