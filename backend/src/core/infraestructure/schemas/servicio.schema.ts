import { Servicio } from "@models/servicio.model";
import { EntitySchema } from "typeorm";
import { BaseSchema } from "@schemas/base.schema";

export const ServicioSchema = new EntitySchema<Servicio>({
	tableName: "servicios",
	name: "Servicio",
	target: Servicio,
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
		grupoServicio: {
            target: "GrupoServicio",
            type: "many-to-one",
            joinColumn: {
                name: "grupo_servicio_id",
            },
			nullable: false,
        },
		prestadorFiscalyearServicios: {
			type: 'one-to-many',
			target: 'PrestadorFiscalyearServicios',
			inverseSide: 'servicio',
		},
	},
});
