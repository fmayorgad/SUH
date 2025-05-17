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
export class FindByIdWeekGroup {
  constructor(
    @Inject('PgWeekGroupRepository')
    private readonly repository: PgsqlWeekGroupsRepository,
  ) {}

  async findById(id: string): Promise<Weekgroup> {
    if (!id) {
      throw new BadRequestException('El ID es requerido');
    }
    const weekGroup = await this.repository.findById(id);

    if (!weekGroup) {
      throw new HttpException(
        'No existe un grupo de semana con ese ID',
        HttpStatus.NOT_FOUND,
        {
          cause: new Error(),
          description: 'No existe un grupo de semana con ese ID',
        }, 
      );
    }

    return weekGroup;
  }
} 