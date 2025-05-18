import { Inject, Injectable } from '@nestjs/common';

import { Profile } from '@models/profile.model';
import { ProfileRepository } from '../domain/profile-repository';

@Injectable()
export class CreateProfile {
  constructor(@Inject('PfRepository') private readonly repository: ProfileRepository) {}

  async create(name: string): Promise<void> {
    const profile = new Profile();
    // profile.id = id;
    profile.name = name;
    await this.repository.create(profile);
  }
}
