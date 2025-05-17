import type { Weekgroup } from './weekgroup.model';
import { BaseModel } from "./base.model";
import type { generalStateTypes } from "@enums/general-state-type";
import type { WeekStates } from "./week_states";
import type {FiscalYear} from "./fiscalyears.model"

export class Week extends BaseModel {
	name!: string;
	description?: string;
	endDate?: string;
	startDate?: string;
	state!: generalStateTypes;
	week_state?: WeekStates;
	id_fiscal_year!: FiscalYear; 
	
	//foreign keys
	weekGroups?: Weekgroup[];
	fiscalyears?: FiscalYear; 
}
