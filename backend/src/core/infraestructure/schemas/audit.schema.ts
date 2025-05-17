import { Audit } from "@models/audit.model";
import { EntitySchema } from "typeorm";

export const AuditSchema = new EntitySchema<Audit>({
    tableName: 'audit',
    name: 'Audit',
    target: Audit,
    columns: {
        id: {
            type: 'uuid',
            generated: 'uuid',
            primary: true,
            unique: true,
        },
        date: {
            type: 'timestamp',
        },
        executes: {
            type: String,
            length: 1000
        },
        payload: {
            type: String,
            length: 1000
        },
        action: {
            type: String,
            length: 1000
        },
    },
    relations: {
        executedBy: {
            type: 'many-to-one',
            target: 'Users',
            joinColumn: {
                name: 'executedBy',
                referencedColumnName: 'id',
            },
        },
    }
})