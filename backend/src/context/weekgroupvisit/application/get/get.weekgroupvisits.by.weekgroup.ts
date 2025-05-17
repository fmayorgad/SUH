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

@Injectable()
export class GetWeekgroupVisitsByWeekgroup {
  constructor(
    @Inject('PgWeekgroupVisitRepository') private readonly repository: PgsqlWeekgroupVisitRepository,
  ) {}

  async execute(weekgroupId: string): Promise<WeekgroupVisit[]> {
    try {
      if (!weekgroupId) {
        throw new BadRequestException('Weekgroup ID is required');
      }

      const weekgroupVisits = await this.repository.getVisitsByWeekgroupId(weekgroupId);
      
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