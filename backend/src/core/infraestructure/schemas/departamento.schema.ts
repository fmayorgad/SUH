import { EntitySchema } from "typeorm";
import { BaseSchema } from "@schemas/base.schema";
import  { Departamento } from "@models/departamento.model";
import { Municipio } from "@models/municipio.model";

export const DepartamentoSchema = new EntitySchema<Departamento>({
    tableName: "departamentos",
    name: "Departamento",
    target: Departamento,
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
        region: {
            type: "character varying",
            length: 100,
        },
        real_code: {
            type: "character varying",
            length: 100,
        },
    },
    relations: {
        municipios: {
            type: 'one-to-many',
            target: 'Municipio',
            inverseSide: 'departamento_id',
        },
    },
});