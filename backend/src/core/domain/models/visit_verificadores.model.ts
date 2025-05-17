import { BaseModel } from "@models/base.model";
import { Users } from "@models/user.model";
import { Visit } from "@models/visit.model";
import { generalStateTypes } from "@enums/general-state-type";


export class VisitVerificadores extends BaseModel {
 user_id: Users;
 role: ['VERIFICADOR', 'SUPERVISOR'];
 visit_id: Visit;
 state: generalStateTypes;
} 