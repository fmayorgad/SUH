import { ApiBearerAuth, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { Controller, Get } from '@nestjs/common';

import { ModuleName, Permissions, AllowUnauthorizedRequest } from '@decorators/index';
import { PermissionEnum } from '@enums/permissions';
import { ModulesEnum } from '@enums/modules';

import { GetPermissions } from '../../application';

@ApiTags('Permissions')
@ApiBearerAuth()
@Controller('permissions')
export class PermissionsGetController {
  constructor(private getPermissions: GetPermissions) {}

  @ApiConsumes('application/json')
  @Get()
  @Permissions(PermissionEnum.LIST)
  @ModuleName(ModulesEnum.PERMISSIONS)
  // @AllowUnauthorizedRequest()
  async execute(): Promise<Record<string, unknown>> {
    const permissions = await this.getPermissions.execute();

    return { permissions };
  }
}
