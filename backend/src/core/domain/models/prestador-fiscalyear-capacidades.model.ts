import { generalStateTypes } from "@enums/general-state-type";
import { Prestador } from "./prestador.model";
import { FiscalYear } from "./fiscalyears.model";

export class PrestadorFiscalyearCapacidades {
    id!: string;
    prestador_id!: string;
    fiscal_year_id!: string;
    state!: generalStateTypes;
    
    // Camas fields
    camas?: string;
    camas_concepto?: string;
    camas_cantidad?: string;
    
    // Camillas fields
    camillas_concepto?: string;
    camillas_cantidad?: string;
    
    // Salas fields
    salas_concepto?: string;
    
    // Sillas fields
    sillas_concepto?: string;
    
    // Consultorios fields
    consultorios_concepto?: string;
    consultorios_cantidad?: string;
    
    // Unidad móvil fields
    unidad_movil_concepto?: string;
    unidad_movil_cantidad?: string;
    unidad_movil_placa?: string;
    
    // Ambulancias fields
    ambulancias_concepto?: string;
    ambulancias_cantidad?: string;
    ambulancias_placa?: string;

    // Foreign key relations
    prestador!: Prestador;
    fiscalYear!: FiscalYear;
} 