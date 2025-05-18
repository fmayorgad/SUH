import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { PermissionSchema } from '@schemas/permission.schema';

import {
  CreatePermission,
  GetPermissions,
} from '@context/permissions/application';

import {
  PermissionPostController,
  PermissionsGetController,
} from './controllers';

import { PgsqlPermissionRepository } from './persistence/pgsql-permission-repository';

const PermissionRepositoryProvider = {
  provide: 'PrRepository',
  useClass: PgsqlPermissionRepository,
};

@Module({
  imports: [TypeOrmModule.forFeature([PermissionSchema])],
  controllers: [PermissionPostController, PermissionsGetController],
  providers: [PermissionRepositoryProvider, CreatePermission, GetPermissions],
})
export class PermissionsModule { }
