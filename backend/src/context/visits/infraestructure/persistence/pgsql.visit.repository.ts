import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, QueryRunner, EntityManager, In, Brackets, DataSource } from 'typeorm';
import { VisitRepository } from '../../domain/visit.repository';
import { isArray } from 'class-validator';

import { Visit } from '@models/visit.model';
import { GetVisitDTO } from '../dto/get.visit.dto';
import { CreateVisitDTO } from '../dto/create.visit.dto';
import { UpdateVisitDto } from '../dto/update.visit.dto';
import { dataPaginationResponse } from '@models/app.model';
import { VisitSchema } from '@schemas/visit.schema';
import { VisitGeneralStatesEnum } from '@enums/visit-general-states.enum';
import { VisitStatesEnum } from '@enums/visit-states.enum';
import { PrestadorFiscalyearInformation } from '@models/prestador-fiscalyear-information.model';
import * as moment from 'moment';

@Injectable()
export class PgsqlVisitRepository implements VisitRepository {
  private readonly logger = new Logger(PgsqlVisitRepository.name);

  constructor(
    @InjectRepository(VisitSchema)
    private readonly visitRepository: Repository<Visit>,
    private dataSource: DataSource,
  ) { }

  private getVisitStatesByGeneralState(generalState: VisitGeneralStatesEnum): VisitStatesEnum[] {
    switch (generalState) {
      case VisitGeneralStatesEnum.IN_PROCESS:
        return [
          VisitStatesEnum.VISITA_INICIADA,
          VisitStatesEnum.VISITA_PAUSADA,
          VisitStatesEnum.VISITA_FINALIZADA
        ];
      case VisitGeneralStatesEnum.NOT_INITIATED:
        return [
          VisitStatesEnum.VISITA_ESPERA_INICIO,
          VisitStatesEnum.COMUNICADO_PENDIENTE_VALIDACION,
          VisitStatesEnum.COMUNICADO_PENDIENTE_ENVIO,
          VisitStatesEnum.COMUNICADO_ENVIADO,
          VisitStatesEnum.COMUNICADO_PENDIENTE_GENERACION
        ];
      case VisitGeneralStatesEnum.FINISHED:
        return [VisitStatesEnum.INFORME_ENVIADO];
      default:
        return Object.values(VisitStatesEnum);
    }
  }

  async findById(id: string): Promise<Visit | null> {
    // Create a query builder to have more control over the query
    const queryBuilder = this.visitRepository.createQueryBuilder('visit')
      // Join all required relations
      .leftJoinAndSelect('visit.weekgroupVisit', 'weekgroupVisit')
      .leftJoinAndSelect('weekgroupVisit.weekgroup', 'weekgroup')
      .leftJoinAndSelect('weekgroupVisit.lead', 'lead')
      .leftJoinAndSelect('weekgroupVisit.prestador', 'weekgroupPrestador')
      .leftJoinAndSelect('visit.visitVerificadores', 'visitVerificadores')
      .leftJoinAndSelect('visitVerificadores.user_id', 'verificadorUser')
      .leftJoinAndSelect('visit.visitServicios', 'visitServicios')
      .leftJoinAndSelect('visitServicios.servicio_id', 'servicio')
      .leftJoinAndSelect('visit.visitRecorridos', 'visitRecorridos')
      .leftJoinAndSelect('visit.prestador', 'prestador')
      // First join the fiscal year information without conditions
      .leftJoinAndSelect('prestador.fiscalYearInformation', 'fiscalYearInformation')
      .leftJoinAndSelect('fiscalYearInformation.municipio', 'municipio')
      .leftJoinAndSelect('fiscalYearInformation.fiscalYear', 'infoFiscalYear')
      .leftJoinAndSelect('prestador.fiscalYearServicios', 'fiscalYearServicios')
      .leftJoinAndSelect('fiscalYearServicios.fiscalYear', 'serviciosFiscalYear')
      .leftJoinAndSelect('fiscalYearServicios.servicio', 'prestadorServicio')
      // Join the fiscal year capacidades information
      .leftJoinAndSelect('prestador.fiscalYearCapacidades', 'fiscalYearCapacidades')
      .leftJoinAndSelect('fiscalYearCapacidades.fiscalYear', 'capacidadesFiscalYear')
      .leftJoinAndSelect('visit.fiscalYear', 'fiscalYear')
      .leftJoinAndSelect('visit.creator', 'creator')
      // Then apply the filter condition on the already joined tables
      .where('visit.id = :id', { id })
      .andWhere('infoFiscalYear.state = :activeState', { activeState: 'ACTIVO' })
      .andWhere('serviciosFiscalYear.state = :activeState', { activeState: 'ACTIVO' });

    return await queryBuilder.getOne();
  }

