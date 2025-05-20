import { WeekGroupRepository } from '../../domain/weekgroups.repository';
import { Weekgroup } from '@models/weekgroup.model';
import { PgsqlWeekGroupsRepository } from '../../infraestructure/persistence/pgsql.weekgroups.repository';
import { Payload } from '@models/payload.model';

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

  async findById(id: string, userPayload?: Payload): Promise<Weekgroup> {
    if (!id) {
      throw new BadRequestException('El ID es requerido');
    }
    
    let weekGroup: Weekgroup | null;
    
    // If no user payload or user is a PROGRAMADOR, show all data without filtering
    if (!userPayload || userPayload.profile?.name === 'PROGRAMADOR') {
      weekGroup = await this.repository.findById(id);
    } else {
      // Otherwise, filter by user
      weekGroup = await this.repository.findByIdForUser(id, userPayload.sub);
    }

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