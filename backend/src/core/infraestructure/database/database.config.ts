import type { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { DatabaseLogger } from './database.logger';
import { WeekgroupVisitSchema } from '@schemas/weekgroupvisit.schema';
import { PrestadorFiscalyearInformationSchema } from '@schemas/prestador-fiscalyear-information.schema';
import { PrestadorFiscalyearServiciosSchema } from '@schemas/prestador-fiscalyear-servicios.schema';
import { PrestadorFiscalyearCapacidadesSchema } from '@schemas/prestador-fiscalyear-capacidades.schema';
import { ServicioSchema } from '@schemas/servicio.schema';
import { VisitSchema } from '@schemas/visit.schema';
import { VisitNotaSchema } from '@schemas/visit-nota.schema';
require('dotenv').config();

export const USM_DATABASE_CONFIG: TypeOrmModuleOptions = {
  type: 'postgres',
  host: process.env.DB_HOST,
  port: Number.parseInt(process.env.DB_PORT, 10),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  autoLoadEntities: true,
  entities: [WeekgroupVisitSchema, PrestadorFiscalyearInformationSchema, PrestadorFiscalyearServiciosSchema, PrestadorFiscalyearCapacidadesSchema, ServicioSchema, VisitSchema, VisitNotaSchema],
  logger: Number.parseInt(process.env.DB_LOGGING, 10) ? new DatabaseLogger() : null,
  synchronize: !!Number.parseInt(process.env.DB_SYNC, 10),
};
