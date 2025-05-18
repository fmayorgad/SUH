import { Controller, Get, HttpCode, HttpStatus, Param, ParseIntPipe, ParseUUIDPipe, Query } from '@nestjs/common';

import { ApiBearerAuth, ApiConsumes, ApiTags } from '@nestjs/swagger';

import { PermissionEnum } from '@enums/permissions';
import { ModulesEnum } from '@enums/modules';

import { AllowUnauthorizedRequest, ModuleName, Permissions, User } from '@decorators/index';

import { Payload } from '@models/index';

import { GetAssociations } from '@context/associate-roles-module/application';
import { ProfileModulePermission } from '@models/index';

@ApiTags('Associate-profiles')
@ApiBearerAuth()
@Controller('AssociateProfiles')
export class AssociateGetController {
  constructor(private readonly getAssociations: GetAssociations) {}

  @ApiConsumes('application/json')
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @Permissions(PermissionEnum.READ)
  @ModuleName(ModulesEnum.USERS)
  @AllowUnauthorizedRequest()
  async execute(
    @User() user: Payload,
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<Record<string, ProfileModulePermission[]>> {
    const associate = await this.getAssociations.execute(id);
    return { associate };
  }
}
