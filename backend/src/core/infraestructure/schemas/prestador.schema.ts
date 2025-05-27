import { EntitySchema } from "typeorm";
import { BaseSchema } from "@schemas/base.schema";
import { Prestador } from "@models/prestador.model";

export const PrestadorSchema = new EntitySchema<Prestador>({
    tableName: "prestadores",
    name: "Prestador",
    target: Prestador,
    columns: {
        ...BaseSchema,
        identificador: {
            type: "character varying",
            length: 100,
            nullable: true,
        },
        codigoPrestador: {
            name: 'codigoPrestador',
            type: "character varying",
            length: 100,
            nullable: true,
        },
        nombreSede: {
            type: "character varying",
            nullable: false,
        },
        nombrePrestador: {
            type: "character varying",
            nullable: true,
        },
        state: {
            type: "enum",
            enum: ["ACTIVO", "INACTIVO", "ELIMINADO"],
            default: "ACTIVO",
            nullable: false,
        },
        municipioInicial: {
            type: "character varying",
            length: 100,
            nullable: true,
        },
    },
    relations: {
        prestadorType: {
            type: 'many-to-one',
            target: 'PrestadorType',
            joinColumn: { name: 'prestadorType' },
            nullable: true,
        },
        weekgroupvisits: {
            type: 'one-to-many',
            target: 'WeekgroupVisit',
            inverseSide: 'prestador',
        },
        fiscalYearInformation: {
            type: 'one-to-many',
            target: 'PrestadorFiscalyearInformation',
            inverseSide: 'prestador',
        },
        fiscalYearServicios: {
            type: 'one-to-many',
            target: 'PrestadorFiscalyearServicios',
            inverseSide: 'prestador',
        },
        fiscalYearCapacidades: {
            type: 'one-to-many',
            target: 'PrestadorFiscalyearCapacidades',
            inverseSide: 'prestador',
        },
    },
});