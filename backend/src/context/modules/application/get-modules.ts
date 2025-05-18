import { Inject, Injectable } from '@nestjs/common';

import { Module } from 'src/core/domain/models/module.model';
import { ModuleRepository } from '../domain/module-repository';

@Injectable()
export class GetModules {
  constructor(@Inject('ModRepository') private readonly repository: ModuleRepository) {}

  async execute(criteria?: Record<string, unknown>): Promise<Module[]> {
    return this.repository.find(criteria);
  }
}