  async getVisits(filter: GetVisitDTO): Promise<Visit[] | dataPaginationResponse> {
    // Use a subquery approach to filter visits by userId but preserve all members
    let query;
    
    if (filter.userId) {
      // First, find IDs of visits where user is lead or verificador
      const visitsIdsQuery = this.visitRepository
        .createQueryBuilder('v')
        .select('v.id')
        .leftJoin('v.weekgroupVisit', 'wgv')
        .leftJoin('wgv.lead', 'lead')
        .leftJoin('v.visitVerificadores', 'vv')
        .leftJoin('vv.user_id', 'vuser')
        .where('(lead.id = :userId OR vuser.id = :userId)', { userId: filter.userId });
        
      // Then use those IDs to filter in main query
      query = this.visitRepository.createQueryBuilder('visit')
        .leftJoinAndSelect('visit.weekgroupVisit', 'weekgroupVisit')
        .leftJoinAndSelect('weekgroupVisit.lead', 'lead')
        .leftJoinAndSelect('visit.prestador', 'prestador')
        .leftJoinAndSelect('visit.fiscalYear', 'fiscalYear')
        .leftJoinAndSelect('visit.visitVerificadores', 'verificadores')
        .leftJoinAndSelect('verificadores.user_id', 'user')
        .leftJoinAndSelect('visit.visitServicios', 'visitServicios')
        .leftJoinAndSelect('visitServicios.servicio_id', 'servicio')
        .leftJoinAndSelect('visit.visitRecorridos', 'visitRecorridos')
        .where(`visit.id IN (${visitsIdsQuery.getQuery()})`)
        .setParameters(visitsIdsQuery.getParameters());
    } else {
      // Standard query without userId filter
      query = this.visitRepository.createQueryBuilder('visit')
        .leftJoinAndSelect('visit.weekgroupVisit', 'weekgroupVisit')
        .leftJoinAndSelect('weekgroupVisit.lead', 'lead')
        .leftJoinAndSelect('visit.prestador', 'prestador')
        .leftJoinAndSelect('visit.fiscalYear', 'fiscalYear')
        .leftJoinAndSelect('visit.visitVerificadores', 'verificadores')
        .leftJoinAndSelect('verificadores.user_id', 'user')
        .leftJoinAndSelect('visit.visitServicios', 'visitServicios')
        .leftJoinAndSelect('visitServicios.servicio_id', 'servicio')
        .leftJoinAndSelect('visit.visitRecorridos', 'visitRecorridos');
    }

    if (filter.searchText) {
      query.andWhere(new Brackets(qb => {
        qb.where('prestador.nombreSede ILIKE :text', { text: `%${filter.searchText}%` })
          .orWhere('prestador.identificador ILIKE :text', { text: `%${filter.searchText}%` }) 
      }));
    }

    // Apply filters from GetVisitDTO
    if (filter.weekgroupVisitId) {
      query.andWhere('visit.weekgroup_visit_id = :weekgroupVisitId', {
        weekgroupVisitId: filter.weekgroupVisitId,
      });
    }

    // Handle general state filter
    if (filter.generalState && filter.generalState !== VisitGeneralStatesEnum.ALL) {
      const states = this.getVisitStatesByGeneralState(filter.generalState);
      query.andWhere('visit.visit_state IN (:...states)', { states });
    }

    // Handle specific state filter
    if (filter.specificState) {
      query.andWhere('visit.visit_state = :specificState', {
        specificState: filter.specificState,
      });
    }

    // Filter by lead IDs if provided
    if (filter.lead) {
      // Convert to array if it's a single string
      const leadArray = isArray(filter.lead) ? filter.lead : [filter.lead];
      if (leadArray.length > 0) {
        query.andWhere('lead.id IN (:...leadIds)', { leadIds: leadArray });
      }
    }

    // Filter by verificadores IDs if provided
    if (filter.verificadores) {
      // Convert to array if it's a single string
      const verificadoresArray = isArray(filter.verificadores) ? filter.verificadores : [filter.verificadores];
      if (verificadoresArray.length > 0) {
        query.andWhere('user.id IN (:...verificadoresIds)', { verificadoresIds: verificadoresArray });
      }
    }

    // Add pagination if needed
    if (filter.skip !== undefined && filter.take !== undefined) {
      const total = await query.getCount();
      const page = Math.floor(filter.skip / filter.take) + 1;
      const limit = filter.take;
      const data = await query.skip(filter.skip).take(filter.take).getMany();
      return {
        total,
        page,
        limit,
        data,
      };
    }

    return await query.getMany();
  }

