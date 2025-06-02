import { compare } from 'bcrypt';
import { BaseModel } from './base.model';
import type { identificationType } from './identification-type';
import type { generalStateTypes } from '@enums/general-state-type';
import type { genderTypes } from '@enums/genders';
import type { StatusStatesEnum } from '@enums/status-states.enum';
import type { Profile } from './profile.model';
import type { WeekgroupVisit } from './weekgroupvisit.model';
import type { VisitVerificadores } from './visit_verificadores.model';

export class Users extends BaseModel {
  name?: string;
  surname?: string;
  lastname?: string;
  birthday?: Date;
  gender?: genderTypes;
  identification_type?: identificationType;
  identification_number?: string;
  username?: string;
  password?: string;
  state?: generalStateTypes;
  status?: StatusStatesEnum;
  planta_code?: string;
  profile?: Profile;
  phone?: string;
  email?: string;
  signature?: string;
  ledWeekgroupVisits?: WeekgroupVisit[];
  visitVerificadores?: VisitVerificadores[];

  static async checkPassword(
    encodedPassword: string,
    password: string,
  ): Promise<boolean> {
    return await compare(password, encodedPassword);
  }
}
