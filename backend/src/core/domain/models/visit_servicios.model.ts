import { BaseModel } from "@models/base.model";
import { Servicio } from "@models/servicio.model";
import { Visit } from "@models/visit.model";
import { generalStateTypes } from "@enums/general-state-type";

export class VisitServicios extends BaseModel {
  visit_id: Visit;
  servicio_id: Servicio;
  state: generalStateTypes; 
} 