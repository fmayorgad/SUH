import type { WeekgroupVisit } from '@models/weekgroupvisit.model';
import { WeekgroupVisitGetDTO } from '../infraestructure/dto/get.weekgroupvisit.dto';

export interface WeekgroupVisitRepository {
    create(weekgroupVisit: WeekgroupVisit): Promise<WeekgroupVisit | null>;
    findById(id: string): Promise<WeekgroupVisit | null>;
    getWeekgroupVisits(filter: WeekgroupVisitGetDTO);
    update(weekgroupVisit: WeekgroupVisit): Promise<WeekgroupVisit | null>;
    getVisitsByWeekgroupId(weekgroupId: string): Promise<WeekgroupVisit[]>;
} 