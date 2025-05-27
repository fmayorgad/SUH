import { EntitySchema } from 'typeorm';
import { PrestadorFiscalyearCapacidades } from '@models/prestador-fiscalyear-capacidades.model';

export const PrestadorFiscalyearCapacidadesSchema = new EntitySchema<PrestadorFiscalyearCapacidades>({
    tableName: 'prestador_fiscalyear_capacidades',
    name: 'PrestadorFiscalyearCapacidades',
    target: PrestadorFiscalyearCapacidades,
    columns: {
        id: {
            type: 'uuid',
            generated: 'uuid',
            primary: true,
            unique: true,
        },
        state: {
            type: 'enum',
            enum: ['ACTIVO', 'INACTIVO', 'ELIMINADO'],
            nullable: false,
        },
        // Camas fields
        camas: {
            type: 'character varying',
            nullable: true,
        },
        camas_concepto: {
            type: 'character varying',
            nullable: true,
        },
        camas_cantidad: {
            type: 'character varying',
            nullable: true,
        },
        // Camillas fields
        camillas_concepto: {
            type: 'character varying',
            nullable: true,
        },
        camillas_cantidad: {
            type: 'character varying',
            nullable: true,
        },
        // Salas fields
        salas_concepto: {
            type: 'character varying',
            nullable: true,
        },
        // Sillas fields
        sillas_concepto: {
            type: 'character varying',
            nullable: true,
        },
        // Consultorios fields
        consultorios_concepto: {
            type: 'character varying',
            nullable: true,
        },
        consultorios_cantidad: {
            type: 'character varying',
            nullable: true,
        },
        // Unidad móvil fields
        unidad_movil_concepto: {
            type: 'character varying',
            nullable: true,
        },
        unidad_movil_cantidad: {
            type: 'character varying',
            nullable: true,
        },
        unidad_movil_placa: {
            type: 'character varying',
            nullable: true,
        },
        // Ambulancias fields
        ambulancias_concepto: {
            type: 'character varying',
            nullable: true,
        },
        ambulancias_cantidad: {
            type: 'character varying',
            nullable: true,
        },
        ambulancias_placa: {
            type: 'character varying',
            nullable: true,
        },
    },
    relations: {
        prestador: {
            type: 'many-to-one',
            target: 'Prestador',
            joinColumn: { name: 'prestador_id' },
            nullable: false,
        },
        fiscalYear: {
            type: 'many-to-one',
            target: 'FiscalYear',
            joinColumn: { name: 'fiscal_year_id' },
            nullable: false,
        },
    },
}); 