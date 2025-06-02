import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { VisitNota } from '@models/visit-nota.model';
import { VisitNotaRepository } from '../../domain/visit-nota.repository';
import { CreateVisitNotaDTO } from '../dto/create.visit-nota.dto';
import { VisitNotaSchema } from '@schemas/visit-nota.schema';

@Injectable()
export class PgsqlVisitNotaRepository implements VisitNotaRepository {
  constructor(
    @InjectRepository(VisitNotaSchema)
    private readonly visitNotaRepository: Repository<VisitNota>,
  ) {}

  async create(createVisitNotaDto: CreateVisitNotaDTO): Promise<VisitNota> {

    console.log("createVisitNotaDto", createVisitNotaDto);
    
    const visitNota = this.visitNotaRepository.create({
      visit_id: createVisitNotaDto.visitId,
      body: createVisitNotaDto.contenido,
      acta_number: createVisitNotaDto.numeroActaInforme,
      type: createVisitNotaDto.tipoDocumento,
      justification: createVisitNotaDto.justification,
      nota_sended: false,
    });

    return await this.visitNotaRepository.save(visitNota);
  }

  async findById(id: string): Promise<VisitNota | null> {
    return await this.visitNotaRepository.findOne({
      where: { id },
      relations: [
        'visit', 
        'visit.prestador', 
        'visit.prestador.fiscalYearInformation',
        'visit.prestador.fiscalYearInformation.municipio',
        'visit.fiscalYear', 
        'visit.weekgroupVisit', 
        'visit.weekgroupVisit.lead',
        'visit.visitVerificadores',
        'visit.visitVerificadores.user_id',
      ],
    });
  }

  async findByVisitId(visitId: string): Promise<VisitNota[]> {
    return await this.visitNotaRepository.find({
      where: { visit_id: visitId },
      relations: ['visit'],
    });
  }
} 