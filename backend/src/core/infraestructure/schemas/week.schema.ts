import { Week } from "src/core/domain/models/week.model";
import { EntitySchema } from "typeorm";
import { BaseSchema } from "@schemas/base.schema";
import { WeekStates } from "src/core/domain/models/week_states";
import { WeekStatesEnum} from '@enums/weekstates'
import { generalStateTypes } from "@enums/general-state-type";

export const WeekSchema = new EntitySchema<Week>({
	tableName: "weeks",
	name: "Week",
	target: Week,
	columns: {
		...BaseSchema,
		name: {
			type: "character varying",
			length: 100,
		},
		description: {
			type: "character varying",
			length: 200,
		},
		startDate: {
			type: "date",
		},
		endDate: {
			type: "date",
		},
		state: {
			type: "enum",
			enum: generalStateTypes ,
			default: "ACTIVO",
		},

		week_state: {
			type: "enum",
			enum: WeekStates,
			default: "ACTIVA",
		},



	},
	relations: {
		 weekGroups: {
		 	target: "Weekgroup",
		 	type: "one-to-many",
		 	inverseSide: "weeks",
		 },
		 fiscalyears: {
		 	target: "FiscalYear",
		 	type: "many-to-one",
		 	inverseSide: "weeks",
			nullable: false,
		 	joinColumn: {
		 		name: "id_fiscal_year",
		 		referencedColumnName: "id",				
		 	},
		 },
	},
});
