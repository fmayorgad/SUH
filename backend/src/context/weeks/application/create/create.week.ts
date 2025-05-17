import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
} from '@nestjs/common';
import { WeekRepository } from '../../domain/weeks.repository';
import { Week } from '@models/week.model';
import { generalStateTypes } from '@enums/general-state-type';
import { WeekStatesEnum } from '@enums/weekstates';
import { DataSource } from 'typeorm';
import { InjectDataSource } from '@nestjs/typeorm';
import { FiscalYear } from '@models/fiscalyears.model';
import { WeekStates } from '@models/week_states';
import { Weekgroup } from '@models/weekgroup.model';
import {CreateWeekgroup} from '../../../weekgroups/application/create/create.weekgroup';

@Injectable()
export class CreateWeek {
  constructor(
    @Inject('PgWeekRepository') private readonly repository: WeekRepository,
    @InjectDataSource() private dataSource: DataSource,
    private readonly createWeekGroup: CreateWeekgroup,
  ) {}

  async create(week: Week): Promise<any | null> {
    console.log('week :>> ', week);
    const storedWeek = new Week();

    if (!storedWeek) {
      throw new Error('Failed to create the week');
    }

    const activeFiscalYear = await this.dataSource.query(
      'SELECT * FROM fiscal_years WHERE state = $1',
      [generalStateTypes.ACTIVO],
    );

    if (!activeFiscalYear || activeFiscalYear.length === 0) {
      throw new Error('No hay un año Fiscal Activo');
    }

    storedWeek.name = week.name;
    storedWeek.description = week.description;
    storedWeek.startDate = week.startDate;
    storedWeek.endDate = week.endDate;
    storedWeek.week_state = WeekStates.ACTIVA;
    storedWeek.state = generalStateTypes.ACTIVO;

    storedWeek.fiscalyears = new FiscalYear();
    storedWeek.fiscalyears.id = activeFiscalYear[0].id;

    console.log('storing week :>> ', storedWeek);

    //validate the werkgroups prestadores have no common prestador
    const prestadores = week.weekGroups.map((weekGroup) =>
      weekGroup.weekgroupprestadores.map((prestador) => prestador),
    );
    const prestadoresFlat = prestadores.flat();
    const prestadoresSet = new Set(prestadoresFlat);
    
    if (prestadoresSet.size !== prestadoresFlat.length) {
      throw new BadRequestException(
        ['Los grupos de semana tienen prestadores repetidos'],
        {
          cause: new Error(),
          description: 'Los grupos de semana tienen prestadores repetidos',
        },
      );
    }

    //validate if there is any weejk with week_state = 'ACTIVA' and then return error messaje
     const activeWeek = await this.dataSource.query(
      'SELECT * FROM weeks WHERE week_state = $1',
      [WeekStatesEnum.ACTIVA],
    );
    
    if (activeWeek.length > 0) {
      throw new BadRequestException(
        ['Ya existe una Semana <strong> ACTIVA </strong> y debes  <strong>CERRARLA</strong> primero o dejarla como <strong>ATRASADA</strong>'],
        {
          cause: new Error(),
          description: 'Ya existe una semana activa',
        },
      );
    } 

    //validate if there is other week with date between the start and end date
    const weekInRange = await this.dataSource.query(
      `SELECT * FROM weeks as w  WHERE w."startDate" BETWEEN $1 and $2 OR w."endDate" BETWEEN $1 and $2`,
      [week.startDate, week.endDate],
    );

    console.log('weekInRange :>> ', weekInRange);
    if (weekInRange.length > 0) {
      throw new BadRequestException(
        [`Ya existe una Semana con rango entre las fechas dadas: "${weekInRange[0].name}"`],
        {
          cause: new Error(),
          description: 'Ya existe una semana con esas fechas',
        },
      );
    }

    //validate name
    const existingWeek = await this.repository.findByName(
      storedWeek.name,
    );

    if (existingWeek) {
      throw new BadRequestException(
        ['Ya existe una semana con ese nombre en el año fiscal activo'],
        {
          cause: new Error(),
          description:
            'Ya existe una semana con ese nombre en el año fiscal activo',
        },
      );
    }

    //create week
    const newWeek = await this.repository.create(storedWeek);

    console.log('week.weekgroups) :>> ', week);

    if (newWeek) {
      for (const weekGroupIterated of week.weekGroups) {
        const weekGroup = new Weekgroup();
        weekGroup.name = weekGroupIterated.name;
        weekGroup.description = weekGroupIterated.description;
        weekGroup.state = generalStateTypes.ACTIVO;
        weekGroup.weeks = new Week();
        weekGroup.lead = weekGroupIterated.lead;
        weekGroup.weeks.id = newWeek.id;
        weekGroup.weekgroupusers = weekGroupIterated.weekgroupusers;
        weekGroup.weekgroupprestadores = weekGroupIterated.weekgroupprestadores;


        /* const newWeekGroup = await this.dataSource
          .getRepository(Weekgroup)
          .save(weekGroup); */

        const newWeekGroup = await this.createWeekGroup.create(weekGroup);

        if (!newWeekGroup) {
          throw new Error('Failed to create the week group');
        }
      }
    }

    console.log('newWeek :>> ', newWeek);

    return newWeek;
  }
}
