import { EntitySchema } from 'typeorm';

import { Module } from '@models/module.model';

import { BaseSchema } from '@schemas/base.schema';
import { ModulesEnum } from '@enums/modules';

export const ModuleSchema = new EntitySchema<Module>({
  tableName: 'modules',
  name: 'Module',
  target: Module,
  columns: {
    ...BaseSchema,
    name: {
      type: String,
      length: 20,
    },
    description: {
      type: String,
      length: 120,
    },
    enumName: {
      type: 'enum',
      enum: ModulesEnum,
      unique: true,
    },
    father: {
      type: 'uuid',
    },
  },
  relations: {
    profiles: {
      type: 'many-to-many',
      target: 'Profile',
      joinTable: {
        name: 'profile_module_permission',
        joinColumn: {
          name: 'module_id',
          referencedColumnName: 'id',
        },
        inverseJoinColumn: {
          name: 'profile',
          referencedColumnName: 'id',
        },
      },
    },
    permissions: {
      type: 'many-to-many',
      target: 'Permission',
      joinTable: {
        name: 'profile_module_permission',
        joinColumn: {
          name: 'module_id',
          referencedColumnName: 'id',
        },
        inverseJoinColumn: {
          name: 'permission_id',
          referencedColumnName: 'id',
        },
      },
    },
    father: {
      type: 'many-to-one',
      target: 'Module',
      joinColumn: {
        name: 'father',
        referencedColumnName: 'id',
      },
    },
    id: {
      type: 'one-to-many',
      target: 'Module',
    },
  },
});
