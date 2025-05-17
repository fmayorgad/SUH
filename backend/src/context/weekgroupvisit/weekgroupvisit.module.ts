import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WeekgroupVisitSchema } from '@schemas/weekgroupvisit.schema';
import { WeekgroupsSchema } from '@schemas/weekgroup.schema';
import { UserSchema } from '@schemas/user.schema';
import { PrestadorSchema } from '@schemas/prestador.schema';
import { WeekgroupPrestadoresSchema } from '@schemas/weekgroupprestadores.schema';
import { GetWeekgroupVisits } from './application/get/get.weekgroupvisit';
import { CreateWeekgroupVisit } from './application/create/create.weekgroupvisit';
import { GetWeekgroupVisitController } from './infraestructure/controllers/get.weekgroupvisit.controller';
import { PostWeekgroupVisitController } from './infraestructure/controllers/post.weekgroupvisit.controller';
import { PgsqlWeekgroupVisitRepository } from './infraestructure/persistence/pgsql.weekgroupvisit.repository';
import { GetWeekgroupVisitsByWeekgroup } from './application/get/get.weekgroupvisits.by.weekgroup';
import { GetWeekgroupVisitsByWeekgroupController } from './infraestructure/controllers/get.weekgroupvisits.by.weekgroup.controller';
import { UpdateWeekgroupVisit } from './application/update/update.weekgroupvisit';
import { PatchWeekgroupVisitController } from './infraestructure/controllers/patch.weekgroupvisit.controller';

const applicationServices = [
  GetWeekgroupVisits,
  CreateWeekgroupVisit,
  GetWeekgroupVisitsByWeekgroup,
  UpdateWeekgroupVisit,
];

const infrastructure = [
  {
    provide: 'PgWeekgroupVisitRepository',
    useClass: PgsqlWeekgroupVisitRepository,
  },
];

@Module({
  imports: [TypeOrmModule.forFeature([
    WeekgroupVisitSchema,
    WeekgroupsSchema,
    UserSchema,
    PrestadorSchema,
    WeekgroupPrestadoresSchema
  ])],
  controllers: [
    GetWeekgroupVisitController, 
    PostWeekgroupVisitController,
    GetWeekgroupVisitsByWeekgroupController,
    PatchWeekgroupVisitController,
  ],
  providers: [...applicationServices, ...infrastructure],
  exports: [...applicationServices],
})
export class WeekgroupVisitModule {} 