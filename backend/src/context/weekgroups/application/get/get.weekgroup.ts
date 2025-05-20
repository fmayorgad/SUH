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
      
      // If user is not a PROGRAMADOR, add userId to filter to restrict results
      if (userPayload && userPayload.sub && userPayload.profile?.name !== 'PROGRAMADOR') {
        filter.userId = userPayload.sub;
      }
      
      const weekGroups = await this.repository.getWeekGroups(filter);
      return weekGroups;
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
