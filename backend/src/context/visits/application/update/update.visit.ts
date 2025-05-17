import { BadRequestException, Inject, Injectable, Logger } from '@nestjs/common';
import { VisitRepository } from '../../domain/visit.repository';
import { Visit } from '@models/visit.model';
import { UpdateVisitDto } from '../../infraestructure/dto/update.visit.dto';

@Injectable()
export class UpdateVisit {
  private readonly logger = new Logger(UpdateVisit.name);

  constructor(
    @Inject('PgsqlVisitRepository')
    private readonly visitRepository: VisitRepository,
  ) { }

  async execute(id: string, updateVisitDto: UpdateVisitDto): Promise<Visit> {
    this.logger.log(`Updating visit with ID: ${id}`);

    //ensure the visit with notification_sended is false
    const visit = await this.visitRepository.findById(id);
    if (visit.notification_sended) {
      throw new BadRequestException('El informe ya fue enviado y no puede ser modificado.');
    }

    //validate there s no other visit with the same SADE, requesting all visits where sade is the same
    if (updateVisitDto.sade) {  
      const visitWithSameSade = await this.visitRepository.findBySade(updateVisitDto.sade);
      if (visitWithSameSade) {
        throw new BadRequestException('Ya existe una visita con el mismo SADE.');
      }
    }

    try {
      // Use the repository to update the visit
      const updatedVisit = await this.visitRepository.update(id, updateVisitDto);

      this.logger.log(`Successfully updated visit with ID: ${id}`);
      return updatedVisit;
    } catch (error) {
      this.logger.error(`Error updating visit with ID ${id}:`, error);
      throw error;
    }
  }
} 