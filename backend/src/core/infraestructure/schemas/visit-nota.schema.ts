import { EntitySchema } from 'typeorm';
import { VisitNota } from '@models/visit-nota.model';
import { BaseSchema } from '@schemas/base.schema';
import { NotaTypesEnum } from '@enums/nota-types.enum';

export const VisitNotaSchema = new EntitySchema<VisitNota>({
    tableName: 'visit_notas',
    name: 'VisitNota',
    target: VisitNota,
    columns: {
        ...BaseSchema,
        visit_id: {
            type: 'uuid',
            nullable: false,
        },
        body: {
            type: 'text',
            nullable: false,
        },
        acta_number: {
            type: 'character varying',
            nullable: false,
        },
        type: {
            type: 'enum',
            enum: NotaTypesEnum,
            nullable: false,
        },
        justification: {
            type: 'text',
            nullable: false,
        },
        nota_sended: {
            type: 'boolean',
            default: false,
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