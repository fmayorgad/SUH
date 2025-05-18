import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Profile } from '@models/profile.model';

import { ProfileRepository } from '@context/profile/domain/profile-repository';
import { ProfileModulePermission } from '@models/profile-module-permission';

@Injectable()
export class PgSQLProfileRepository implements ProfileRepository {
  constructor(
    @InjectRepository(Profile)
    private readonly repository: Repository<Profile>,
  ) {}

  async find(criteria?: Record<string, unknown>): Promise<any[]> {
    const query = this.repository.manager
      .createQueryBuilder(Profile, 'p')
      .leftJoinAndSelect('p.modules', 'm')
      .innerJoinAndSelect('m.permissions', 'pe');

     const associationSelectQueryBuilder = this.repository.manager
      .createQueryBuilder(ProfileModulePermission, 'association')
      .leftJoinAndSelect('association.profile', 'profile')
      .leftJoinAndSelect('association.module', 'module')
      .leftJoinAndSelect('association.permission', 'permission')
     /* .where('association.profile_id = profile.id')
      .andWhere('association.module_id = module.id')
      .andWhere('association.permission_id = permission.id'); */
      //.leftJoinAndMapMany('association.permissions', ProfileModulePermission, 'permission', 'permission.profileId = profile.id')

    const profiles = await query.getMany();

    const orderedAssociations = {};



    const associations = await associationSelectQueryBuilder.getRawMany();

    associations.forEach((association) => {
      if (!orderedAssociations[association.association_profile_id]) {
        orderedAssociations[association.association_profile_id] = {};
      }

      if (!orderedAssociations[association.association_profile_id][association.association_module_id]) {
        orderedAssociations[association.association_profile_id][association.association_module_id] = [];
      }

      orderedAssociations[association.association_profile_id][association.association_module_id].push({
        id: association.association_permission_id,
        name: association.permission_name,
        action: association.permission_action,
      });
    });

    //now, we delete from profile.modules.permissions the permissions that are not in orderedAssociations
    profiles.forEach((profile) => {
      profile.modules.forEach((module) => {
        module.permissions = !orderedAssociations[profile.id][module.id]  ? [] : orderedAssociations[profile.id][module.id];
      });
    });


    return profiles;
  }

  async create(profile: Profile): Promise<void> {
    await this.repository.save(profile);
  }

  async update(id: string, profile: Profile): Promise<void> {
    await this.repository.update(id, profile);
  }

  findByIdAndActive(id: string): Promise<Profile | null> {
    return this.repository.findOne({
      where: { id },
      relations: ['modules', 'modules.permissions'],
    });
  }
}
