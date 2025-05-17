import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
} from '@nestjs/common';
import { Weekgroup } from '@models/weekgroup.model';
import { generalStateTypes } from '@enums/general-state-type';
import { DataSource } from 'typeorm';
import { InjectDataSource } from '@nestjs/typeorm';
import { Week } from '@models/week.model';
import { stat } from 'fs';
import { WeekgroupUsers } from '@models/weekgroup_users.model';
import { WeekgroupPrestadores } from '@models/weekgroup_prestadores.model';
import { WeekStates } from '@models/week_states';

@Injectable()
export class CreateWeekgroup {
  constructor(@InjectDataSource() private dataSource: DataSource) {}

  async create(weekGroupData: any): Promise<Weekgroup | null> {
    console.log('weekGroupData :>> ', weekGroupData);
    const week = new Week();

    //check if comes any week id or week object
    if (weekGroupData.id_week || weekGroupData.weeks?.id) {
      const activeWeek = await this.dataSource.getRepository(Week).findOne({
        where: {
          state: generalStateTypes.ACTIVO,
          id: weekGroupData.id_week || weekGroupData.weeks?.id,
        },
      });
      if (!activeWeek.id) {
        throw new HttpException(
          'No existe una Semana activa con ese ID',
          HttpStatus.BAD_REQUEST,
        );
      }
    } else {
      const activeWeek = await this.dataSource.getRepository(Week).findOne({
        where: {
          week_state: WeekStates.ACTIVA,
        },
      });

      console.log('activeWeek :>> ', activeWeek);

      if (!activeWeek.id) {
        throw new HttpException(
          'No existe una Semana activa',
          HttpStatus.BAD_REQUEST,
        );
      }
      week.id = activeWeek.id;
    }

    //check the active week

    const weekGroup = new Weekgroup();
    weekGroup.name = weekGroupData.name;
    weekGroup.description = weekGroupData.description;
    weekGroup.state = generalStateTypes.ACTIVO;
    weekGroup.lead = weekGroupData.lead;
    weekGroup.weeks = week;
    weekGroup.weeks.id =
      week.id || weekGroupData.id_week || weekGroupData.weeks?.id;

    //validate if the weekGroup already exists
    const existingWeekGroup = await this.dataSource
      .getRepository(Weekgroup)
      .findOne({
        where: {
          name: weekGroup.name,
          id_week: week.id || weekGroupData.id_week || weekGroupData.weeks?.id,
        },
      });

    if (existingWeekGroup) {
      throw new BadRequestException(
        [
          'Ya existe un Grupo de Semana con ese nombre en la Semana seleccionada',
        ],
        {
          cause: new Error(),
          description:
            'Ya existe un Grupo de Semana con ese nombre en la Semana seleccionada',
        },
      );
    }

    console.log('storing weekGroup :>> ', weekGroup);

    const newWeekGroup = await this.dataSource
      .getRepository(Weekgroup)
      .save(weekGroup);

    if (!newWeekGroup) {
      throw new Error('Failed to create the week group');
    }

    //create weekgroup_users
    const weekgroupUsersToStore: WeekgroupUsers[] = [];

    for (const user of weekGroupData.weekgroupusers) {
      const weekGroupUser = new WeekgroupUsers();
      weekGroupUser.id_user = user;
      weekGroupUser.id_weekgroup = newWeekGroup;
      weekGroupUser.state = generalStateTypes.ACTIVO;
      weekgroupUsersToStore.push(weekGroupUser);
    }

    console.log('weekGroupUsers a guardar :>> ', weekgroupUsersToStore);

    const weekGroupUsersRepository =
      this.dataSource.getRepository(WeekgroupUsers);
    const weekGroupUsersResult = await weekGroupUsersRepository.insert(
      weekgroupUsersToStore,
    );

    if (!weekGroupUsersResult) {
      throw new Error('Failed to create the week group users');
    }

    //create weekgroup_prestadores

    const weekGroupPrestadoresToStore: WeekgroupPrestadores[] = [];
    for (const prestador of weekGroupData.weekgroupprestadores) {
      const weekGroupPrestador = new WeekgroupPrestadores();
      weekGroupPrestador.id_weekgroup = newWeekGroup;
      weekGroupPrestador.id_prestador = prestador;
      weekGroupPrestador.state = generalStateTypes.ACTIVO;
      weekGroupPrestadoresToStore.push(weekGroupPrestador);
    }
    console.log(
      'weekGroupPrestadores a guardar :>> ',
      weekGroupPrestadoresToStore,
    );
    const weekGroupPrestadoresRepository =
      this.dataSource.getRepository(WeekgroupPrestadores);
    const weekGroupPrestadoresResult =
      await weekGroupPrestadoresRepository.insert(weekGroupPrestadoresToStore);
    if (!weekGroupPrestadoresResult) {
      throw new Error('Failed to create the week group prestadores');
    }
    console.log('weekGroupPrestadoresResult :>> ', weekGroupPrestadoresResult);

    console.log('weekGroupUsersResult :>> ', weekGroupUsersResult);

    console.log('newWeekGroup :>> ', newWeekGroup);

    return newWeekGroup;
  }
}
