import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { UsersRepository } from '../../domain/users.repository';
import { Users } from '@models/user.model';
import { Profile } from '@models/profile.model';

@Injectable()
export class CreateUser {
  constructor(
    @Inject('userRepository') private readonly repository: UsersRepository,
  ) {}

  async create(userData: any): Promise<Users> {
    // Check if username already exists
    const existingUsername = await this.repository.findByUsername(userData.username);
    if (existingUsername) {
      throw new BadRequestException(
        ['El nombre de usuario ya está en uso'],
        {
          cause: new Error(),
          description: 'El nombre de usuario ya está en uso',
        },
      );
    }

    // Check if email already exists
    const existingEmail = await this.repository.findByEmail(userData.email);
    if (existingEmail) {
      throw new BadRequestException(
        ['El correo electrónico ya está en uso'],
        {
          cause: new Error(),
          description: 'El correo electrónico ya está en uso',
        },
      );
    }

    // Create new user
    const user = new Users();
    user.name = userData.name;
    user.surname = userData.surname;
    user.lastname = userData.lastname;
    user.birthday = userData.birthday;
    user.gender = userData.gender;
    user.identification_type = userData.identification_type;
    user.identification_number = userData.identification_number;
    user.username = userData.username;
    user.password = userData.password;
    user.status = userData.status;
    user.planta_code = userData.planta_code;
    user.phone = userData.phone;
    user.email = userData.email;
    user.signature = userData.signature;

    // Set profile
    if (userData.profile_id) {
      user.profile = { id: userData.profile_id } as Profile;
    }

    return await this.repository.create(user);
  }
} 