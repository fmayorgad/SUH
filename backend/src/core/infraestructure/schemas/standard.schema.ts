import { Standard } from "src/core/domain/models/standards.model";
import { EntitySchema } from "typeorm";
import { BaseSchema } from "@schemas/base.schema";

export const StandardSchema = new EntitySchema<Standard>({
	tableName: "standards",
	name: "Standard",
	target: Standard,
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
