import { BaseModel } from '@interfaces/base.interface';
import type { GeneralStateTypesEnum } from '@enums/general-state-types.enum';
import type { ProfilesEnum } from '@enums/profiles.enum';
import type { ModulesEnum } from '@enums/modules.enum';
import type { Users } from '@interfaces/user.interace';

export class Profile extends BaseModel {
  name!: string;
  state!: GeneralStateTypesEnum;
  enumName!: ProfilesEnum;
  modules: ModulesEnum[];
  users?: Users[];
}
