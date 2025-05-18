import { Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { ProfileModulePermission } from '@models/index';

import { AssociateRolesRepository } from '../../domain/associate-roles-repository';
import { GetAssociationsInput } from '@context/associate-roles-module/application/get-associations-input';

export class PsqlAssociateRolesRepository implements AssociateRolesRepository {
  constructor(
    @InjectRepository(ProfileModulePermission)
    private readonly repository: Repository<ProfileModulePermission>,
  ) {}

  async save(profileId: string, associations: ProfileModulePermission[]): Promise<void> {
    await this.delete(profileId);
    if (associations.length) {
      await this.repository.save(associations);
    }
  }

  findById(id: string): Promise<ProfileModulePermission[] | null> {
    return this.repository.find({
      where: { profileId: id },
      relations: ['profile', 'profile.modules', 'profile.modules.permissions'],
    });
  }

  async findForFilters(filtros: GetAssociationsInput): Promise<ProfileModulePermission[]> {
    const associationSelectQueryBuilder = this.repository.manager
      .createQueryBuilder(ProfileModulePermission, 'association')
      .leftJoin('association.profile', 'profile')
      .leftJoin('association.module', 'module')
      .leftJoin('association.permission', 'permission').select(`
        profile.id as profile_id,
        profile.name as profile_name,
        module.id as module_id,
        module.name as module_name,
        module.enumName as module_enum,
        permission.id as permission_id,
        permission.name as permission_name,
        permission.action as permission_action
      `);

    if (filtros?.profileId) {
      associationSelectQueryBuilder.andWhere(`association.profileId = '${filtros?.profileId}'`);
    }

    if (filtros?.moduleId) {
      associationSelectQueryBuilder.andWhere(`association.moduleId = '${filtros?.moduleId}'`);
    }

    if (filtros?.permissionId) {
      associationSelectQueryBuilder.andWhere(`association.permissionId = '${filtros?.permissionId}'`);
    }
    return await associationSelectQueryBuilder.orderBy('permission.name', 'ASC').getRawMany();
  }

  async delete(profileId: string): Promise<void> {
    await this.repository
      .createQueryBuilder()
      .delete()
      .from(ProfileModulePermission)
      .where('profileId = :profileId', {
        profileId,
      })
      .execute();
  }
}
