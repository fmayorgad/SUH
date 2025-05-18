import { Inject, Injectable, Logger } from '@nestjs/common';

import { SaveAssociationsInput } from './save-associations-input';

import { ProfileModulePermission } from '@models/index';

import { AssociateRolesRepository } from '../domain/associate-roles-repository';

@Injectable()
export class GetAssociations {
  constructor(
    @Inject('AssociateRolesRepository')
    private readonly repository: AssociateRolesRepository,
  ) {}

  async execute(profileId: string): Promise<ProfileModulePermission[]> {
    return await this.repository.findById(profileId);
  }
}
