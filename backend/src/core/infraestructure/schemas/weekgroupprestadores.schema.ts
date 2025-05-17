import { EntitySchema } from "typeorm";
import { BaseSchema } from "@schemas/base.schema";
import { WeekgroupPrestadores } from "@models/weekgroup_prestadores.model";
import { WeekGroupsPrestadoresEnum } from "@enums/weekgroupsprestadores";

export const WeekgroupPrestadoresSchema = new EntitySchema<WeekgroupPrestadores>({
    tableName: "weekgroup_prestadores",
    name: "WeekgroupPrestadores",
    target: WeekgroupPrestadores,
    columns: {
        ...BaseSchema,
        id_weekgroup: {
            type: "uuid",
            nullable: false,
        },
        id_prestador: {
            type: "uuid",
            nullable: false,
        },
        state: {
            type: "enum",
            enum: ["ACTIVO", "INACTIVO", "ELIMINADO"],
            default: "ACTIVO",
        },
        weekgroupState: {
            name: "weekgroup_state",
            type: "enum",
            enum: WeekGroupsPrestadoresEnum,
            default: WeekGroupsPrestadoresEnum.PENDIENTE,
        },
    },
    relations: {
        weekgroups: {
            target: "Weekgroup",
            type: "many-to-one",
            inverseSide: "weekgroupprestadores",
            joinColumn: {
                name: "id_weekgroup",
                referencedColumnName: "id",
            },
        },
        prestadores: {
            target: "Prestador",
            type: "many-to-one",
            inverseSide: "weekgroupprestadores",
            joinColumn: {
                name: "id_prestador",
                referencedColumnName: "id",
            },
        }
    },
});