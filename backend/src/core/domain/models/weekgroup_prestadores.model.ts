import { BaseModel } from "./base.model";
import type { generalStateTypes } from "@enums/general-state-type";
import type { Prestador } from "./prestador.model";
import type { Weekgroup } from "./weekgroup.model";
import type { WeekgroupVisit } from "./weekgroupvisit.model";
import { WeekGroupsPrestadoresEnum } from "@enums/weekgroupsprestadores";

export class WeekgroupPrestadores extends BaseModel {
    state!: generalStateTypes;
    id_weekgroup!: Weekgroup;
    id_prestador!: Prestador;
    weekgroupState!: WeekGroupsPrestadoresEnum;

    //foreign keys
    weekgroups?: Weekgroup;
    prestadores?: Prestador;
    visits?: WeekgroupVisit[];
}


