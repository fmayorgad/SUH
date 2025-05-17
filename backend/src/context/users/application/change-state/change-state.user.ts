import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { UsersRepository } from '../../domain/users.repository';
import { Users } from '@models/user.model';
import { generalStateTypes } from '@enums/general-state-type';

@Injectable()
export class ChangeStateUser {
  constructor(
    @Inject('userRepository') private readonly repository: UsersRepository,
  ) {}

  async changeState(id: string, state: generalStateTypes): Promise<Users> {
    // Check if user exists
    try {
      await this.repository.findById(id);
    } catch (error) {
      throw new NotFoundException(`Usuario con ID ${id} no encontrado`);
    }

    return await this.repository.changeState(id, state);
  }
} 