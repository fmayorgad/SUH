import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HttpModule } from '@nestjs/axios';
import { PgsqlPrestadoresRepository } from './persistence/pqsql-prestadores.repository';
import { PrestadorSchema } from '@schemas/prestador.schema';
import { PrestadorTypeSchema } from '@schemas/prestador-type.schema';
import { PrestadoresGetController } from './controllers/prestadores.get';
import { MunicipioSchema } from '@schemas/municipio.schema';
import {DepartamentoSchema} from '@schemas/departamento.schema';
import { FindByNameIdentification } from '@context/prestadores/application/findyByNameIdentification';
import {FiscalYearSchema} from '@schemas/fiscalyear.schema';
import { ServicioSchema } from '@schemas/servicio.schema';

const PrestadorRepositoryProvider = {
  provide: 'prestadorRepository',
  useClass: PgsqlPrestadoresRepository,
};

@Module({
  imports: [
    TypeOrmModule.forFeature([
      DepartamentoSchema,
      MunicipioSchema,
      PrestadorTypeSchema,
      PrestadorSchema,
      FiscalYearSchema,
      ServicioSchema
    ]),
    HttpModule,
  ],
  controllers: [PrestadoresGetController],
  providers: [PrestadorRepositoryProvider, FindByNameIdentification],
  exports: [],
})
export class PrestadoresModule {}
