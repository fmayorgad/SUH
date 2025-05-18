import { Inject, Injectable, Logger } from '@nestjs/common';

import { SaveAssociationsInput } from './save-associations-input';

import { ProfileModulePermission } from '@models/index';

import { AssociateRolesRepository } from '../domain/associate-roles-repository';

@Injectable()
export class SaveAssociations {
  constructor(
    @Inject('AssociateRolesRepository')
    private readonly repository: AssociateRolesRepository,
  ) { }

  async execute(
    profileId: string,
    associations: SaveAssociationsInput[],
  ): Promise<void> {
    const associationsToSave = associations.map(
      ({ profileId, moduleId, permissionId }) => {
        const profileModulePermission = new ProfileModulePermission();
        profileModulePermission.profileId = profileId;
        profileModulePermission.moduleId = moduleId;
        profileModulePermission.permissionId = permissionId;

        return profileModulePermission;
      },
    );

    await this.repository.save(profileId, associationsToSave);
  }
}
