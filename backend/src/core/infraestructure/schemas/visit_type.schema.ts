import { VisitType } from "src/core/domain/models/visit_types.model";
import { EntitySchema } from "typeorm";
import { BaseSchema } from "@schemas/base.schema";

export const ConventionySchema = new EntitySchema<VisitType>({
	tableName: "visit_types",
	name: "VisitType",
	target: VisitType,
	columns: {
		...BaseSchema,
		name: {
			type: "character varying",
			length: 100,
		},
		code: {
			name: "code",
			type: "character varying",
			length: 50,
		},
		state: {
			type: "enum",
			enum: ["ACTIVO", "INACTIVO", "ELIMINADO"],
			default: "ACTIVO",
		}
	},
});
