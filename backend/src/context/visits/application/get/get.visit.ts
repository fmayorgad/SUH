import { Injectable, Inject } from '@nestjs/common';
import { VisitRepository } from '../../domain/visit.repository';
import { GetVisitDTO } from '../../infraestructure/dto/get.visit.dto';
import { Visit } from '@models/visit.model';
import { dataPaginationResponse } from '@models/app.model';

@Injectable()
export class GetVisits {
  constructor(
    @Inject('PgsqlVisitRepository') // Using the consistent provider token
    private readonly visitRepository: VisitRepository,
  ) {}

  async run(filter: GetVisitDTO): Promise<Visit[] | dataPaginationResponse> {
    return await this.visitRepository.getVisits(filter);
  }
} 