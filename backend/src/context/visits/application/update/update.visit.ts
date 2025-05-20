import { BadRequestException, Inject, Injectable, Logger, ForbiddenException } from '@nestjs/common';
import { VisitRepository } from '../../domain/visit.repository';
import { Visit } from '@models/visit.model';
import { UpdateVisitDto } from '../../infraestructure/dto/update.visit.dto';
import { Payload } from '@models/payload.model';

@Injectable()
export class UpdateVisit {
  private readonly logger = new Logger(UpdateVisit.name);

  constructor(
    @Inject('PgsqlVisitRepository')
    private readonly visitRepository: VisitRepository,
  ) { }

  async execute(id: string, updateVisitDto: UpdateVisitDto, userPayload?: Payload): Promise<Visit> {
    this.logger.log(`Updating visit with ID: ${id}`);

    //ensure the visit with notification_sended is false
    const visit = await this.visitRepository.findById(id);
    
    if (!visit) {
      throw new BadRequestException('Visita no encontrada.');
    }
    
    if (visit.notification_sended) {
      throw new BadRequestException('El informe ya fue enviado y no puede ser modificado.');
    }

    // If user is not a PROGRAMADOR, validate user is the lead
    if (userPayload && userPayload.profile?.name !== 'PROGRAMADOR') {
      const isLead = visit.weekgroupVisit?.lead?.id === userPayload.sub;
      
      if (!isLead) {
        throw new ForbiddenException('Solo el líder de la visita puede modificarla');
      }
    }

    //validate there s no other visit with the same SADE, requesting all visits where sade is the same
    if (updateVisitDto.sade) {  
      const visitWithSameSade = await this.visitRepository.findBySade(updateVisitDto.sade);
      if (visitWithSameSade && visitWithSameSade.id !== id) {
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