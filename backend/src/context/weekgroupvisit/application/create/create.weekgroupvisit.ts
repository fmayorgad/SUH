import { WeekgroupVisitRepository } from '../../domain/weekgroupvisit.repository';
import { WeekgroupVisit } from '@models/weekgroupvisit.model';
import { CreateWeekgroupVisitDTO } from '../../infraestructure/dto/create.weekgroupvisit.dto';
import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
} from '@nestjs/common';
import { PgsqlWeekgroupVisitRepository } from '../../infraestructure/persistence/pgsql.weekgroupvisit.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Weekgroup } from '@models/weekgroup.model';
import { Users } from '@models/user.model';
import { Prestador } from '@models/prestador.model';
import { WeekgroupsSchema } from '@schemas/weekgroup.schema';
import { UserSchema } from '@schemas/user.schema';
import { PrestadorSchema } from '@schemas/prestador.schema';
import { WeekgroupPrestadores } from '@models/weekgroup_prestadores.model';
import { WeekgroupPrestadoresSchema } from '@schemas/weekgroupprestadores.schema';
import { WeekGroupsPrestadoresEnum } from '@enums/weekgroupsprestadores';

@Injectable()
export class CreateWeekgroupVisit {
  constructor(
    @Inject('PgWeekgroupVisitRepository') private readonly repository: PgsqlWeekgroupVisitRepository,
    @InjectRepository(WeekgroupsSchema)
    private readonly weekgroupRepository: Repository<Weekgroup>,
    @InjectRepository(UserSchema)
    private readonly userRepository: Repository<Users>,
    @InjectRepository(PrestadorSchema)
    private readonly prestadorRepository: Repository<Prestador>,
    @InjectRepository(WeekgroupPrestadoresSchema)
    private readonly weekgroupPrestadoresRepository: Repository<WeekgroupPrestadores>
  ) { }

  async createWeekgroupVisit(createDto: CreateWeekgroupVisitDTO): Promise<WeekgroupVisit | null> {
    try {
      // Create new WeekgroupVisit entity
      const newWeekgroupVisit = new WeekgroupVisit();

      // Set properties from DTO
      newWeekgroupVisit.description = createDto.description;
      newWeekgroupVisit.state = createDto.state as any; // Cast to appropriate enum type
      newWeekgroupVisit.visitDate = createDto.visitDate;
      newWeekgroupVisit.visitType = createDto.visitType;
      newWeekgroupVisit.prestador = new Prestador();
      newWeekgroupVisit.prestador.id = createDto.prestador;
      newWeekgroupVisit.visitState = WeekGroupsPrestadoresEnum.AGENDADA;

      // Set the visitState if provided, otherwise it will use the default from the schema
      if (createDto.visitState) {
        newWeekgroupVisit.visitState = createDto.visitState;
      }

      // Find related entities
      if (createDto.weekgroup) {
        const weekgroup = await this.weekgroupRepository.findOne({
          where: { id: createDto.weekgroup },
        });
        if (!weekgroup) {
          throw new BadRequestException(`Weekgroup with id ${createDto.weekgroup} not found`);
        }
        newWeekgroupVisit.weekgroup = weekgroup;
      }

      if (createDto.lead) {
        const lead = await this.userRepository.findOne({
          where: { id: createDto.lead },
        });
        if (lead) {
          newWeekgroupVisit.lead = lead;
        }
      }

      if (createDto.prestador) {
        const prestador = await this.prestadorRepository.findOne({
          where: { id: createDto.prestador },
        });
        if (prestador) {
          newWeekgroupVisit.prestador = prestador;
        }
      }

      newWeekgroupVisit.notes = createDto.notes;

      // Save the entity
      const createdWeekgroupVisit = await this.repository.create(newWeekgroupVisit);

      return createdWeekgroupVisit;
    } catch (error) {
      console.error('Error creating weekgroup visit:', error);
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: 'Error al crear la visita de grupo de semanas',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
} 