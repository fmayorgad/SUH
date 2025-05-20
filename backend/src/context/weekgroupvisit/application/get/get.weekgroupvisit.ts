import { WeekgroupVisitRepository } from '../../domain/weekgroupvisit.repository';
import { WeekgroupVisit } from '@models/weekgroupvisit.model';
import { WeekgroupVisitGetDTO } from '../../infraestructure/dto/get.weekgroupvisit.dto';
import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
} from '@nestjs/common';
import { PgsqlWeekgroupVisitRepository } from '../../infraestructure/persistence/pgsql.weekgroupvisit.repository';
import { dataPaginationResponse } from '@models/app.model';
import { Payload } from '@models/payload.model';

@Injectable()
export class GetWeekgroupVisits {
  constructor(
    @Inject('PgWeekgroupVisitRepository') private readonly repository: PgsqlWeekgroupVisitRepository,
  ) {}

  async getWeekgroupVisits(
    filter: WeekgroupVisitGetDTO, 
    userPayload?: Payload
  ): Promise<WeekgroupVisit[] | dataPaginationResponse> {
    try {
      // If no user payload or user is a PROGRAMADOR, show all data without filtering
      if (!userPayload || userPayload.profile?.name === 'PROGRAMADOR') {
        const weekgroupVisits = await this.repository.getWeekgroupVisits(filter);
        return weekgroupVisits;
      } else {
        // Otherwise, filter by user
        const weekgroupVisits = await this.repository.getWeekgroupVisitsForUser(filter, userPayload.sub);
        return weekgroupVisits;
      }
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: 'Error al obtener las visitas de grupos de semanas',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}