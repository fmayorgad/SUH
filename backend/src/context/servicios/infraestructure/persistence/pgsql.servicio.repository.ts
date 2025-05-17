import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Brackets, Repository } from 'typeorm';
import { ServicioRepository } from '../../domain/servicio.repository';
import { Servicio } from '@models/servicio.model';
import { GetServicioDTO } from '../dto/get.servicio.dto';
import { dataPaginationResponse } from '@models/app.model';// Needed for relation

@Injectable()
export class PgsqlServicioRepository implements ServicioRepository {
  private readonly logger = new Logger(PgsqlServicioRepository.name);

  constructor(
    @InjectRepository(Servicio)
    private readonly repository: Repository<Servicio>,
  ) { }

  async findById(id: string): Promise<Servicio | null> {
    this.logger.log(`Finding servicio by id: ${id}`);
    // Adjust relations as needed based on ServicioSchema
    return await this.repository.findOne({
      where: { id },
      relations: ['grupoServicio', 'complexity'], // Example relations
    });
  }

  async getAll(filter: GetServicioDTO): Promise<Servicio[] | dataPaginationResponse> {
    this.logger.log(`Getting all servicios with filter: ${JSON.stringify(filter)}`);
    const query = this.repository.createQueryBuilder('servicio')
      .leftJoinAndSelect('servicio.grupoServicio', 'grupoServicio')

    if (filter.searchText) {
      query.andWhere(new Brackets(qb => {
        qb.where('servicio.name ILIKE :searchText', { searchText: `%${filter.searchText}%` })
          .orWhere('servicio.code ILIKE :searchText', { searchText: `%${filter.searchText}%` });
      }));
    }

    if (filter.grupoServicioId) {
      query.andWhere('servicio.grupo_servicio_id = :grupoServicioId', { grupoServicioId: filter.grupoServicioId });
    }

    // Add other filters (state, complexityId, etc.) here

    query.orderBy('servicio.name', 'ASC'); // Default sort

    if (filter?.skip) {
      query.skip(filter?.skip).take(filter?.take);
    } else {
      query.orderBy('servicio.name', 'ASC');
    }


    if (filter?.skip && filter?.take) {
      const total = await query.getCount();
      const data = await query.skip(filter.skip).take(filter.take).getMany();

      const page = Math.floor(filter?.skip / filter?.take) + 1;
      const limit = filter?.take;
      return {
        total,
        page,
        limit,
        data
      };
    }
    else {
      return await query.getMany();
    }
  }

  // Implement create, update, delete methods here
} 