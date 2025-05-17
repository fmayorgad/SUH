
import {PrestadorType} from '@interfaces/prestadorType.interface';
export interface RepsResponse {
    id: string;
    codigoPrestador: string;
    nombrePrestador: string;
    nombreSede: string;
    municipioInicial: string;
    direccionSede: string;
    prestadorType: PrestadorType;
    weekGroupAgendaState: string;
}
