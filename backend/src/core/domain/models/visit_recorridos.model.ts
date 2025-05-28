import { BaseModel } from "@models/base.model";
import { Visit } from "@models/visit.model";
import { Servicio } from "@models/servicio.model";
import { Users } from "@models/user.model";

export class VisitRecorridos extends BaseModel {
  visit_id!: string;
  servicios!: string[];
  verificadores?: string[];
  name?: string;

  // Relations
  visit!: Visit;
  serviciosEntities?: Servicio[];
  verificadoresEntities?: Users[];
} 