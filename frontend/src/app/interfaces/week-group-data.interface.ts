import { Member } from './member.interface';
import { WeekGroupUser } from './week-group-user.interface';
import { WeekGroupPrestador } from './week-group-prestador.interface';

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