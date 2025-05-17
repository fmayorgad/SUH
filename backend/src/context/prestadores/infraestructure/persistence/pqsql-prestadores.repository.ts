import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Brackets, DataSource, Repository } from 'typeorm';
import { PrestadorRepository } from './../../domain/prestadores.repository';
import { Prestador } from '@models/prestador.model';
import { FiscalYear } from '@models/fiscalyears.model';
import { PrestadorFiscalyearInformation } from '@models/prestador-fiscalyear-information.model';
import { generalStateTypes } from '@enums/general-state-type';

@Injectable()
export class PgsqlPrestadoresRepository implements PrestadorRepository {
  private readonly logger = new Logger(PgsqlPrestadoresRepository.name);

  constructor(
    @InjectRepository(Prestador)
    private readonly repository: Repository<Prestador>,
    private readonly dataSource: DataSource,
  ) {}

  private async getActiveFiscalYearId(): Promise<string> {
    const activeFiscalYear = await this.dataSource
        .getRepository(FiscalYear)
        .findOne({ where: { state: generalStateTypes.ACTIVO } });
    if (!activeFiscalYear) {
        this.logger.error('No active fiscal year found');
        throw new NotFoundException('Active fiscal year not configured.');
    }
    return activeFiscalYear.id;
  }

  async findByNameIdentification(text: string): Promise<Prestador[] | null> {
    const activeFiscalYearId = await this.getActiveFiscalYearId();

    console.log(activeFiscalYearId);

    const query = this.repository.createQueryBuilder('prestador')
      .select([
        'prestador.id', 
        'prestador.identificador', 
        'prestador.codigoPrestador',
        'prestador.state',
        'prestador.municipioInicial',
        'info.codigoSede',
        'prestador.nombreSede',
        'prestador.nombrePrestador',
        'info.direccionSede',
        'prestadorType.id',
        'prestadorType.name',
      ])
      .leftJoin('prestador.fiscalYearInformation', 'info', 'info.fiscal_year_id = :activeFiscalYearId', { activeFiscalYearId })
      .leftJoinAndSelect('prestador.prestadorType', 'prestadorType');

    if (text) {
      query.andWhere(new Brackets(qb => {
        qb.where('prestador.nombreSede ILIKE :text', { text: `%${text}%` })
          .orWhere('prestador.identificador ILIKE :text', { text: `%${text}%` })
          .orWhere('info.nombreSede ILIKE :text', { text: `%${text}%` });
      }));
    }

    const rawResults = await query.getRawMany();

    const prestadores = rawResults.map(raw => {
        const p = new Prestador();
        p.id = raw.prestador_id;
        p.identificador = raw.prestador_identificador;
        p.codigoPrestador = raw.prestador_codigoPrestador; 
        p.state = raw.prestador_state;
        p.codigoSede = raw.info_codigoSede;
        p.nombreSede = raw.prestador_nombreSede;
        p.direccionSede = raw.info_direccionSede;
        p.municipioInicial = raw.prestador_municipioInicial;
        p.prestadorType = {
          id: raw.prestadorType_id,
          name: raw.prestadorType_name,
          code: raw.prestadorType_code,
          state: raw.prestadorType_state
        }

        return p;
    });

    return prestadores;
  }

  async getAll(
  ): Promise<Prestador[] | null> {
    const activeFiscalYearId = await this.getActiveFiscalYearId();

    const query = this.repository.createQueryBuilder('prestador')
      .select([
        'prestador.id', 
        'prestador.identificador', 
        'prestador.codigoPrestador',
        'prestador.nombre',
        'prestador.state',
        'prestador.nombrePrestador',
        'info.codigoSede',
        'info.nombreSede',
        'info.direccionSede',
      ])
      .leftJoin('prestador.fiscalYearInformation', 'info', 'info.fiscal_year_id = :activeFiscalYearId', { activeFiscalYearId })
      .leftJoinAndSelect('prestador.prestadorType', 'prestadorType');

      const rawResults = await query.getRawMany();

      const prestadores = rawResults.map(raw => {
        const p = new Prestador();
        p.id = raw.prestador_id;
        p.identificador = raw.prestador_identificador;
        p.codigoPrestador = raw.prestador_codigoPrestador;
        p.nombreSede = raw.prestador_nombre;
        p.state = raw.prestador_state;
        p.codigoSede = raw.info_codigoSede;
        p.nombreSede = raw.info_nombreSede;
        p.direccionSede = raw.info_direccionSede;

        if (raw.prestadorType_id) {
            p.prestadorType = { id: raw.prestadorType_id } as any;
        }

        return p;
    });

    return prestadores;
  }
}
