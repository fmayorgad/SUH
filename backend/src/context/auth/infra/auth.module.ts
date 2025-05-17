import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import {
  ModuleSchema,
  ProfileSchema,
  ProfileModulePermissionSchema,
  UserSchema,
  PermissionSchema,
} from '@schemas/index';

import { RefreshToken, Register, GetModulesUSer, UserAuthenticator } from '@context/auth/application';

import { PgLoginRepository } from './persistence/pg-authrepository';

import {
  AuthPostController,
  RefreshTokenController,
  RegisterController,
} from '@context/auth/infra/controllers';

const LoginRepositoryProvider = {
  provide: 'AuthRepository',
  useClass: PgLoginRepository,
};

const applicationServices = [UserAuthenticator, RefreshToken, Register, GetModulesUSer];

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ModuleSchema,
      PermissionSchema,
      ProfileSchema,
      ProfileModulePermissionSchema,
      UserSchema,
    ]),
  ],
  controllers: [AuthPostController, RefreshTokenController, RegisterController],
  providers: [PgLoginRepository, LoginRepositoryProvider, ...applicationServices],
  exports: [GetModulesUSer, LoginRepositoryProvider],
})
export class AuthModule {}
