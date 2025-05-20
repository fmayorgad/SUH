import { Controller, Get, Param, ParseUUIDPipe } from '@nestjs/common';

import { ApiBearerAuth, ApiConsumes, ApiTags } from '@nestjs/swagger';

import { Profile } from '@models/profile.model';
import { AllowUnauthorizedRequest, ModuleName, Permissions } from '@decorators/index';
import { PermissionEnum } from '@enums/permissions';
import { ModulesEnum } from '@enums/modules';

import { FindProfileByIdAndActive } from '@context/profile/application';

@ApiTags('Profiles')
@ApiBearerAuth()
@Controller('profile')
export class ProfileGetController {
  constructor(private readonly useCase: FindProfileByIdAndActive) {}

  @ApiConsumes('application/json')
  @Get(':id')
  @Permissions(PermissionEnum.READ)
  @ModuleName(ModulesEnum.PROFILES)
  //@AllowUnauthorizedRequest()
  async execute(@Param('id', ParseUUIDPipe) id: string): Promise<Record<string, Profile>> {
    const role = await this.useCase.execute(id);

    return { role };
  }
}
