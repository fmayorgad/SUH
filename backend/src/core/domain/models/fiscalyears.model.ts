import { BaseModel } from "@models/base.model";
import type { generalStateTypes } from "@enums/general-state-type";
import type { Week } from '@models/week.model'
import type { PrestadorFiscalyearInformation } from './prestador-fiscalyear-information.model';
import type { PrestadorFiscalyearServicios } from './prestador-fiscalyear-servicios.model';
import type { PrestadorFiscalyearCapacidades } from './prestador-fiscalyear-capacidades.model';
import { WeekStates } from "./week_states";

export class FiscalYear extends BaseModel {
    name!: string;
    state!: generalStateTypes;
    start!: Date;
    end!: Date;
    realState?: WeekStates;
    subsecretario_name?: string;
    lider_programa_name?: string;

    // Relations
    weeks?: Week[];
    prestadorFiscalyearInformation?: PrestadorFiscalyearInformation[];
    prestadorFiscalyearServicios?: PrestadorFiscalyearServicios[];
    prestadorFiscalyearCapacidades?: PrestadorFiscalyearCapacidades[];
}
