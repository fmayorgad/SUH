import { Body, Controller, Post } from '@nestjs/common';

import { ApiBearerAuth, ApiConsumes, ApiTags } from '@nestjs/swagger';

import { CreateModule } from 'src/context/modules/application';

import { ModuleDTO } from '../dto/moduleDTO';
import { PermissionEnum } from 'src/core/domain/enums/permissions';
import { ModulesEnum } from 'src/core/domain/enums/modules';

import { ModuleName, Permissions } from 'src/core/infraestructure/decorators';
import { Module } from 'src/core/domain/models/module.model';

@ApiTags('Modulos')
@ApiBearerAuth()
@Controller('modules')
export class ModulePostController {
  constructor(private readonly createModule: CreateModule) {}

  @ApiConsumes('application/x-www-form-urlencoded', 'application/json')
  @Post()
  @Permissions(PermissionEnum.CREATE)
  @ModuleName(ModulesEnum.MODULES)
  async execute(@Body() moduleDTO: ModuleDTO): Promise<Record<string, Module>> {
    const module = await this.createModule.create(moduleDTO.name, moduleDTO.description, moduleDTO.enum);

    return { module };
  }
}
