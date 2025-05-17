import { BaseModel } from './base.model';

import { Permission } from './permission.model';
import { Profile } from './profile.model';

export class Module extends BaseModel {
  name?: string;
  description?: string;
  enumName?: string;
  profiles?: Profile[];
  permissions?: Permission[];
  father?: string;
}
