import { Inject, Injectable, Logger } from '@nestjs/common';

import { GetAssociationsInput } from './get-associations-input';

import { ProfileModulePermission } from '@models/index';

import { AssociateRolesRepository } from '../domain/associate-roles-repository';

@Injectable()
export class GetAssociationsFilters {
  constructor(
    @Inject('AssociateRolesRepository')
    private readonly repository: AssociateRolesRepository,
  ) { }

  async execute(filters: GetAssociationsInput): Promise<ProfileModulePermission[]> {
    return await this.repository.findForFilters(filters);
  }
}
