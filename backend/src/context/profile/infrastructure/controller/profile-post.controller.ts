import { Body, Controller, Post, UseInterceptors } from '@nestjs/common';

import { ApiBearerAuth, ApiConsumes, ApiTags } from '@nestjs/swagger';

import { CreateProfile } from '@context/profile/application/create-profile';

import { ProfileDTO } from '../dto/profile.dto';
import { PermissionEnum } from '@enums/permissions';
import { ModulesEnum } from '@enums/modules';

import { AllowUnauthorizedRequest, ModuleName, Permissions } from '@decorators/index';
import { Metadata } from '@decorators/metadata.decorator';
import { AuditInterceptor } from 'src/core/infraestructure/interceptors';

@ApiTags('Profiles')
@ApiBearerAuth()
@Controller('profile')
export class ProfilePostController {
  constructor(private readonly createProfile: CreateProfile) {}

  @ApiConsumes('application/x-www-form-urlencoded', 'application/json')
  @Post()
  @Permissions(PermissionEnum.CREATE)
  @ModuleName(ModulesEnum.PROFILES)
  @Metadata('AUDIT','Crear perfil')
    @UseInterceptors(AuditInterceptor)
  // @AllowUnauthorizedRequest()
  async execute(@Body() profile: ProfileDTO): Promise<void> {
    return await this.createProfile.create(profile.name);
  }
}
