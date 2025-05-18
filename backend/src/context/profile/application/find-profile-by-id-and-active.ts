import { Inject, Injectable } from '@nestjs/common';
import { ProfileRepository } from '@context/profile/domain/profile-repository';
import { Profile } from '@models/profile.model';

@Injectable()
export class FindProfileByIdAndActive {
  constructor(@Inject('PfRepository') private readonly repository: ProfileRepository) {}

  async execute(id: string): Promise<Profile | null> {
    return await this.repository.findByIdAndActive(id);
  }
}
