import { BaseModel } from "@models/base.model";
import { NotaTypesEnum } from "@enums/nota-types.enum";
import { Visit } from "@models/visit.model";

export class VisitNota extends BaseModel {
  visit_id!: string;
  body!: string;
  acta_number!: string;
  type!: NotaTypesEnum;
  justification!: string;
  nota_sended?: boolean;

  // Relations
  visit?: Visit;
} 