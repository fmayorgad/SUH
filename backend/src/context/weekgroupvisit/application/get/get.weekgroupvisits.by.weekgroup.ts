import { WeekgroupVisitRepository } from '../../domain/weekgroupvisit.repository';
import { WeekgroupVisit } from '@models/weekgroupvisit.model';
import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PgsqlWeekgroupVisitRepository } from '../../infraestructure/persistence/pgsql.weekgroupvisit.repository';
import { Payload } from '@models/payload.model';

@Injectable()
export class GetWeekgroupVisitsByWeekgroup {
  constructor(
    @Inject('PgWeekgroupVisitRepository') private readonly repository: PgsqlWeekgroupVisitRepository,
  ) {}

  async execute(weekgroupId: string, userPayload?: Payload): Promise<WeekgroupVisit[]> {
    try {
      if (!weekgroupId) {
        throw new BadRequestException('Weekgroup ID is required');
      }

      let userId: string | undefined;
      
      // If user is not a PROGRAMADOR, add userId to filter
      if (userPayload && userPayload.sub && userPayload.profile?.name !== 'PROGRAMADOR') {
        userId = userPayload.sub;
      }
      
      const weekgroupVisits = await this.repository.getVisitsByWeekgroupId(weekgroupId, userId);
      
      if (!weekgroupVisits || weekgroupVisits.length === 0) {
        return []; // Return empty array if no visits found
      }
      
      return weekgroupVisits;
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: 'Error al obtener las visitas del grupo de semanas',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
} 