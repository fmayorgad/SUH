import { BaseModel } from "./base.model";
import type { generalStateTypes } from "@enums/general-state-type";
import type { Week } from "./week.model";
import type { Users } from "./user.model";
import type { WeekgroupUsers} from './weekgroup_users.model'
import type { WeekgroupPrestadores } from './weekgroup_prestadores.model';
import type { WeekgroupVisit } from './weekgroupvisit.model';

export class Weekgroup extends BaseModel {
	name!: string;
	description?: string;
	state!: generalStateTypes;
	id_week!: Week;
	lead!: Users;

	//foreign keys
	leadData?: Users;
	weeks?: Week;
	weekgroupusers?: WeekgroupUsers[];
	weekgroupprestadores?: WeekgroupPrestadores[];
	weekgroupvisits?: WeekgroupVisit[];
}
