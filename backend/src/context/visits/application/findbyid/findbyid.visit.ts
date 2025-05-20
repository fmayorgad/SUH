import { Inject, Injectable, ForbiddenException } from '@nestjs/common';
import { Visit } from '@models/visit.model';
import { VisitRepository } from '../../domain/visit.repository';
import { Payload } from '@models/payload.model';

@Injectable()
export class FindByIdVisit {
  constructor(
    @Inject('PgsqlVisitRepository')
    private readonly visitRepository: VisitRepository,
  ) {}

  async execute(id: string, userPayload?: Payload): Promise<Visit | null> {
    const visit = await this.visitRepository.findById(id);
    
    if (!visit) {
      return null;
    }
    
    // If user is not a PROGRAMADOR, check if they have access to this visit
    if (userPayload && userPayload.profile?.name !== 'PROGRAMADOR') {
      // Check if user is lead or verificador
      const isLead = visit.weekgroupVisit?.lead?.id === userPayload.sub;
      const isVerificador = visit.visitVerificadores?.some(v => v.user_id?.id === userPayload.sub);
      
      if (!isLead && !isVerificador) {
        throw new ForbiddenException('No tienes permiso para acceder a esta visita');
      }
    }
    
    return visit;
  }
} 