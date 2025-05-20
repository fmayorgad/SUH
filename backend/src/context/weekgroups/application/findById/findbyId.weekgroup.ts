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
  ForbiddenException
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

    // If user is not a PROGRAMADOR, check if they have access to this weekgroup
    if (userPayload && userPayload.profile?.name !== 'PROGRAMADOR') {
      const isLead = weekGroup.lead === userPayload.sub;
      const isMember = weekGroup.weekgroupusers?.some(u => u.id_user === userPayload.sub);
      
      if (!isLead && !isMember) {
        throw new ForbiddenException('No tienes permiso para acceder a este grupo de semanas');
      }
    }

    return weekGroup;
  }
} 