import { EntitySchema } from 'typeorm';
import { VisitServicios } from '@models/visit_servicios.model';
import { BaseSchema } from '@schemas/base.schema';
import { generalStateTypes } from '@enums/general-state-type';

export const VisitServiciosSchema = new EntitySchema<VisitServicios>({
    tableName: 'visit_servicios',
    name: 'VisitServicios',
    target: VisitServicios,
    columns: {
        ...BaseSchema,
        state: {
            type: 'enum',
            enum: generalStateTypes,
            default: generalStateTypes.ACTIVO,
            nullable: false,
        },
    },
    relations: {
        visit_id: {
            type: 'many-to-one',
            target: 'Visit',
            joinColumn: { name: 'visit_id' },
            nullable: false,
        },
        servicio_id: {
            type: 'many-to-one',
            target: 'Servicio',
            joinColumn: { name: 'servicio_id' },
            nullable: false,
        },
    },
}); 