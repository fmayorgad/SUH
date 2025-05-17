import { EntitySchema } from "typeorm";
import { BaseSchema } from "@schemas/base.schema";
import { Municipio } from "@models/municipio.model";

export const MunicipioSchema = new EntitySchema<Municipio>({
    tableName: "municipios",
    name: "Municipio",
    target: Municipio,
    columns: {
        ...BaseSchema,
        name: {
            type: "character varying",
            length: 100,
        },
        state: {
            type: "enum",
            enum: ["ACTIVO", "INACTIVO", "ELIMINADO"],
            default: "ACTIVO",
        },
        code: {
            type: "character varying",
            length: 100,
        },
        departamento_code: {
            type: "character varying",
            length: 100,
        },
    },
    relations: {
        departamento_id: {
            type: 'many-to-one',
            target: 'Departamento',
            joinColumn: {
                name: 'departamento_id',
                referencedColumnName: 'id',
            },
        },
        prestadores: {
            type: "one-to-many",
            target: "Prestador",
            inverseSide: "municipioSedeId"
        },
        prestadorFiscalyearInformation: {
            type: "one-to-many",
            target: "PrestadorFiscalyearInformation",
            inverseSide: "municipio"
        }
    },
});