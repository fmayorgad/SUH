import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UsersRepository } from './../../domain/users.repository';
import { Users } from '@models/user.model';
import { generalStateTypes } from '@enums/general-state-type';
import * as bcrypt from 'bcrypt';
import { dataPaginationResponse } from '@models/app.model';

@Injectable()
export class PgsqlUsersRepository implements UsersRepository {
  private readonly logger = new Logger(PgsqlUsersRepository.name);

  constructor(
    @InjectRepository(Users)
    private readonly repository: Repository<Users>,
  ) {}

  async findByNameIdentification(text: string): Promise<Users[] | null> {
    return await this.repository.manager
      .createQueryBuilder(Users, 'user')
      .where('user.name ILIKE :text', { text: `%${text}%` })
      .orWhere('user.email ILIKE :text', { text: `%${text}%` })
      .getMany();
  }

  async getAll(filter?: any): Promise<Users[] | dataPaginationResponse> {
    const { profile, active, searchText, profileId, state, skip, take } = filter || {};
    
    const query = this.repository.manager
      .createQueryBuilder(Users, 'user')
      .innerJoinAndSelect('user.profile', 'profile');

    // Apply filters conditionally
    if (profile) {
      query.andWhere("profile.enumName = :enumName", { enumName: profile });
    }

    if (profileId) {
      query.andWhere("profile.id = :profileId", { profileId });
    }

    if (active) {
      query.andWhere('user.state = :activeState', { activeState: 'ACTIVO' });
    } else if (state) {
      query.andWhere('user.state = :state', { state });
    }

    if (searchText) {
      query.andWhere(
        '(user.name ILIKE :searchText OR user.surname ILIKE :searchText OR user.lastname ILIKE :searchText OR user.email ILIKE :searchText)',
        { searchText: `%${searchText}%` }
      );
    }

    // Apply pagination if skip and take are provided
    if (skip !== undefined && take !== undefined) {
      query.skip(skip).take(take);
    }

    // Order by name as default
    query.orderBy('user.name', 'ASC');

    const users = await query.getMany();

    // Return paginated response if skip and take are provided
    if (skip !== undefined && take !== undefined) {
      const total = await query.getCount();
      const page = Math.floor(skip / take) + 1;
      const limit = take;
      return {
        total,
        page,
        limit,
        data: users,
      };
    }

    return users;
  }

  async findById(id: string): Promise<Users | null> {
    const user = await this.repository.findOne({
      where: { id },
      relations: ['profile'],
    });
    
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    
    return user;
  }

  async findByUsername(username: string): Promise<Users | null> {
    return await this.repository.findOne({
      where: { username },
    });
  }

  async findByEmail(email: string): Promise<Users | null> {
    return await this.repository.findOne({
      where: { email },
    });
  }

  async create(user: Users): Promise<Users> {
    // Hash password before saving
    if (user.password) {
      const salt = await bcrypt.genSalt();
      user.password = await bcrypt.hash(user.password, salt);
    }

    // Set default state if not provided
    if (!user.state) {
      user.state = generalStateTypes.ACTIVO;
    }

    return await this.repository.save(user);
  }

  async update(id: string, userData: Partial<Users>): Promise<Users> {
    const user = await this.findById(id);
    
    // Only hash password if it's being updated and is not empty
    if (userData.password && userData.password.trim() !== '') {
      const salt = await bcrypt.genSalt();
      userData.password = await bcrypt.hash(userData.password, salt);
    } else if (userData.password === '') {
      // If empty password is provided, remove it from update data
      delete userData.password;
    }
    
    // Handle profile relation explicitly
    let profileUpdated = false;
    if (userData.profile && userData.profile.id) {
      const profileId = userData.profile.id;
      this.logger.debug(`Updating profile to ID ${profileId}`);
      
      // Update profile relation directly in the database
      try {
        await this.repository.manager.query(
          `UPDATE users SET profile = $1 WHERE id = $2`,
          [profileId, id]
        );
        profileUpdated = true;
      } catch (error) {
        this.logger.error('Error updating profile:', error);
      }
      
      // Also update the user object for the return value
      user.profile = { id: profileId } as any;
      
      // Remove profile from userData to prevent duplicate update
      delete userData.profile;
    }
    
    // Update other user data
    Object.keys(userData).forEach(key => {
      if (userData[key] !== undefined) {
        user[key] = userData[key];
      }
    });
    
    // If we've updated the profile directly with SQL, we might need to refresh the entity
    const updatedUser = await this.repository.save(user);
    
    if (profileUpdated) {
      // Fetch fresh data to ensure profile relation is correctly loaded
      return await this.findById(id);
    }
    
    return updatedUser;
  }

  async changeState(id: string, state: generalStateTypes): Promise<Users> {
    const user = await this.findById(id);
    
    user.state = state;
    
    return await this.repository.save(user);
  }
}