  /**
   * Helper function to convert a JavaScript array to a string representation
   * @param values Array of values
   * @returns String representing the array formatted for PostgreSQL
   */
  private formatArrayAsString(values: string[]): string | null {
    if (!values || values.length === 0) {
      return null;
    }

    // Format UUIDs with PostgreSQL-style formatting: {uuid1,uuid2,...}
    return `{${values.map(val => `"${val}"`).join(',')}}`;
  }

  async create(createVisitDto: CreateVisitDTO, queryRunner?: QueryRunner): Promise<Visit> {
    // Create a new Visit instance
    const visit = new Visit();

    // Set base properties
    visit.start = createVisitDto.start;
    visit.end = createVisitDto.end;
    visit.date = createVisitDto.visitDate;
    visit.sade = createVisitDto.sade;
    visit.prestador_id = createVisitDto.prestadorId;
    visit.fiscal_year_id = createVisitDto.fiscalYearId;

    // Set string fields
    visit.th_todos = createVisitDto.th_todos;
    visit.th_propios = createVisitDto.th_propios;
    visit.infra_todos = createVisitDto.infra_todos;
    visit.infra_propios = createVisitDto.infra_propios;
    visit.dotacion_todos = createVisitDto.dotacion_todos;
    visit.dotacion_propios = createVisitDto.dotacion_propios;
    visit.mdi_todos = createVisitDto.mdi_todos;
    visit.mdi_propios = createVisitDto.mdi_propios;
    visit.procedimientos_todos = createVisitDto.procedimientos_todos;
    visit.procedimientos_propios = createVisitDto.procedimientos_propios;
    visit.hcr_todos = createVisitDto.hcr_todos;
    visit.hcr_propios = createVisitDto.hcr_propios;
    visit.interdependencias_todos = createVisitDto.interdependencias_todos;
    visit.interdependencias_propios = createVisitDto.interdependencias_propios;

    // Handle verificadores arrays by formatting as strings for character varying fields
    if (createVisitDto.th_verificadores) {
      const th_array = Array.isArray(createVisitDto.th_verificadores)
        ? createVisitDto.th_verificadores
        : [createVisitDto.th_verificadores];

      // Format as string
      (visit as any).th_verificadores = this.formatArrayAsString(th_array);
      this.logger.debug(`th_verificadores: ${(visit as any).th_verificadores}`);
    }

    if (createVisitDto.infra_verificadores) {
      const infra_array = Array.isArray(createVisitDto.infra_verificadores)
        ? createVisitDto.infra_verificadores
        : [createVisitDto.infra_verificadores];

      (visit as any).infra_verificadores = this.formatArrayAsString(infra_array);
    }

    if (createVisitDto.dotacion_verificadores) {
      const dotacion_array = Array.isArray(createVisitDto.dotacion_verificadores)
        ? createVisitDto.dotacion_verificadores
        : [createVisitDto.dotacion_verificadores];

      (visit as any).dotacion_verificadores = this.formatArrayAsString(dotacion_array);
    }

    if (createVisitDto.mdi_verificadores) {
      const mdi_array = Array.isArray(createVisitDto.mdi_verificadores)
        ? createVisitDto.mdi_verificadores
        : [createVisitDto.mdi_verificadores];

      (visit as any).mdi_verificadores = this.formatArrayAsString(mdi_array);
    }

    if (createVisitDto.procedimientos_verificadores) {
      const proc_array = Array.isArray(createVisitDto.procedimientos_verificadores)
        ? createVisitDto.procedimientos_verificadores
        : [createVisitDto.procedimientos_verificadores];

      (visit as any).procedimientos_verificadores = this.formatArrayAsString(proc_array);
    }

    if (createVisitDto.hcr_verificadores) {
      const hcr_array = Array.isArray(createVisitDto.hcr_verificadores)
        ? createVisitDto.hcr_verificadores
        : [createVisitDto.hcr_verificadores];

      (visit as any).hcr_verificadores = this.formatArrayAsString(hcr_array);
    }

    if (createVisitDto.interdependencias_verificadores) {
      const interdep_array = Array.isArray(createVisitDto.interdependencias_verificadores)
        ? createVisitDto.interdependencias_verificadores
        : [createVisitDto.interdependencias_verificadores];

      (visit as any).interdependencias_verificadores = this.formatArrayAsString(interdep_array);
    }

    // Set relation to weekgroupVisit if provided
    if (createVisitDto.weekgroupVisitId) {
      visit.weekgroupVisit = { id: createVisitDto.weekgroupVisitId } as any;
    }

    // Set relation to prestador if provided
    if (createVisitDto.prestadorId) {
      visit.prestador = { id: createVisitDto.prestadorId } as any;
    }

    // Set relation to fiscalYear if provided
    if (createVisitDto.fiscalYearId) {
      visit.fiscalYear = { id: createVisitDto.fiscalYearId } as any;
    }

    console.log('visit', JSON.stringify(visit, null, 2));

    try {
      // Use the queryRunner's manager if provided, otherwise use the repository
      if (queryRunner) {
        return await queryRunner.manager.save(Visit, visit);
      } else {
        return await this.visitRepository.save(visit);
      }
    } catch (error) {
      console.error('Error saving visit:', error);
      throw error;
    }
  }

