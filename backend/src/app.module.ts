import { APP_GUARD } from '@nestjs/core';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from '@database/database.module';
import { JwtAuthGuard } from '@guards/jwt-auth.guard';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Reflector } from '@nestjs/core';

import { AuthModule } from '@context/auth/infra/auth.module';
import { OAuthModule } from '@context/o-auth/infrastructure/o-auth.module';
import { PrestadoresModule } from '@context/prestadores/infraestructure/prestadores.module';
import { UsersModule } from '@context/users/infraestructure/users.module';
import { WeeksModule } from '@context/weeks/infraestructure/weeks.module';
import { WeekgroupsModule } from '@context/weekgroups/infraestructure/persistence/weekgroups.module';
import { WeekgroupVisitModule } from '@context/weekgroupvisit/weekgroupvisit.module';
import { VisitModule } from '@context/visits/visit.module';
import { ServicioModule } from '@context/servicios/servicio.module';
import { PermissionsGuard } from '@guards/permissions.guard';
import { GetModulesUSer } from '@context/auth/application';
import { PgLoginRepository } from '@context/auth/infra/persistence/pg-authrepository';
import { UserSchema, ProfileModulePermissionSchema } from '@schemas/index';
import { ModulesModule } from '@context/modules/infrastructure/modules.module';
import { ProfileModule } from '@context/profile/infrastructure/profile.module';
import { PermissionsModule } from '@context/permissions/infrastructure/permissions.module';
import { CoreModule } from './core/infraestructure/services/core.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    DatabaseModule,
    OAuthModule,
    CoreModule,
    AuthModule,
    TypeOrmModule.forFeature([UserSchema, ProfileModulePermissionSchema]),
    PrestadoresModule,
    UsersModule,
    WeeksModule,
    WeekgroupsModule,
    WeekgroupVisitModule,
    VisitModule,
    ServicioModule,
    ModulesModule,
    ProfileModule,
    PermissionsModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
    	provide: APP_GUARD,
    	useClass: PermissionsGuard,
    },
    PermissionsGuard,
    GetModulesUSer,
    PgLoginRepository,
    {
      provide: 'AuthRepository',
      useClass: PgLoginRepository,
    },
    Reflector,
  ],
})
export class AppModule {}
