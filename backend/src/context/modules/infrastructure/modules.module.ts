import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ModuleSchema } from '@schemas/module.schema';

import { pgSQLModuleRepository } from './persistence/pgsql-module-repository.service';

import { CreateModule, GetModules } from '@context/modules/application';

import {
  ModuleGetController,
  ModulePostController,
} from './controller';

export const ModuleRepositoryProvider = {
  provide: 'ModRepository',
  useClass: pgSQLModuleRepository,
};

@Module({
  imports: [TypeOrmModule.forFeature([ModuleSchema])],
  controllers: [ModuleGetController, ModulePostController],
  providers: [ModuleRepositoryProvider, CreateModule, GetModules],
})
export class ModulesModule { }
