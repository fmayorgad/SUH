import { BaseModel } from './base.interface';
import type {GeneralStateTypesEnum} from '@enums/general-state-types.enum';
import type { Week } from './week.interface';
import type { User } from './users.interface';

export class Weekgroup extends BaseModel {
	name!: string;
	description?: string;
	state!: GeneralStateTypesEnum;
	id_week!: Week;
	lead!: User;
}

export interface Prestador {
	id: string;
	identificador: string;
	codigoPrestador: string;
	nombreSede: string;
	correoSede: string;
	telefonoSede: string;
	direccionSede: string;
}

export interface WeekGroupPrestador {
	id: string;
	id_weekgroup: string;
	id_prestador: string;
	state: string;
	prestadores: Prestador;
	weekgroupState: string;
}

export interface Member {
	id: string;
	name: string;
	surname: string;
	lastname: string | null;
	email: string;
	phone: string;
}

export interface WeekGroupUser {
	id: string;
	id_weekgroup: string;
	id_user: string;
	state: string;
	members: Member;
}

export interface WeekGroupData {
	id: string;
	name: string;
	description: string;
	state: string;
	id_week: string;
	lead: string;
	leadData: Member;
	weekgroupusers: WeekGroupUser[];
	weekgroupprestadores: WeekGroupPrestador[];
}
