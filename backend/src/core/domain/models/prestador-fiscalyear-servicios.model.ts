import { BaseModel } from '@models/base.model';
import { generalStateTypes } from '@enums/general-state-type';
import { Prestador } from '@models/prestador.model';
import { FiscalYear } from '@models/fiscalyears.model';
import { Servicio } from '@models/servicio.model';
import { complexitiesTypes } from '@enums/complexities.enum';
export class PrestadorFiscalyearServicios extends BaseModel {
  // Primary keys (already part of BaseModel)
  prestador_id?: string;
  fiscal_year_id?: string;
  servicio_id?: string;
  
  // Date fields
  fecha_apertura?: string;
  fecha_cierre?: string;
  
  // Text fields
  numero_sede_principal?: string;
  fecha_corte_REPS?: string;
  
  // Schedule fields
  horario_lunes?: string;
  horario_martes?: string;
  horario_miercoles?: string;
  horario_jueves?: string;
  horario_viernes?: string;
  horario_sabado?: string;
  horario_domingo?: string;
  
  // Modality fields (boolean)
  modalidad_intramural?: boolean;
  modalidad_extramural?: boolean;
  modalidad_unidad_movil?: boolean;
  modalidad_domiciliario?: boolean;
  modalidad_jornada_salud?: boolean;
  modalidad_telemedicina?: boolean;
  
  // Reference provider modalities
  modalidad_prestador_referencia?: boolean;
  modalidad_prestador_referencia_telemedicina_interactiva?: boolean;
  modalidad_prestador_referencia_telemedicina_no_interactiva?: boolean;
  modalidad_prestador_referencia_tele_experticia?: boolean;
  modalidad_prestador_referencia_tele_monitoreo?: boolean;
  
  // Referring provider modalities
  modalidad_prestador_remisor?: boolean;
  modalidad_prestador_remisor_tele_experticia?: boolean;
  modalidad_prestador_remisor_tele_monitoreo?: boolean;
  
  // Other fields
  complejidades?: complexitiesTypes;
  state?: generalStateTypes;
  
  // Relations
  prestador?: Prestador;
  fiscalYear?: FiscalYear;
  servicio?: Servicio;
} 