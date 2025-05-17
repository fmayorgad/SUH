import { WeekRepository } from '../../domain/weeks.repository';
import { Week } from '@models/week.model';
import { WeekGetDTO } from '../../infraestructure/dto/get.dto';
import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
} from '@nestjs/common';
import { PgsqlWeeksRepository } from '../../infraestructure/persistence/pgsql.weeks.repository';
import { dataPaginationResponse } from '@models/app.model';

@Injectable()
export class GetWeeks {
  constructor(
    @Inject('PgWeekRepository') private readonly repository: PgsqlWeeksRepository,
  ) {}

  async getWeeks(filter: WeekGetDTO): Promise<Week[] | dataPaginationResponse> {
    try {
    
      const weeks = await this.repository.getWeeks(filter);   

      return weeks;
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: 'Error al obtener las semanas',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
