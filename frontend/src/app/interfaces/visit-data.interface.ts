import { VisitTypesEnum } from '@enums/visit-types.enum';

export interface VisitData {
    id: string;
    lead: Record<string, any>;
    visitType: keyof typeof VisitTypesEnum;
    visitDate: string | Date;
    description?: string;
    notes?: string;
    state?: string;
    prestador?: { id: string; name?: string; code?: string };
    visits?: any;
} 