import type { generalStateTypes } from "@enums/general-state-type";
import type { Departamento } from "@models/departamento.model";
import { BaseModel } from './base.model';
import type { Prestador } from './prestador.model';
import type { PrestadorFiscalyearInformation } from './prestador-fiscalyear-information.model';

export class Municipio extends BaseModel {
    id!: string;
	name!: string;
    state!: generalStateTypes;
    code!: string;
    departamento_code!: string;
    departamento_id!: Departamento;
    
    // Relations
    prestadores?: Prestador[];
    prestadorFiscalyearInformation?: PrestadorFiscalyearInformation[];
}
