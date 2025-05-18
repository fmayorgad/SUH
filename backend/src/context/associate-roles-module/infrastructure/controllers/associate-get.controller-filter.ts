import { Controller, Get, HttpCode, HttpStatus, Param, ParseIntPipe, ParseUUIDPipe, Query } from '@nestjs/common';

import { ApiBearerAuth, ApiConsumes, ApiTags } from '@nestjs/swagger';

import { AllowUnauthorizedRequest, ModuleName, Permissions, User } from '@decorators/index';

import { Payload } from '@models/index';

import { GetAssociationsFilters, GetAssociationsInput } from '@context/associate-roles-module/application';
import { ProfileModulePermission } from '@models/index';
import { GetAssociationDTO } from '@context/associate-roles-module/infrastructure/dto/get-association.dto';
import { PermissionEnum } from '@enums/permissions';
import { ModulesEnum } from '@enums/modules';

@ApiTags('Associate-profiles')
@ApiBearerAuth()
@Controller('AssociateProfiles')
export class AssociateGetFilterController {
  constructor(private readonly getAssociationsFilters: GetAssociationsFilters) {}

  @ApiConsumes('application/json')
  @Get()
  @HttpCode(HttpStatus.OK)
  @Permissions(PermissionEnum.READ)
  @ModuleName(ModulesEnum.USERS)
  @AllowUnauthorizedRequest()
  async execute(
    @User() user: Payload,
    @Query() dto?: GetAssociationDTO,
  ): Promise<Record<string, ProfileModulePermission[]>> {
    const getAssociationsInput = new GetAssociationsInput();
    if (dto.profile) getAssociationsInput.profileId = dto.profile;
    if (dto.module) getAssociationsInput.moduleId = dto.module;
    if (dto.permission) getAssociationsInput.permissionId = dto.permission;

    const associate = await this.getAssociationsFilters.execute(getAssociationsInput);
    return { associate };
  }
}
