import type { Profile } from './general.interface';

export interface User {
  id: string;
  name?: string;
  surname?: string;
  lastname?: string;
  birthday?: Date;
  gender?: string;
  identification_type?: string;
  identification_number?: string;
  username?: string;
  state?: string;
  planta_code?: string;
  profile?: Profile;
  phone?: string;
  email?: string;
}
