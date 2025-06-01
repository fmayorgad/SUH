import { BaseModel } from "@models/base.model";
import { generalStateTypes } from "@enums/general-state-type";
import { VisitStatesEnum } from "@enums/visit-states.enum";
import { WeekgroupVisit } from "@models/weekgroupvisit.model";
import { VisitVerificadores } from "@models/visit_verificadores.model";
import { Prestador } from "@models/prestador.model";
import { FiscalYear } from "@models/fiscalyears.model";
import { Users } from "@models/user.model";
import { VisitServicios } from "@models/visit_servicios.model";
import { VisitRecorridos } from "@models/visit_recorridos.model";
import { VisitNota } from "@models/visit-nota.model";

export class Visit extends BaseModel {
  start?: Date;
  end?: Date;
  date?: Date;
  weekgroupVisit?: WeekgroupVisit;

  state!: generalStateTypes;
  visitState!: VisitStatesEnum;
  sade?: string;
  th_verificadores?: VisitVerificadores[];
  th_todos: string;
  th_propios: string;
  infra_verificadores: VisitVerificadores[];
  infra_todos: string;
  infra_propios: string;
  dotacion_verificadores: VisitVerificadores[];
  dotacion_todos: string;
  dotacion_propios: string;
  mdi_verificadores: VisitVerificadores[];
  mdi_todos: string;
  mdi_propios: string;
  procedimientos_verificadores: VisitVerificadores[];
  procedimientos_todos: string;
  procedimientos_propios: string;
  hcr_verificadores: VisitVerificadores[];
  hcr_todos: string;
  hcr_propios: string;
  interdependencias_verificadores: VisitVerificadores[];
  interdependencias_todos: string;
  interdependencias_propios: string;
  prestador_id?: string;
  fiscal_year_id?: string;
  serviciosData?: string;
  capacidadData?: string;
  createdBy?: string;
  notification_sended?: boolean;
  informe_sended?: boolean;

  //Relations
  visitVerificadores?: VisitVerificadores[];
  visitServicios?: VisitServicios[];
  visitRecorridos?: VisitRecorridos[];
  visitNotas?: VisitNota[];
  prestador?: Prestador;
  fiscalYear?: FiscalYear;
  creator?: Users;
} 