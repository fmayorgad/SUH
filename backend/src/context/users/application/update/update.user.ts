import { BadRequestException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { UsersRepository } from '../../domain/users.repository';
import { Users } from '@models/user.model';
import { Profile } from '@models/profile.model';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class UpdateUser {
  constructor(
    @Inject('userRepository') private readonly repository: UsersRepository,
  ) {}

  async update(id: string, userData: any): Promise<Users> {
    // Check if user exists and get current data
    let currentUser: Users;
    try {
      currentUser = await this.repository.findById(id);
    } catch (error) {
      throw new NotFoundException(`Usuario con ID ${id} no encontrado`);
    }

    // Check if username already exists (if username is being updated)
    if (userData.username) {
      const existingUsername = await this.repository.findByUsername(userData.username);
      if (existingUsername && existingUsername.id !== id) {
        throw new BadRequestException(
          ['El nombre de usuario ya está en uso'],
          {
            cause: new Error(),
            description: 'El nombre de usuario ya está en uso',
          },
        );
      }
    }

    // Check if email already exists (if email is being updated)
    if (userData.email) {
      const existingEmail = await this.repository.findByEmail(userData.email);
      if (existingEmail && existingEmail.id !== id) {
        throw new BadRequestException(
          ['El correo electrónico ya está en uso'],
          {
            cause: new Error(),
            description: 'El correo electrónico ya está en uso',
          },
        );
      }
    }

    // Handle signature file cleanup if a new signature is provided
    if (userData.signature && currentUser.signature && currentUser.signature !== userData.signature) {
      try {
        // Use root-level signatures directory
        const oldSignaturePath = path.join(process.cwd(), '..', currentUser.signature);
        if (fs.existsSync(oldSignaturePath)) {
          fs.unlinkSync(oldSignaturePath);
        }
      } catch (error) {
        console.warn(`Failed to delete old signature file: ${error.message}`);
      }
    }

    // Prepare update data
    const updateData: Partial<Users> = {
      name: userData.name,
      surname: userData.surname,
      lastname: userData.lastname,
      birthday: userData.birthday,
      gender: userData.gender,
      identification_type: userData.identification_type,
      identification_number: userData.identification_number,
      username: userData.username,
      status: userData.status,
      planta_code: userData.planta_code,
      phone: userData.phone,
      email: userData.email,
      signature: userData.signature,
    };

    // Only include password if it's provided and not empty
    if (userData.password && userData.password.trim() !== '') {
      updateData.password = userData.password;
    }

    // Clean undefined values
    Object.keys(updateData).forEach(key => {
      if (updateData[key] === undefined) {
        delete updateData[key];
      }
    });

    // Set profile if provided
    if (userData.profile) {
      updateData.profile = { id: userData.profile } as Profile;
    }

    return await this.repository.update(id, updateData);
  }
} 