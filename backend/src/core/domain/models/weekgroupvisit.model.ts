import { BaseModel } from "./base.model";
import type { generalStateTypes } from "@enums/general-state-type";
import type { Weekgroup } from "./weekgroup.model";
import type { Users } from "./user.model";
import type { Prestador } from "./prestador.model";
import { VisitTypesEnum } from "@enums/visit-types.enum";
import { WeekGroupsPrestadoresEnum } from "@enums/weekgroupsprestadores";

export class WeekgroupVisit extends BaseModel {
  description?: string;
  state!: generalStateTypes;
  visitDate!: Date;
  visitType!: VisitTypesEnum;
  weekgroup!: Weekgroup;
  lead?: Users;
  prestador?: Prestador;
  notes?: string;
  visitState?: WeekGroupsPrestadoresEnum;
} 