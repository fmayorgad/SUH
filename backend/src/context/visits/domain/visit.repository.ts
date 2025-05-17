import { Visit } from '@models/visit.model';
import { GetVisitDTO } from '../infraestructure/dto/get.visit.dto';
import { dataPaginationResponse } from '@models/app.model';
import { CreateVisitDTO } from '../infraestructure/dto/create.visit.dto';
import { UpdateVisitDto } from '../infraestructure/dto/update.visit.dto';
import { QueryRunner } from 'typeorm';

export interface VisitRepository {
  getVisits(filter: GetVisitDTO): Promise<Visit[] | dataPaginationResponse>;
  findById(id: string): Promise<Visit | null>;
  findBySade(sade: string): Promise<Visit | null>;
  create(createVisitDto: CreateVisitDTO, queryRunner?: QueryRunner): Promise<Visit>;
  update(id: string, updateVisitDto: UpdateVisitDto): Promise<Visit>;
  updateNotificationSended(id: string): Promise<Visit>;
  // Add delete methods as needed
} 