import { EntitySchema } from 'typeorm';
import { BaseSchema } from '@schemas/base.schema';
import { VisitRecorridos } from '@models/visit_recorridos.model';

export const VisitRecorridosSchema = new EntitySchema<VisitRecorridos>({
    tableName: 'visit_recorridos',
    name: 'VisitRecorridos',
    target: VisitRecorridos,
    columns: {
        ...BaseSchema,
        visit_id: {
            type: 'uuid',
            nullable: false,
        },
        servicios: {
            type: 'uuid',
            array: true,
            nullable: false,
        },
        verificadores: {
            type: 'uuid',
            array: true,
            nullable: true,
        },
        name: {
            type: 'character varying',
            nullable: true,
        },
    },
    relations: {
        visit: {
            type: 'many-to-one',
            target: 'Visit',
            joinColumn: { name: 'visit_id' },
            nullable: false,
        },
    },
}); 