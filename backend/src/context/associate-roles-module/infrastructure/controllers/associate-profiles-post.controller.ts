import { ApiBearerAuth, ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { Body, Controller, Logger, ParseArrayPipe, ParseUUIDPipe, Put, Query, UseInterceptors } from '@nestjs/common';

import { ModuleName, Permissions } from '@decorators/index';
import { PermissionEnum } from '@enums/permissions';
import { ModulesEnum } from '@enums/modules';

import { SaveAssociations } from '../../application/save-associations';
import { AssociationRoleModulePermissionDTO } from '../dto/association-role-module-permission.dto';
import { SaveAssociationsInput } from '@context/associate-roles-module/application';
import { AllowUnauthorizedRequest } from '@decorators/index';
import { Metadata } from '@decorators/metadata.decorator';
import { AuditInterceptor } from '@interceptors/audit.interceptor';

@ApiTags('Associate-profiles')
@ApiBearerAuth()
@Controller('AssociateProfiles')
export class AssociateRolesPostController {
  constructor(private readonly saveAssociations: SaveAssociations) {}
  @ApiConsumes('application/x-www-form-urlencoded', 'application/json')
  @ApiBody({ type: [AssociationRoleModulePermissionDTO] })
  @ApiConsumes('application/json')
  @Put('associate-modules-permissions')
  @Metadata('AUDIT','Editar permisos de perfil')
  @UseInterceptors(AuditInterceptor)
  
  @Permissions(PermissionEnum.CREATE)
  @AllowUnauthorizedRequest()
  @ModuleName(ModulesEnum.PROFILES)
  async execute(
    @Body(new ParseArrayPipe({ items: AssociationRoleModulePermissionDTO }))
    associations: AssociationRoleModulePermissionDTO[],
    @Query('ProfileId', ParseUUIDPipe) ProfileId: string,
  ): Promise<Record<string, unknown>> {

    const associationsInput = associations.map(
      ({ profileId, moduleId, permissionId }) => new SaveAssociationsInput(profileId, moduleId, permissionId),
    );

    const data = await this.saveAssociations.execute(ProfileId, associationsInput);

    return { data};
  }
}
