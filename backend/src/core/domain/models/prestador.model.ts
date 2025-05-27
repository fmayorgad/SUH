import  { generalStateTypes } from "@enums/general-state-type";
import  { Municipio } from "@models/municipio.model";
import  { PrestadorType } from "@models/prestador-type.model";
import { PrestadorFiscalyearInformation } from "./prestador-fiscalyear-information.model";
import { PrestadorFiscalyearServicios } from "./prestador-fiscalyear-servicios.model";
import { PrestadorFiscalyearCapacidades } from "./prestador-fiscalyear-capacidades.model";
import { WeekgroupVisit } from "./weekgroupvisit.model";

export class Prestador {
    id!: string;
    identificador?: string;
    codigoPrestador?: string;
    nombreSede!: string;
    nombrePrestador?: string;
    prestadorType?: PrestadorType;
    codigoSede?: string;
    direccionSede?: string;
    state!: generalStateTypes;
    municipioInicial?: string;

    // foreign keys
    weekgroupvisits?: WeekgroupVisit[];
    fiscalYearInformation?: PrestadorFiscalyearInformation[];
    fiscalYearServicios?: PrestadorFiscalyearServicios[];
    fiscalYearCapacidades?: PrestadorFiscalyearCapacidades[];
}