import { WeekgroupVisitRepository } from '../../domain/weekgroupvisit.repository';
import { WeekgroupVisit } from '@models/weekgroupvisit.model';
import { UpdateWeekgroupVisitDTO } from '../../infraestructure/dto/update.weekgroupvisit.dto';
import { BadRequestException, HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { PgsqlWeekgroupVisitRepository } from '../../infraestructure/persistence/pgsql.weekgroupvisit.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Weekgroup } from '@models/weekgroup.model';
import { Users } from '@models/user.model';
import { Prestador } from '@models/prestador.model';
import { WeekgroupsSchema } from '@schemas/weekgroup.schema';
import { UserSchema } from '@schemas/user.schema';
import { PrestadorSchema } from '@schemas/prestador.schema';

@Injectable()
export class UpdateWeekgroupVisit {
  constructor(
    @Inject('PgWeekgroupVisitRepository') private readonly repository: PgsqlWeekgroupVisitRepository,
    @InjectRepository(WeekgroupsSchema)
    private readonly weekgroupRepository: Repository<Weekgroup>,
    @InjectRepository(UserSchema)
    private readonly userRepository: Repository<Users>,
    @InjectRepository(PrestadorSchema)
    private readonly prestadorRepository: Repository<Prestador>,
  ) {}

  async updateWeekgroupVisit(id: string, updateDto: UpdateWeekgroupVisitDTO): Promise<WeekgroupVisit | null> {
    try {
      // Find the existing WeekgroupVisit
      const existingVisit = await this.repository.findById(id);
      if (!existingVisit) {
        throw new BadRequestException(`WeekgroupVisit with id ${id} not found`);
      }

      // Update properties from DTO
      if (updateDto.description !== undefined) {
        existingVisit.description = updateDto.description;
      }
      if (updateDto.state !== undefined) {
        existingVisit.state = updateDto.state as any; // Cast to appropriate enum type
      }
      if (updateDto.visitDate !== undefined) {
        existingVisit.visitDate = updateDto.visitDate;
      }
      if (updateDto.visitType !== undefined) {
        existingVisit.visitType = updateDto.visitType;
      }
      if (updateDto.visitState !== undefined) {
        existingVisit.visitState = updateDto.visitState;
      }
      if (updateDto.notes !== undefined) {
        existingVisit.notes = updateDto.notes;
      }

      // Update related entities if provided
      if (updateDto.weekgroup) {
        const weekgroup = await this.weekgroupRepository.findOne({
          where: { id: updateDto.weekgroup },
        });
        if (!weekgroup) {
          throw new BadRequestException(`Weekgroup with id ${updateDto.weekgroup} not found`);
        }
        existingVisit.weekgroup = weekgroup;
      }

      if (updateDto.lead) {
        const lead = await this.userRepository.findOne({
          where: { id: updateDto.lead },
        });
        if (lead) {
          existingVisit.lead = lead;
        }
      }

      if (updateDto.prestador) {
        const prestador = await this.prestadorRepository.findOne({
          where: { id: updateDto.prestador },
        });
        if (prestador) {
          existingVisit.prestador = prestador;
        }
      }

      // Save the updated entity
      const updatedVisit = await this.repository.update(existingVisit);
      return updatedVisit;
    } catch (error) {
      console.error('Error updating weekgroup visit:', error);
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: 'Error al actualizar la visita de grupo de semanas',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
} 