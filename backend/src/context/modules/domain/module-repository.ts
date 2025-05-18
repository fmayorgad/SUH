import { Module } from 'src/core/domain/models/module.model';

export interface ModuleRepository {
  find(criteria?: Record<string, unknown>): Promise<Module[]>;

  create(module: Module): Promise<Module>;

  // update(id: string, role: Role): Promise<void>;
  // findByIdAndActive(id: string): Promise<Role | null>;
}
