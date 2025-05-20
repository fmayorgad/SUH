import { WeekGroupRepository } from '../../domain/weekgroups.repository';
import { Weekgroup } from '@models/weekgroup.model';
import { WeekgroupGetDTO } from '../../infraestructure/dto/get.weekgroup.dto';
import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
} from '@nestjs/common';
import { PgsqlWeekGroupsRepository } from '../../infraestructure/persistence/pgsql.weekgroups.repository';
import { dataPaginationResponse } from '@models/app.model';
import { Payload } from '@models/payload.model';

@Injectable()
export class GetWeekGroups {
  constructor(
    @Inject('PgWeekGroupRepository') private readonly repository: PgsqlWeekGroupsRepository,
  ) {}

  async getWeekGroups(
    filter: WeekgroupGetDTO, 
    userPayload?: Payload
  ): Promise<Weekgroup[] | dataPaginationResponse> {
    try {
      console.log('filter :>> ', filter);
      
      // If no user payload or user is a PROGRAMADOR, show all data without filtering
      if (!userPayload || userPayload.profile?.name === 'PROGRAMADOR') {
        const weekGroups = await this.repository.getWeekGroups(filter);
        return weekGroups;
      } else {
        // Otherwise, filter by user
        const weekGroups = await this.repository.getWeekGroupsForUser(filter, userPayload.sub);
        return weekGroups;
      }
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: 'Error al obtener los grupos de semanas',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
