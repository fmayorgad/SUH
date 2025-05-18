import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ProfileSchema } from '@schemas/profile.schema';

import { CreateProfile, FindProfiles, UpdateProfile, FindProfileByIdAndActive } from '@context/profile/application';

import {
  ProfileGetController,
  ProfilePatchController,
  ProfilePostController,
  ProfilesGetController,
} from './controller';

import { PgSQLProfileRepository } from './persistence/pgsql-profile-repository';

export const ProfileRepositoryProvider = {
  provide: 'PfRepository',
  useClass: PgSQLProfileRepository,
};

@Module({
  imports: [TypeOrmModule.forFeature([ProfileSchema])],
  controllers: [ProfileGetController, ProfilePatchController, ProfilePostController, ProfilesGetController],
  providers: [ProfileRepositoryProvider, CreateProfile, FindProfiles, UpdateProfile, FindProfileByIdAndActive],
  exports: [ProfileRepositoryProvider, FindProfileByIdAndActive],
})
export class ProfileModule {}
