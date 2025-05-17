import type { Week } from '@models/week.model';
import { WeekGetDTO } from '../infraestructure/dto/get.dto';

export interface WeekRepository {
  create(week): Promise<Week | null>;
  findByName(name: string): Promise<Week | null>;
  getWeeks(filter: WeekGetDTO);
  findById(id: string): Promise<Week | null>;
  update(  week: Week): Promise<Week | null>;
}
