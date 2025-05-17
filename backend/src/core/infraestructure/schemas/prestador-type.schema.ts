import { PrestadorType } from "src/core/domain/models/prestador-type.model";
import { EntitySchema } from "typeorm";
import { BaseSchema } from "@schemas/base.schema";

export const PrestadorTypeSchema = new EntitySchema<PrestadorType>({
	tableName: "prestador_types",
	name: "PrestadorType",
	target: PrestadorType,
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
	relations: {
		prestador: {
			type: "one-to-many",
			target: "Prestador",
			inverseSide: "prestadorType",
		},
	}
});
