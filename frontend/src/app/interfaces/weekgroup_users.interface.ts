import { BaseModel } from "./base.interface";
import type { GeneralStateTypesEnum } from "@enums/general-state-types.enum";
import type { Users } from "./user.interace";
import type { Weekgroup } from "./weekgroup.interface";


export class WeekgroupUsers extends BaseModel {
    state!: GeneralStateTypesEnum;
    id_weekgroup!: Weekgroup;
    id_user!: Users;

    //foreign keys
    weekgroups?: Weekgroup;
    users?: Users;
}