  async update(id: string, updateVisitDto: UpdateVisitDto): Promise<Visit> {
    // Get current visit with all relations
    const visit = await this.findById(id);
    if (!visit) {
      throw new NotFoundException(`Visit with ID ${id} not found`);
    }

    // Start a transaction
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // Update all visit fields at once
      let visitUpdated = false;
      
      if (updateVisitDto.sade !== undefined) {
        visit.sade = updateVisitDto.sade;
        visitUpdated = true;
      }

      if (updateVisitDto.visit_date !== undefined) { 
        visit.date = moment(updateVisitDto.visit_date).toDate();
        visitUpdated = true;
      }

      // Save visit if any fields were updated
      if (visitUpdated) {
        await queryRunner.manager.save(visit);
      }

      // Update prestador_fiscalyear_information data
      if (
        visit.prestador && 
        visit.fiscalYear && 
        (updateVisitDto.nombre_representante_legal !== undefined || 
         updateVisitDto.correo_representante !== undefined)
      ) {
        // Get the fiscal year information record
        const fiscalYearInfo = await queryRunner.manager.findOne(PrestadorFiscalyearInformation, {
          where: {
            prestador: { id: visit.prestador.id },
            fiscalYear: { id: visit.fiscalYear.id }
          }
        });

        if (fiscalYearInfo) {
          let fiscalYearInfoUpdated = false;
          
          // Update representante_legal if provided
          if (updateVisitDto.nombre_representante_legal !== undefined) {
            fiscalYearInfo.representante_legal = updateVisitDto.nombre_representante_legal;
            fiscalYearInfoUpdated = true;
          }

          if (updateVisitDto.correo_representante !== undefined) {
            fiscalYearInfo.correoRepresentante = updateVisitDto.correo_representante;
            fiscalYearInfoUpdated = true;
          }

          if (updateVisitDto.identification !== undefined) {
            fiscalYearInfo.nits_nit = updateVisitDto.identification;
            fiscalYearInfoUpdated = true;
          }

          // Save fiscal year info if any fields were updated
          if (fiscalYearInfoUpdated) {
            await queryRunner.manager.save(fiscalYearInfo);
          }
        }
      }

      // Commit the transaction
      await queryRunner.commitTransaction();

      // Return the updated visit
      return await this.findById(id);
    } catch (error) {
      // If there's an error, roll back the transaction
      await queryRunner.rollbackTransaction();
      this.logger.error(`Error updating visit with ID ${id}:`, error);
      throw error;
    } finally {
      // Release the query runner regardless of outcome
      await queryRunner.release();
    }
  }

  //Find a visit by sade
  async findBySade(sade: string): Promise<Visit | null> {
    return await this.visitRepository.findOne({ where: { sade } });
  }

  async updateNotificationSended(id: string): Promise<Visit> {
    const visit = await this.findById(id);
    if (!visit) {
      throw new NotFoundException(`Visit with ID ${id} not found`);
    }
    visit.notification_sended = true;
    visit.visitState = VisitStatesEnum.VISITA_ESPERA_INICIO;
    return await this.visitRepository.save(visit);
  }
  
} 