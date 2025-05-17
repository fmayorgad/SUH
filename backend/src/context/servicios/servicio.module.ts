import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServicioSchema } from '@schemas/servicio.schema';
import { GrupoServicioSchema } from '@schemas/grupo-servicio.schema';
import { ComplexitySchema } from '@schemas/complexity.schema';

// Application Services
import { GetServicios } from './application/get/get.servicio';
import { FindServicioById } from './application/findbyid/findbyid.servicio';

// Controllers
import { GetServicioController } from './infraestructure/controllers/get.servicio.controller';
import { FindServicioByIdController } from './infraestructure/controllers/findbyid.servicio.controller';

// Repositories
import { PgsqlServicioRepository } from './infraestructure/persistence/pgsql.servicio.repository';

const applicationServices = [GetServicios, FindServicioById];

// Define infrastructure providers as an array
const ServicioRepositoryProvider =
{
  provide: 'servicioRepository', // Token for injection
  useClass: PgsqlServicioRepository,
};

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ServicioSchema, // Keep one instance
      GrupoServicioSchema,
      ComplexitySchema,
    ]),
  ],
  controllers: [GetServicioController, FindServicioByIdController],
  providers: [...applicationServices, ServicioRepositoryProvider],
  exports: [], // Export services if needed
})
export class ServicioModule { } 