import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ProfileModulePermissionSchema } from '@schemas/index';

import { SaveAssociations, GetAssociations, GetAssociationsFilters } from '../application';
import { AssociateRolesPostController, AssociateGetController, AssociateGetFilterController } from './controllers';
import { PsqlAssociateRolesRepository } from './persistence/pgSql-associate-roles-repository';

const ProviderAssociateRolesRepository = {
  provide: 'AssociateRolesRepository',
  useClass: PsqlAssociateRolesRepository,
};

@Module({
  imports: [TypeOrmModule.forFeature([ProfileModulePermissionSchema])],
  controllers: [AssociateRolesPostController, AssociateGetFilterController, AssociateGetController],
  providers: [ProviderAssociateRolesRepository, SaveAssociations, GetAssociationsFilters, GetAssociations],
})
export class AssociateRolesModule {
  GetAssociationsFilters;
}
