import { Controller, Get } from '@nestjs/common';

import { ApiBearerAuth, ApiConsumes, ApiTags } from '@nestjs/swagger';

import { Profile } from '@models/profile.model';
import { AllowUnauthorizedRequest, ModuleName, Permissions } from '@decorators/index';
import { PermissionEnum } from '@enums/permissions';
import { ModulesEnum } from '@enums/modules';

import { FindProfiles } from '@context/profile/application/find-profile';

@ApiTags('Profiles')
@ApiBearerAuth()
@Controller('profile')
export class ProfilesGetController {
  constructor(private readonly useCase: FindProfiles) {}

  @ApiConsumes('application/json')
  @Get()
  @Permissions(PermissionEnum.LIST)
  @ModuleName(ModulesEnum.VISITS)
  // @AllowUnauthorizedRequest()
  async execute(): Promise<Record<string, Profile[]>> {
    const profiles = await this.useCase.find();

    return { profiles };
  }
}
