import { EntitySchema } from 'typeorm';

import { Permission } from '@models/permission.model';
import { PermissionEnum } from '@enums/permissions';

export const PermissionSchema = new EntitySchema({
  tableName: 'permissions',
  name: 'Permission',
  target: Permission,
  columns: {
    id: {
      type: 'uuid',
      primary: true,
      generated: 'uuid',
      unique: true,
    },
    name: {
      type: String,
      length: 36,
    },
    action: {
      type: 'enum',
      enum: PermissionEnum,
    },
  },
});
