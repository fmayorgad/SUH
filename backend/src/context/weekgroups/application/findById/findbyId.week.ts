import { WeekGroupRepository } from '../../domain/weekgroups.repository';
import { Weekgroup } from '@models/weekgroup.model';
import { PgsqlWeekGroupsRepository } from '../../infraestructure/persistence/pgsql.weekgroups.repository';

import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
} from '@nestjs/common';

@Injectable()
export class FindByIdWeek {
  constructor(
    @Inject('PgWeekRepository')
    private readonly repository: PgsqlWeekGroupsRepository,
  ) {}

  async findById(id: string): Promise<Weekgroup> {
    if (!id) {
      throw new BadRequestException('El ID es requerido');
    }
    const week = await this.repository.findById(id);
    console.log('week :>> ', week);

    if (!week) {
      throw new HttpException(
        'No existe una semana con ese ID',
        HttpStatus.NOT_FOUND,
        {
          cause: new Error(),
          description: 'No existe una semana con ese ID',
        }, 
      );
    }

    return week;
  }
}
