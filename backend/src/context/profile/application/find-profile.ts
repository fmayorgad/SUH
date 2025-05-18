import { Profile } from '@models/profile.model';
import { Inject } from '@nestjs/common';

import { ProfileRepository } from '../domain/profile-repository';

export class FindProfiles {
  constructor(@Inject('PfRepository') private readonly repository: ProfileRepository) {}

  async find(): Promise<Profile[]> {
    return await this.repository.find();
  }
}
