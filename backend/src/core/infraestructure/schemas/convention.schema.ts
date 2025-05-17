import { Conventions } from "src/core/domain/models/conventions.model";
import { EntitySchema } from "typeorm";
import { BaseSchema } from "@schemas/base.schema";

export const ConventionySchema = new EntitySchema<Conventions>({
	tableName: "complexities",
	name: "Complexity",
	target: Conventions,
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
		},
	},
});
