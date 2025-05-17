import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import type { Repository } from 'typeorm';

import { Users } from '@models/user.model';
import { generalStateTypes } from '@enums/general-state-type';

import type { AuthRepository } from '@context/auth/domain/auth-repository';
import { ProfileModulePermission } from '@models/profile-module-permission';

@Injectable()
export class PgLoginRepository implements AuthRepository {
  constructor(
    @InjectRepository(Users)
    private readonly repository: Repository<Users>,
    @InjectRepository(ProfileModulePermission)
    private readonly repositoryProfileModulePermission: Repository<ProfileModulePermission>,
  ) {}

  searchUser(login: string): Promise<Users | null> {
    return this.repository.findOne({
      relations: ['profile'],
      where: [
        { identification_number: login,  state: generalStateTypes.ACTIVO },
        { email: login,  state: generalStateTypes.ACTIVO },
      ],
      select: ['id', 'username', 'password', 'profile', 'name', 'surname', 'lastname'],
    });
  }

  searchUserModules(id: string): Promise<Users | null> {
    return this.repository.findOne({
      relations: ['profile', 'profile.modules', 'profile.modules.permissions'],
      where: [{ id: id, state: generalStateTypes.ACTIVO }],
      select: ['id'],
    });
  }

  async searchUserMenu(moduleId: string, profileId: string, permissionId: string): Promise<boolean | null> {
     const resp = await this.repositoryProfileModulePermission
      .createQueryBuilder('pmp')
      .select(['pmp.module_id', 'pmp.profile_id', 'pmp.permission_id'])
      .where('pmp.module_id = :moduleId', { moduleId })
      .andWhere('pmp.profile_id = :profileId', { profileId })
      .andWhere('pmp.permission_id = :permissionId', { permissionId })
      .getRawOne();
    
    return resp ? true : false; 
  }
}
