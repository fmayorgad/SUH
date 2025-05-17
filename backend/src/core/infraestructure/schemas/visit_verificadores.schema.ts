import { EntitySchema } from 'typeorm';
import { VisitVerificadores } from '@models/visit_verificadores.model';
import { BaseSchema } from '@schemas/base.schema';
import { generalStateTypes } from '@enums/general-state-type';

export const VisitVerificadoresSchema = new EntitySchema<VisitVerificadores>({
    tableName: 'visit_verificadores',
    name: 'VisitVerificadores',
    target: VisitVerificadores,
    columns: {
        ...BaseSchema,
        role: {
            type: 'enum',
            enum: ['VERIFICADOR', 'SUPERVISOR'],
            nullable: false,
        },
        state: {
            type: 'enum',
            enum: generalStateTypes,
            default: generalStateTypes.ACTIVO,
            nullable: false,
        },
    },
    relations: {
        user_id: {
            type: 'many-to-one',
            target: 'Users',
            joinColumn: { name: 'user_id' },
            nullable: false,
        },
        visit_id: {
            type: 'many-to-one',
            target: 'Visit',
            joinColumn: { name: 'visit_id' },
            nullable: false,
        },
    },
}); 