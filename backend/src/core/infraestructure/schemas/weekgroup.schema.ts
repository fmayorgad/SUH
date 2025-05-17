import { Week } from 'src/core/domain/models/week.model';

import { Weekgroup } from "src/core/domain/models/weekgroup.model";
import { EntitySchema } from "typeorm";
import { BaseSchema } from "@schemas/base.schema";

export const WeekgroupsSchema = new EntitySchema<Weekgroup>({
    tableName: "weekgroups",
    name: "Weekgroup",
    target: Weekgroup,
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
        state: {
            type: "enum",
            enum: ["ACTIVO", "INACTIVO", "ELIMINADO"],
            default: "ACTIVO",
        },
        id_week: {
            type: "uuid",
            nullable: false,
        },
        lead: {
            type: "uuid",
            nullable: false,
        },
    },
    relations: {
        leadData: {
            target: "Users",
            type: "many-to-one",
            inverseSide: "weekgroups",
            joinColumn: {
                name: "lead",
                referencedColumnName: "id",
            },
        },
        weeks: {
            target: "Week",
            type: "many-to-one",
            inverseSide: "weekgroups",
            joinColumn: {
                name: "id_week",
                referencedColumnName: "id",
            },
        },
        weekgroupprestadores: {
            target: "WeekgroupPrestadores",
            type: "one-to-many",
            inverseSide: "weekgroups",
        },
        weekgroupusers: {
            target: "WeekgroupUsers",
            type: "one-to-many",
            inverseSide: "weekgroups",
        },
        weekgroupvisits: {
            target: "WeekgroupVisit",
            type: "one-to-many",
            inverseSide: "weekgroup",
        },
    },
});
