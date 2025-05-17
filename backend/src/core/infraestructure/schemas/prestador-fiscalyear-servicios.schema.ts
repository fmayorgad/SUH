import { EntitySchema } from 'typeorm';
import { PrestadorFiscalyearServicios } from '@models/prestador-fiscalyear-servicios.model';
import { BaseSchema } from '@schemas/base.schema';
import { generalStateTypes } from '@enums/general-state-type';
import { complexitiesTypes } from '@enums/complexities.enum';

export const PrestadorFiscalyearServiciosSchema = new EntitySchema<PrestadorFiscalyearServicios>({
  tableName: 'prestador_fiscalyear_servicios',
  name: 'PrestadorFiscalyearServicios',
  target: PrestadorFiscalyearServicios,
  columns: {
    ...BaseSchema,
    // Date fields
    fecha_apertura: {
      type: 'character varying',
      nullable: true,
    },
    fecha_cierre: {
      type: 'character varying',
      nullable: true,
    },

    // Text fields
    numero_sede_principal: {
      type: 'character varying',
      nullable: true,
    },
    fecha_corte_REPS: {
      type: 'character varying',
      nullable: true,
    },

    // Schedule fields
    horario_lunes: {
      type: 'character varying',
      nullable: true,
    },
    horario_martes: {
      type: 'character varying',
      nullable: true,
    },
    horario_miercoles: {
      type: 'character varying',
      nullable: true,
    },
    horario_jueves: {
      type: 'character varying',
      nullable: true,
    },
    horario_viernes: {
      type: 'character varying',
      nullable: true,
    },
    horario_sabado: {
      type: 'character varying',
      nullable: true,
    },
    horario_domingo: {
      type: 'character varying',
      nullable: true,
    },

    // Modality fields (boolean)
    modalidad_intramural: {
      type: 'boolean',
      nullable: true,
    },
    modalidad_extramural: {
      type: 'boolean',
      nullable: true,
    },
    modalidad_unidad_movil: {
      type: 'boolean',
      nullable: true,
    },
    modalidad_domiciliario: {
      type: 'boolean',
      nullable: true,
    },
    modalidad_jornada_salud: {
      type: 'boolean',
      nullable: true,
    },
    modalidad_telemedicina: {
      type: 'boolean',
      nullable: true,
    },

    // Reference provider modalities
    modalidad_prestador_referencia: {
      type: 'boolean',
      nullable: true,
    },
    modalidad_prestador_referencia_telemedicina_interactiva: {
      type: 'boolean',
      nullable: true,
    },
    modalidad_prestador_referencia_telemedicina_no_interactiva: {
      type: 'boolean',
      nullable: true,
    },
    modalidad_prestador_referencia_tele_experticia: {
      type: 'boolean',
      nullable: true,
    },
    modalidad_prestador_referencia_tele_monitoreo: {
      type: 'boolean',
      nullable: true,
    },

    // Referring provider modalities
    modalidad_prestador_remisor: {
      type: 'boolean',
      nullable: true,
    },
    modalidad_prestador_remisor_tele_experticia: {
      type: 'boolean',
      nullable: true,
    },
    modalidad_prestador_remisor_tele_monitoreo: {
      type: 'boolean',
      nullable: true,
    },

    // Other fields
    complejidades: {
      type: 'enum',
      enum: complexitiesTypes,
      nullable: true,
    },
    state: {
      type: 'enum',
      enum: generalStateTypes,
      default: generalStateTypes.ACTIVO,
      nullable: true,
    },
  },
  relations: {
    prestador: {
      type: 'many-to-one',
      target: 'Prestador',
      joinColumn: {
        name: 'prestador_id',
        referencedColumnName: 'id',
      },
      primary: true,
      nullable: false,
      onDelete: 'CASCADE',
    },
    fiscalYear: {
      type: 'many-to-one',
      target: 'FiscalYear',
      joinColumn: {
        name: 'fiscal_year_id',
        referencedColumnName: 'id',
      },
      primary: true,
      nullable: false,
      onDelete: 'CASCADE',
    },
    servicio: {
      type: 'many-to-one',
      target: 'Servicio',
      joinColumn: {
        name: 'servicio_id',
        referencedColumnName: 'id',
      },
      primary: true,
      nullable: false,
      onDelete: 'CASCADE',
    },
  },
}); 