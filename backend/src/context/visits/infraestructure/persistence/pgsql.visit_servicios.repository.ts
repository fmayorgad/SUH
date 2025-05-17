import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { VisitServicios } from '@models/visit_servicios.model';
import { VisitServiciosSchema } from '@schemas/visit_servicios.schema';

@Injectable()
export class PgsqlVisitServiciosRepository {
  constructor(
    @InjectRepository(VisitServiciosSchema)
    private visitServiciosRepository: Repository<VisitServicios>,
  ) {}

  async findByVisitId(visitId: string): Promise<VisitServicios[]> {
    return this.visitServiciosRepository.find({
      where: { visit_id: { id: visitId } },
      relations: ['servicio_id'],
    });
  }

  async create(visitServicios: VisitServicios): Promise<VisitServicios> {
    return this.visitServiciosRepository.save(visitServicios);
  }

  async update(visitServicios: VisitServicios): Promise<VisitServicios> {
    return this.visitServiciosRepository.save(visitServicios);
  }

  async delete(id: string): Promise<void> {
    await this.visitServiciosRepository.delete(id);
  }
} 