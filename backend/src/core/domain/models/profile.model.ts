import { BaseModel } from './base.model';
import type { generalStateTypes } from '@enums/general-state-type';
import type { ProfilesEnum } from '@enums/profiles';
import type { Module } from '@models/module.model';
import type { Users } from '@models/user.model';

export class Profile extends BaseModel {
  name!: string;
  state!: generalStateTypes;
  enumName!: ProfilesEnum;
  modules: Module[];
  users?: Users[];
}
