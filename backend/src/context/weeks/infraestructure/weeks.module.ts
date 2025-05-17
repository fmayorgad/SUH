import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HttpModule } from '@nestjs/axios';
import { WeekSchema } from '@schemas/week.schema';
import { WeekgroupsSchema } from '@schemas/weekgroup.schema';
import { WeekgroupUsersSchema } from '@schemas/weekgroupusers.schema';
import { WeekgroupPrestadoresSchema } from '@schemas/weekgroupprestadores.schema';
import { FiscalYearSchema } from '@schemas/fiscalyear.schema';

//repositories
import { PgsqlWeeksRepository } from './persistence/pgsql.weeks.repository';

//controllers
import { PostWeeksController } from './controllers/post.weeks.controller';
import { GetWeeksController } from './controllers/get.weeks.controller';
import { PutWeeksController } from './controllers/put.weeks.controller';

//application
import { CreateWeek } from '../application/create/create.week';
import { GetWeeks } from '../application/get/get.week';
import { FindByIdWeek } from '../application/findById/findbyId.week';
import { CreateWeekgroup } from '../../weekgroups/application/create/create.weekgroup';
import { UpdateWeek } from '../application/update/update.week';

const WeekRepositoryProvider = {
  provide: 'PgWeekRepository',
  useClass: PgsqlWeeksRepository,
};

@Module({
  imports: [
    TypeOrmModule.forFeature([
      WeekSchema,
      WeekgroupsSchema,
      WeekgroupUsersSchema,
      WeekgroupPrestadoresSchema,
      FiscalYearSchema,
    ]),
    HttpModule,
  ],
  controllers: [PostWeeksController, GetWeeksController, PutWeeksController],
  providers: [
    WeekRepositoryProvider,
    CreateWeek,
    CreateWeekgroup,
    GetWeeks,
    FindByIdWeek,
    UpdateWeek,
  ],
  exports: [],
})
export class WeeksModule {}
