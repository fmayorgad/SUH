import { Body, Controller, HttpCode, Param, ParseIntPipe, ParseUUIDPipe, Patch, UseInterceptors } from '@nestjs/common';
import { ApiBearerAuth, ApiConsumes, ApiTags } from '@nestjs/swagger';

import { ModuleName, Permissions } from '@decorators/index';
import { PermissionEnum } from '@enums/permissions';
import { ModulesEnum } from '@enums/modules';

import { ProfileDTO } from '../dto/profile.dto';
import { UpdateProfile } from '@context/profile/application/update-profile';
import { Metadata } from '@decorators/metadata.decorator';
import { AuditInterceptor } from 'src/core/infraestructure/interceptors';

@ApiTags('Profiles')
@ApiBearerAuth()
@Controller('profile')
export class ProfilePatchController {
  constructor(private readonly updateProfile: UpdateProfile) {}

  @ApiConsumes('application/x-www-form-urlencoded', 'application/json')
  @Patch(':id')
  @HttpCode(204)
  @Permissions(PermissionEnum.UPDATE)
  @ModuleName(ModulesEnum.PROFILES)
  @Metadata('AUDIT','Editar perfil')
    @UseInterceptors(AuditInterceptor)
  async create(@Param('id', ParseUUIDPipe) id: string, @Body() profile: ProfileDTO): Promise<void> {
    await this.updateProfile.update(id, profile.name);
  }
}
