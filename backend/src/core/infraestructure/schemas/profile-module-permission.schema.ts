import { EntitySchema } from 'typeorm';

import { ProfileModulePermission as RMP } from '@models/profile-module-permission';

export const ProfileModulePermissionSchema = new EntitySchema<RMP>({
  tableName: 'profile_module_permission',
  name: 'ProfileModulePermission',
  target: RMP,
  columns: {
    profileId: {
      name: 'profile_id',
      type: 'uuid',
      primary: true,
    },
    moduleId: {
      name: 'module_id',
      type: 'uuid',
    },
    permissionId: {
      name: 'permission_id',
      type: 'uuid',
    },
  },
  // indices: [
  //   {
  //     columns: ['profileId', 'moduleId', 'permissionId'],
  //     unique: true,
  //   },
  // ],
  relations: {
    profile: {
      type: 'many-to-one',
      target: 'Profile',
      joinColumn: {
        name: 'profile_id',
        referencedColumnName: 'id',
      },
    },
    module: {
      type: 'many-to-one',
      target: 'Module',
      joinColumn: {
        name: 'module_id',
        referencedColumnName: 'id',
      },
    },
    permission: {
      type: 'many-to-one',
      target: 'Permission',
      joinColumn: {
        name: 'permission_id',
        referencedColumnName: 'id',
      },
    },
  },
});
