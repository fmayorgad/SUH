import { EntitySchema } from 'typeorm';
import { Visit } from '@models/visit.model';
import { BaseSchema } from '@schemas/base.schema';
import { VisitStatesEnum } from '@enums/visit-states.enum';
import { generalStateTypes } from '@enums/general-state-type';

export const VisitSchema = new EntitySchema<Visit>({
    tableName: 'visits',
    name: 'Visit',
    target: Visit,
    columns: {
        ...BaseSchema,
        start: {
            type: 'timestamp with time zone',
            nullable: true,
        },
        end: {
            type: 'timestamp with time zone',
            nullable: true,
        },
        date: {
            type: 'timestamp with time zone',
            nullable: true,
        },
        state: {
            type: 'enum',
            enum: generalStateTypes,
            default: generalStateTypes.ACTIVO,
            nullable: false,
        },
        visitState: {
            name: 'visit_state',
            type: 'enum',
            enum: VisitStatesEnum,
            default: VisitStatesEnum.COMUNICADO_PENDIENTE_GENERACION,
            nullable: false,
        },
        sade: {
            type: 'character varying',
            length: 20,
            nullable: true,
        },
        th_todos: {
            name: 'th_todos',
            type: 'character varying',
            nullable: true,
        },
        th_propios: {
            name: 'th_propios',
            type: 'character varying',
            nullable: true,
        },
        infra_todos: {
            name: 'infra_todos',
            type: 'character varying',
            nullable: true,
        },
        infra_propios: {
            name: 'infra_propios',
            type: 'character varying',
            nullable: true,
        },
        dotacion_todos: {
            name: 'dotacion_todos',
            type: 'character varying',
            nullable: true,
        },
        dotacion_propios: {
            name: 'dotacion_propios',
            type: 'character varying',
            nullable: true,
        },
        mdi_todos: {
            name: 'mdi_todos',
            type: 'character varying',
            nullable: true,
        },
        mdi_propios: {
            name: 'mdi_propios',
            type: 'character varying',
            nullable: true,
        },
        procedimientos_todos: {
            name: 'procedimientos_todos',
            type: 'character varying',
            nullable: true,
        },
        procedimientos_propios: {
            name: 'procedimientos_propios',
            type: 'character varying',
            nullable: true,
        },
        hcr_todos: {
            name: 'hcr_todos',
            type: 'character varying',
            nullable: true,
        },
        hcr_propios: {
            name: 'hcr_propios',
            type: 'character varying',
            nullable: true,
        },
        interdependencias_todos: {
            name: 'interdependencias_todos',
            type: 'character varying',
            nullable: true,
        },
        interdependencias_propios: {
            name: 'interdependencias_propios',
            type: 'character varying',
            nullable: true,
        }, 
        createdBy: {
            name: 'created_by',
            type: 'uuid',
            nullable: true,
        },
        th_verificadores: {
            name: 'th_verificadores',
            type: 'character varying',
            nullable: true,
        },
        infra_verificadores: {
            name: 'infra_verificadores',
            type: 'character varying',
            nullable: true,
        },
        dotacion_verificadores: {
            name: 'dotacion_verificadores',
            type: 'character varying',
            nullable: true,
        },
        mdi_verificadores: {
            name: 'mdi_verificadores',
            type: 'character varying',
            nullable: true,
        },
        procedimientos_verificadores: {
            name: 'procedimientos_verificadores',
            type: 'character varying',
            nullable: true,
        },
        hcr_verificadores: {
            name: 'hcr_verificadores',
            type: 'character varying',
            nullable: true,
        },
        interdependencias_verificadores: {
            name: 'interdependencias_verificadores',
            type: 'character varying',
            nullable: true,
        },
        notification_sended: {
            type: 'boolean',
            default: false,
        },
        informe_sended: {
            type: 'boolean',
            default: false,
        },
    },
    relations: {
        weekgroupVisit: {
            type: 'many-to-one',
            target: 'WeekgroupVisit',
            joinColumn: { name: 'weekgroup_visit_id' },
            nullable: true,
        },
        visitVerificadores: {
            type: 'one-to-many',
            target: 'VisitVerificadores',
            inverseSide: 'visit_id',
        },
        visitServicios: {
            type: 'one-to-many',
            target: 'VisitServicios',
            inverseSide: 'visit_id',
        },
        prestador: {
            type: 'many-to-one',
            target: 'Prestador',
            joinColumn: { name: 'prestador_id' },
            nullable: true,
        },
        fiscalYear: {
            type: 'many-to-one',
            target: 'FiscalYear',
            joinColumn: { name: 'fiscal_year_id' },
            nullable: true,
        },
        creator: {
            type: 'many-to-one',
            target: 'Users',
            joinColumn: { name: 'created_by' },
            nullable: true,
        },
        // For array properties, we'll use a special query or separate repository methods
        // to filter verificadores based on categories instead of direct relations
    },
}); 