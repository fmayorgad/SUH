import { BaseModel } from './base.interface';
import type { identificationType } from './identification-type.interface';
import type { GeneralStateTypesEnum } from '@enums/general-state-types.enum';
import type { GenderTypesEnum } from '@enums/genders.enum';
import type { Profile } from './profile.interface';

export class Users extends BaseModel {
  name?: string;
  surname?: string;
  lastname?: string;
  birthday?: Date;
  gender?: GenderTypesEnum;
  identification_type?: identificationType;
  identification_number?: string;
  username?: string;
  password?: string;
  state?: GeneralStateTypesEnum;
  planta_code?: string;
  profile?: Profile;
  phone?: string;
  email?: string;
  signature?: string;
}
