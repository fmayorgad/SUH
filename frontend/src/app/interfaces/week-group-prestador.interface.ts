import { Prestador } from './prestador.interface';
import { VisitData } from './visit-data.interface';

export interface WeekGroupPrestador {
	weekgroupvisit: any;
    id: string;
    id_weekgroup: string;
    id_prestador: string;
    state: string;
    prestadores: Prestador;
    weekgroupState: string;
    visits?: VisitData;
} 