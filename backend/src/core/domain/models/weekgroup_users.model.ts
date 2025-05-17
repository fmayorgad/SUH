import { BaseModel } from "./base.model";
import type { generalStateTypes } from "@enums/general-state-type";
import type { Users } from "./user.model";
import type { Weekgroup } from "./weekgroup.model";


export class WeekgroupUsers extends BaseModel {
    state!: generalStateTypes;
    id_weekgroup!: Weekgroup;
    id_user!: Users;

    //foreign keys
    weekgroups?: Weekgroup;
    members?: Users;
}


