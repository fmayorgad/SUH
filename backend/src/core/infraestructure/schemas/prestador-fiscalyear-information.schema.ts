import { EntitySchema } from 'typeorm';
import { PrestadorFiscalyearInformation } from '@models/prestador-fiscalyear-information.model';
import { BaseSchema } from '@schemas/base.schema';

export const PrestadorFiscalyearInformationSchema = new EntitySchema<PrestadorFiscalyearInformation>({
    tableName: 'prestador_fiscalyear_information',
    name: 'PrestadorFiscalyearInformation',
    target: PrestadorFiscalyearInformation,
    columns: {
        ...BaseSchema,
        // prestador_id is handled by the relation
        // fiscal_year_id is handled by the relation 
        correoPrestador: {
            name: 'correoPrestador',
            type: 'character varying',
            nullable: true,
        },
        telefonoPrestador: {
            name: 'telefonoPrestador',
            type: 'character varying',
            nullable: true,
        },
        codigoSede: {
            name: 'codigoSede',
            type: 'character varying',
            nullable: true,
        },
        nombreSede: {
            name: 'nombreSede',
            type: 'character varying',
            nullable: true,
        },
        correoSede: {
            name: 'correoSede',
            type: 'character varying',
            nullable: true,
        },
        telefonoSede: {
            name: 'telefonoSede',
            type: 'character varying',
            nullable: true,
        },
        direccionSede: {
            name: 'direccionSede',
            type: 'character varying',
            nullable: true,
        },
        nombre_prestador: {
            name: 'nombre_prestador',
            type: 'character varying',
            nullable: true,
        },
        // New columns
        habi_codigo_habilitacion: {
            type: 'character varying',
            nullable: true,
        },
        codigo_habilitacion: {
            type: 'character varying',
            nullable: true,
        },
        numero_sede: {
            type: 'character varying',
            nullable: true,
        },
        nits_nit: {
            type: 'character varying',
            nullable: true,
        },
        dv: {
            type: 'character varying',
            nullable: true,
        },
        representante_legal: {
            type: 'character varying',
            nullable: true,
        },
        correoRepresentante: {
            name: 'correoRepresentante',
            type: 'character varying',
            nullable: true,
        },
        // id, created_at, updated_at, deleted_at are assumed to be in BaseSchema
    },
    indices: [
        // Optional: Define a unique constraint if needed, mirroring the composite PK
        {
            name: 'IDX_prestador_fiscalyear_unique',
            columns: ['prestador', 'fiscalYear'], // Use relation names for index columns
            unique: true,
        },
    ],
    relations: {
        prestador: {
            type: 'many-to-one',
            target: 'Prestador', // Target entity name
            joinColumn: { name: 'prestador_id' }, // Foreign key column name
            nullable: false,
        },
        fiscalYear: {
            type: 'many-to-one',
            target: 'FiscalYear', // Target entity name
            joinColumn: { name: 'fiscal_year_id' }, // Foreign key column name
            nullable: false,
        },
        municipio: { // New relation
            type: 'many-to-one',
            target: 'Municipio', // Target entity name
            joinColumn: { name: 'municipio_id' }, // Foreign key column name in this table
            nullable: true, // Match column definition
        },
    },
}); 