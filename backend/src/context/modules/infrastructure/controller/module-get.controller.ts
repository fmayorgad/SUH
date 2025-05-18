import { Controller, Get } from '@nestjs/common';

import { ApiBearerAuth, ApiConsumes, ApiTags } from '@nestjs/swagger';

import { Module } from '@models/module.model';
import { PermissionEnum } from '@enums/permissions';
import { ModulesEnum } from '@enums/modules';
import { ModuleName, Permissions, AllowUnauthorizedRequest } from '@decorators/index';

import { GetModules } from '@context/modules/application/get-modules';

@ApiTags('Modulos')
@ApiBearerAuth()
@Controller('modules')
export class ModuleGetController {
  constructor(private readonly getModules: GetModules) {}

  @ApiConsumes('application/json')
  @Get()
  @Permissions(PermissionEnum.READ) // Add appropriate permissions
  @ModuleName(ModulesEnum.VISITS) // Create VISITS in ModulesEnum if needed
  // @AllowUnauthorizedRequest()
  async execute(): Promise<Record<string, Module[]>> {
    const modules = await this.getModules.execute();

    return { modules };
  }
}
