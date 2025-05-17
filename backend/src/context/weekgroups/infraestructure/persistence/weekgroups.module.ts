import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HttpModule } from '@nestjs/axios';

//schemas
import { WeekgroupsSchema } from '@schemas/weekgroup.schema';
import { WeekgroupUsersSchema } from '@schemas/weekgroupusers.schema';
import { WeekgroupPrestadoresSchema } from '@schemas/weekgroupprestadores.schema';
import { WeekSchema } from '@schemas/week.schema';
import { FiscalYearSchema } from '@schemas/fiscalyear.schema';
import { WeekgroupVisitSchema } from '@schemas/weekgroupvisit.schema';

// repositories
import { PgsqlWeekGroupsRepository } from './pgsql.weekgroups.repository';

// controllers
import { PostWeekGroupsController } from '../controllers/post-weekgroups.controller';
import { GetWeekGroupsController } from '../controllers/get.weekgroups.controller';
import { PutWeekGroupsController } from '../controllers/put.weekgroups.controller';

// application
import { CreateWeekgroup } from '../../application/create/create.weekgroup';
import { GetWeekGroups } from '../../application/get/get.weekgroup';
import { FindByIdWeekGroup } from '../../application/findById/findbyId.weekgroup';
import { UpdateWeekGroup } from '../../application/update/update.weekgroup';

const WeekgroupRepositoryProvider = {
    provide: 'PgWeekGroupRepository',
    useClass: PgsqlWeekGroupsRepository,
};

@Module({
    imports: [
        TypeOrmModule.forFeature([
            WeekgroupsSchema,
            WeekgroupUsersSchema,
            WeekgroupPrestadoresSchema,
            WeekSchema,
            FiscalYearSchema,
            WeekgroupVisitSchema,
        ]),
        HttpModule,
    ],
    controllers: [
        PostWeekGroupsController, 
        GetWeekGroupsController,
        PutWeekGroupsController
    ],
    providers: [
        WeekgroupRepositoryProvider,
        CreateWeekgroup, 
        GetWeekGroups,
        FindByIdWeekGroup,
        UpdateWeekGroup
    ],
    exports: [],
})
export class WeekgroupsModule {}