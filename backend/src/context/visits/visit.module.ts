import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VisitSchema } from '@schemas/visit.schema';
import { WeekgroupVisitSchema } from '@schemas/weekgroupvisit.schema'; // Import if needed for relations
import { VisitVerificadoresSchema } from '@schemas/visit_verificadores.schema';
import { VisitServiciosSchema } from '@schemas/visit_servicios.schema';
import { VisitRecorridosSchema } from '@schemas/visit_recorridos.schema';

//schemas
import { MunicipioSchema } from '@schemas/municipio.schema';
import { PrestadorSchema } from '@schemas/prestador.schema';
import { FiscalYearSchema } from '@schemas/fiscalyear.schema';
import { PrestadorFiscalyearInformationSchema } from '@schemas/prestador-fiscalyear-information.schema';
import { PrestadorFiscalyearServiciosSchema } from '@schemas/prestador-fiscalyear-servicios.schema';
import { PrestadorFiscalyearCapacidadesSchema } from '@schemas/prestador-fiscalyear-capacidades.schema';
import { ServicioSchema } from '@schemas/servicio.schema';
import { UserSchema } from '@schemas/user.schema';

// Application Services
import { GetVisits } from './application/get/get.visit';
import { CreateVisit } from './application/create/create.visit';
import { FindByIdVisit } from './application/findbyid/findbyid.visit';
import { GenerateVisitPdf } from './application/generate-pdf/generate.visit.pdf';
import { UpdateVisit } from './application/update/update.visit';
import { SendVisitToPrestador } from './application/send-to-prestador/send.visit.to.prestador';

// Controllers
import { GetVisitController } from './infraestructure/controllers/get.visit.controller';
import { PostVisitController } from './infraestructure/controllers/post.visit.controller';
import { VisitServiciosController } from './infraestructure/controllers/visit-servicios.controller';
import { FindByIdVisitController } from './infraestructure/controllers/findbyid.visit.controller';
import { VisitPdfController } from './infraestructure/controllers/visit-pdf.controller';
import { UpdateVisitController } from './infraestructure/controllers/update.visit.controller';
import { SendToPrestadorController } from './infraestructure/controllers/send-to-prestador.controller';

// Repositories
import { PgsqlVisitRepository } from './infraestructure/persistence/pgsql.visit.repository';
import { PgsqlVisitServiciosRepository } from './infraestructure/persistence/pgsql.visit_servicios.repository';

// Services
import { EmailService } from 'src/core/infraestructure/services/email.service';

const applicationServices = [
  GetVisits, 
  CreateVisit, 
  FindByIdVisit, 
  GenerateVisitPdf, 
  UpdateVisit,
  SendVisitToPrestador
];

const infrastructure = [
  {
    provide: 'PgsqlVisitRepository', // Token for injection, ensure consistent naming
    useClass: PgsqlVisitRepository,
  },
  {
    provide: 'PgsqlVisitServiciosRepository',
    useClass: PgsqlVisitServiciosRepository,
  },
  EmailService,
];

const controllers = [
  GetVisitController,
  PostVisitController,
  VisitServiciosController,
  FindByIdVisitController,
  VisitPdfController,
  UpdateVisitController,
  SendToPrestadorController,
];

@Module({
  imports: [
    TypeOrmModule.forFeature([
      VisitSchema,
      WeekgroupVisitSchema,
      VisitVerificadoresSchema,
      VisitServiciosSchema,
      VisitRecorridosSchema,
      MunicipioSchema,
      PrestadorSchema,
      FiscalYearSchema,
      PrestadorFiscalyearInformationSchema,
      PrestadorFiscalyearServiciosSchema,
      PrestadorFiscalyearCapacidadesSchema,
      ServicioSchema,
      UserSchema,
    ]),
  ],
  controllers: [...controllers],
  providers: [...applicationServices, ...infrastructure],
  exports: [...applicationServices],
})
export class VisitModule {} 