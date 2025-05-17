import { Member } from './member.interface';

export interface WeekGroupUser {
    id: string;
    id_weekgroup: string;
    id_user: string;
    state: string;
    members: Member;
} 