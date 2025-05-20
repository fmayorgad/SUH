import type { WeekgroupVisit } from '@models/weekgroupvisit.model';
import { WeekgroupVisitGetDTO } from '../infraestructure/dto/get.weekgroupvisit.dto';
import { dataPaginationResponse } from '@models/app.model';

export interface WeekgroupVisitRepository {
    create(weekgroupVisit: WeekgroupVisit): Promise<WeekgroupVisit | null>;
    findById(id: string): Promise<WeekgroupVisit | null>;
    getWeekgroupVisits(filter: WeekgroupVisitGetDTO): Promise<WeekgroupVisit[] | dataPaginationResponse>;
    update(weekgroupVisit: WeekgroupVisit): Promise<WeekgroupVisit | null>;
    getVisitsByWeekgroupId(weekgroupId: string): Promise<WeekgroupVisit[]>;
} 