import { EntitySchema } from 'typeorm';
import { WeekgroupVisit } from '@models/weekgroupvisit.model';
import { BaseSchema } from '@schemas/base.schema';
import { VisitTypesEnum } from '@enums/visit-types.enum';
import { UserSchema } from '@schemas/user.schema';
import { PrestadorSchema } from '@schemas/prestador.schema';
import { WeekGroupsPrestadoresEnum } from '@enums/weekgroupsprestadores';

export const WeekgroupVisitSchema = new EntitySchema<WeekgroupVisit>({
    tableName: 'weekgroup_visits',
    name: 'WeekgroupVisit',
    target: WeekgroupVisit,
    columns: {
        ...BaseSchema,
        description: {
            type: 'text',
            nullable: true,
        },
        state: {
            type: 'enum',
            enum: ['ACTIVO', 'INACTIVO', 'ELIMINADO'],
            default: 'ACTIVO',
            nullable: false,
        },
        visitDate: {
            name: 'visit_date',
            type: 'timestamp with time zone',
            nullable: false,
        },
        visitType: {
            name: 'visit_type',
            type: 'enum',
            enum: VisitTypesEnum,
            nullable: false,
            default: VisitTypesEnum.PROGRAMACION,
        },
        visitState: {
            name: 'visit_state',
            type: 'enum',
            enum: WeekGroupsPrestadoresEnum,
            nullable: true,
            default: WeekGroupsPrestadoresEnum.PENDIENTE,
        },
        notes: {
            type: 'text',
            nullable: true,
        },
    },
    relations: {
        weekgroup: {
            type: 'many-to-one',
            target: 'Weekgroup',
            joinColumn: { name: 'weekgroup_id' },
            nullable: false,
        },
        lead: {
            type: 'many-to-one',
            target: 'Users',
            joinColumn: { name: 'lead_id' },
            nullable: true,
            inverseSide: 'ledWeekgroupVisits'
        },
        prestador: {
            type: 'many-to-one',
            target: 'Prestador',
            joinColumn: { name: 'prestador_id' },
            nullable: true,
            inverseSide: 'weekgroupvisits'
        }
    },
}); 