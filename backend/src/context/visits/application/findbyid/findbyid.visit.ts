import { Inject, Injectable } from '@nestjs/common';
import { Visit } from '@models/visit.model';
import { VisitRepository } from '../../domain/visit.repository';

@Injectable()
export class FindByIdVisit {
  constructor(
    @Inject('PgsqlVisitRepository')
    private readonly visitRepository: VisitRepository,
  ) {}

  async execute(id: string): Promise<Visit | null> {
    return await this.visitRepository.findById(id);
  }
} 