import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Module } from 'src/core/domain/models/module.model';

import { ModuleRepository } from 'src/context/modules/domain/module-repository';

@Injectable()
export class pgSQLModuleRepository implements ModuleRepository {
  constructor(
    @InjectRepository(Module)
    private readonly repository: Repository<Module>,
  ) {}

  async find(criteria?: Record<string, unknown>): Promise<Module[]> {
    return await this.repository.manager.createQueryBuilder(Module, 'module').getMany();
  }

  async create(module: Module): Promise<Module> {
    return this.repository.save(module);
  }

  // async update(id: string, role: Role): Promise<void> {
  //   await this.repository.update(id, role);
  // }

  // findByIdAndActive(id: string): Promise<Role | null> {
  //   return this.repository.findOne({ where: { id, status: Status.ACTIVE } });
  // }
}
