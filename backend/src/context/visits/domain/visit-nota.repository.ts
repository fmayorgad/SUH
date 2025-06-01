import { VisitNota } from '@models/visit-nota.model';
import { CreateVisitNotaDTO } from '../infraestructure/dto/create.visit-nota.dto';

export interface VisitNotaRepository {
  create(createVisitNotaDto: CreateVisitNotaDTO): Promise<VisitNota>;
  findById(id: string): Promise<VisitNota | null>;
  findByVisitId(visitId: string): Promise<VisitNota[]>;
} 