import { Inject, Injectable } from '@nestjs/common';

import { Profile } from '@models/profile.model';
import { ProfileRepository } from '../domain/profile-repository';

@Injectable()
export class UpdateProfile {
  constructor(@Inject('PfRepository') private readonly repository: ProfileRepository) {}

  async update(id: string, name: string): Promise<void> {
    const role = new Profile();
    role.name = name;
    await this.repository.update(id, role);
  }
}
