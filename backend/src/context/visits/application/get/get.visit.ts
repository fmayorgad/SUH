import { Injectable, Inject } from '@nestjs/common';
import { VisitRepository } from '../../domain/visit.repository';
import { GetVisitDTO } from '../../infraestructure/dto/get.visit.dto';
import { Visit } from '@models/visit.model';
import { dataPaginationResponse } from '@models/app.model';
import { Payload } from '@models/payload.model';

@Injectable()
export class GetVisits {
  constructor(
    @Inject('PgsqlVisitRepository') // Using the consistent provider token
    private readonly visitRepository: VisitRepository,
  ) {}

  async run(filter: GetVisitDTO, userPayload?: Payload): Promise<Visit[] | dataPaginationResponse> {
    // If user is not a PROGRAMADOR, add userId to filter to restrict results
    if (userPayload && userPayload.sub && userPayload.profile?.name !== 'PROGRAMADOR') {
      filter.userId = userPayload.sub;
    }
    
    return await this.visitRepository.getVisits(filter);
  }
} 