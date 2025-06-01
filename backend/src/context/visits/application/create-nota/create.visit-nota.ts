import { Inject, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { VisitNotaRepository } from '../../domain/visit-nota.repository';
import { VisitRepository } from '../../domain/visit.repository';
import { CreateVisitNotaDTO } from '../../infraestructure/dto/create.visit-nota.dto';
import { VisitNota } from '@models/visit-nota.model';

@Injectable()
export class CreateVisitNota {
  private readonly logger = new Logger(CreateVisitNota.name);

  constructor(
    @Inject('PgsqlVisitNotaRepository')
    private readonly visitNotaRepository: VisitNotaRepository,
    @Inject('PgsqlVisitRepository')
    private readonly visitRepository: VisitRepository,
  ) {}

  async execute(createVisitNotaDto: CreateVisitNotaDTO): Promise<VisitNota> {
    try {
      // Verify that the visit exists
      const visit = await this.visitRepository.findById(createVisitNotaDto.visitId);
      if (!visit) {
        throw new NotFoundException(`Visit with ID ${createVisitNotaDto.visitId} not found`);
      }

      // Create the visit nota
      const visitNota = await this.visitNotaRepository.create(createVisitNotaDto);

      this.logger.log(`Visit nota created successfully with ID: ${visitNota.id}`);
      return visitNota;
    } catch (error) {
      this.logger.error(`Error creating visit nota: ${error.message}`);
      throw error;
    }
  }
} 