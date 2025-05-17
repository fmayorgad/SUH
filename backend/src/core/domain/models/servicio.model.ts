import { BaseModel } from "./base.model";
import type { generalStateTypes } from "@enums/general-state-type";
import { GrupoServicio } from "./grupo-servicio.model";
import { Complexity } from "./complexities.model";
import { PrestadorFiscalyearServicios } from "./prestador-fiscalyear-servicios.model";

export class Servicio extends BaseModel {
	name!: string;
    state!: generalStateTypes;
    code!: string;
    grupo_servicio_id!: string;

    grupoServicio?: GrupoServicio;
    complexity?: Complexity;
    prestadorFiscalyearServicios?: PrestadorFiscalyearServicios[];
}
