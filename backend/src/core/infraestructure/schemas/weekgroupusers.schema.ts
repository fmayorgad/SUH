import { EntitySchema } from "typeorm";
import { BaseSchema } from "@schemas/base.schema";
import { WeekgroupUsers } from "@models/weekgroup_users.model";

export const WeekgroupUsersSchema = new EntitySchema<WeekgroupUsers>({
    tableName: "weekgroup_users",
    name: "WeekgroupUsers",
    target: WeekgroupUsers,
    columns: {
        ...BaseSchema,
        id_weekgroup: {
            type: "uuid",
            nullable: false,
        },
        id_user: {
            type: "uuid",
            nullable: false,
        },
        state: {
            type: "enum",
            enum: ["ACTIVO", "INACTIVO", "ELIMINADO"],
            default: "ACTIVO",
        },
    },
    relations: {
        weekgroups: {
            target: "Weekgroup",
            type: "many-to-one",
            inverseSide: "weekgroupusers",
            joinColumn: {
                name: "id_weekgroup",
                referencedColumnName: "id",
            },
        },
        members: {
            target: "Users",
            type: "many-to-one",
            inverseSide: "weekgroupusers",
            joinColumn: {
                name: "id_user",
                referencedColumnName: "id",
            },
        },
    },
});