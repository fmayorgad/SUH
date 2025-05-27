import { FiscalYear } from '@models/fiscalyears.model';
import { EntitySchema } from 'typeorm';
import type { EntitySchemaColumnOptions } from 'typeorm';
import { BaseSchema } from "@schemas/base.schema";

export const FiscalYearSchema = new EntitySchema<FiscalYear>({
  tableName: 'fiscal_years',
  name: 'FiscalYear',
  target: FiscalYear,
  columns: {
    ...BaseSchema,
    name: {
      type: 'character varying',
      length: 100,
    },
    state: {
      type: 'enum',
      enum: ['ACTIVO', 'INACTIVO'],
      default: 'ACTIVO',
    },
    start: {
      type: 'timestamp with time zone',
    },
    end: {
      type: 'timestamp with time zone',
    },
    subsecretario_name: {
      type: 'character varying',
      length: 100,
      nullable: true,
    },
    realState: {
      name: 'real_state',
      type: 'enum',
      enum: ['ACTIVA', 'ATRASADA', 'CERRADA'],
      nullable: true,
    },
  },

  relations:{
    weeks: {
      target: 'Week',
      type: 'one-to-many',
      inverseSide: 'fiscalYear',
    },
    prestadorFiscalyearInformation: {
      type: 'one-to-many',
      target: 'PrestadorFiscalyearInformation',
      inverseSide: 'fiscalYear',
    },
    prestadorFiscalyearServicios: {
      type: 'one-to-many',
      target: 'PrestadorFiscalyearServicios',
      inverseSide: 'fiscalYear',
    },
    prestadorFiscalyearCapacidades: {
      type: 'one-to-many',
      target: 'PrestadorFiscalyearCapacidades',
      inverseSide: 'fiscalYear',
    }
  }
});
