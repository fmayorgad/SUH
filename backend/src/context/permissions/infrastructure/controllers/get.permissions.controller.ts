import { ApiBearerAuth, ApiConsumes, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Controller, Get, HttpCode, HttpStatus, UseInterceptors } from '@nestjs/common';

import { ModuleName, Permissions, AllowUnauthorizedRequest } from '@decorators/index';
import { PermissionEnum } from '@enums/permissions';
import { ModulesEnum } from '@enums/modules';

import { GetPermissions } from '../../application';
import { AuditInterceptor } from 'src/core/infraestructure/interceptors';
@ApiTags('Permissions')
@ApiBearerAuth()
@Controller('permissions')
export class PermissionsGetController {
  constructor(private getPermissions: GetPermissions) {}

  @ApiConsumes('application/json')
  @Get()
  @HttpCode(HttpStatus.OK)
  @Permissions(PermissionEnum.READ) // Add appropriate permissions
  @ModuleName(ModulesEnum.VISITS) // Create VISITS in ModulesEnum if needed
  @ApiOperation({ summary: 'Get permissions' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Permissions retrieved successfully',
    type: Object
  }) 
  async execute(): Promise<Record<string, unknown>> {
    const permissions = await this.getPermissions.execute();

    return { permissions };
  }
}
