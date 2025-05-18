import { ApiBearerAuth, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { Body, Controller, Post, UseInterceptors } from '@nestjs/common';

import { ModuleName, Permissions } from '@decorators/index';
import { PermissionEnum } from '@enums/permissions';
import { ModulesEnum } from '@enums/modules';

import { CreatePermission } from '../../application';
import { PermissionDTO } from '../dto/permission.dto';
import { Metadata } from '@decorators/metadata.decorator';
import { AuditInterceptor } from 'src/core/infraestructure/interceptors';

@ApiTags('Permisos')
@ApiBearerAuth()
@Controller('permissions')
export class PermissionPostController {
  constructor(private createPermission: CreatePermission) {}

  @ApiConsumes('application/x-www-form-urlencoded', 'application/json')
  @Post()
  @Permissions(PermissionEnum.CREATE)
  @ModuleName(ModulesEnum.PERMISSIONS)
  @Metadata('AUDIT','Editar Permisos')
    @UseInterceptors(AuditInterceptor)
  async execute(@Body() permissionDTO: PermissionDTO): Promise<Record<string, unknown>> {
    const permission = await this.createPermission.execute(permissionDTO.name, permissionDTO.action);

    return { permission };
  }
}
