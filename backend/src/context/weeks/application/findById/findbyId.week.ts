import { WeekRepository } from '../../domain/weeks.repository';
import { Week } from '@models/week.model';
import { PgsqlWeeksRepository } from '../../infraestructure/persistence/pgsql.weeks.repository';

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
    private readonly repository: PgsqlWeeksRepository,
  ) {}

  async findById(id: string): Promise<Week> {
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
