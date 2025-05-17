import type { Weekgroup } from './weekgroup.interface';
import { BaseModel } from "./base.interface";
import type { GeneralStateTypesEnum } from "@enums/general-state-types.enum";
import type { WeekStates } from "./week_states";

export class Week extends BaseModel {
	name!: string;
	description?: string;
	week_state: WeekStates;
	end_date?: Date;
	start_date?: Date;
	state!: GeneralStateTypesEnum;

	//foreign keys
	weekgroups?: Weekgroup[];

}
