import { Profile } from '@models/profile.model';

export interface ProfileRepository {
  find(criteria?: Record<string, unknown>): Promise<Profile[]>;
  create(profile: Profile): Promise<void>;
  update(id: string, role: Profile): Promise<void>;
  findByIdAndActive(id: string): Promise<Profile | null>;
}
