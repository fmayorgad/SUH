import { Inject, Injectable } from '@nestjs/common';

import { Module } from 'src/core/domain/models/module.model';
import { ModuleRepository } from '../domain/module-repository';
import { ModulesEnum } from 'src/core/domain/enums/modules';

@Injectable()
export class CreateModule {
  constructor(@Inject('ModRepository') private readonly repository: ModuleRepository) {}

  async create(name: string, description: string, enumName: ModulesEnum): Promise<Module> {
    const module = new Module();
    module.name = name;
    module.description = description;
    module.enumName = enumName;

    return this.repository.create(module);
  }
}
