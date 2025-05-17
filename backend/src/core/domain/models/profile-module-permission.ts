import type { Profile } from './profile.model';
import type { Module } from './module.model';
import type { Permission } from './permission.model';

export class ProfileModulePermission {
  profileId?: string;

  moduleId?: string;

  permissionId?: string;

  profile?: Profile;

  module?: Module;

  permission?: Permission;
}
