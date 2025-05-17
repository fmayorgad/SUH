import type { ModulesEnum } from '@enums/modules';
import type { PermissionEnum } from '@enums/permissions';

export interface Permission {
  action: PermissionEnum;
}

export interface subModule {
  name: ModulesEnum;
  realName: string;
  permissions: Permission[];
}
export interface Module {
  name: ModulesEnum;
  realName: string;
  permissions: Permission[];
  subModules: subModule[];
}

export interface Profile {
  name: string;
}

export interface Payload {
  sub: string;
  username: string;
  changePassword: boolean;
  app_origin: string;
  profile: Profile;
  name: string;
  surname: string;
  lastname: string;
}

export interface Menu {
  modules: Module[];
}
