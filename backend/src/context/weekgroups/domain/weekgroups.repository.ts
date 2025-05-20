import type { Weekgroup } from '@models/weekgroup.model';
import {WeekgroupGetDTO} from '../infraestructure/dto/get.weekgroup.dto';
import { dataPaginationResponse } from '@models/app.model';

export interface WeekGroupRepository {
    create(weekGroup: Weekgroup): Promise<Weekgroup | null>;
    findByName(name: string, fiscalYearId: string): Promise<Weekgroup | null>;
    getWeekGroups(filter: WeekgroupGetDTO): Promise<Weekgroup[] | dataPaginationResponse>;
    findById(id: string): Promise<Weekgroup | null>;
    update(weekGroup: Weekgroup): Promise<Weekgroup | null>;
}