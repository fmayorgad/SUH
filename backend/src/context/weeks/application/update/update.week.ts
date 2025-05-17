import { WeekRepository } from '../../domain/weeks.repository';
import { Week } from '@models/week.model';
import { generalStateTypes } from '@enums/general-state-type';
import { WeekStatesEnum } from '@enums/weekstates';
import { DataSource } from 'typeorm';
import { InjectDataSource } from '@nestjs/typeorm';
import { FiscalYear } from '@models/fiscalyears.model';
import { WeekStates } from '@models/week_states';
import { Weekgroup } from '@models/weekgroup.model';
import {
BadRequestException,
HttpException,
HttpStatus,
Inject,
Injectable,
} from '@nestjs/common';

@Injectable()
export class UpdateWeek {
constructor(
    @Inject('PgWeekRepository') private readonly repository: WeekRepository,
    @InjectDataSource() private dataSource: DataSource,
) {}

async update(weekId: string, updatedWeek: Week): Promise<any | null> {
    console.log('Updating week :>> ', updatedWeek);

    const existingWeek = await this.repository.findById(weekId);

    if (!existingWeek) {
        throw new BadRequestException(
            ['La semana especificada no existe'],
            {
                cause: new Error(),
                description: 'La semana especificada no existe',
            },
        );
    }

    // Validate if there is another week with overlapping dates
    const weekInRange = await this.dataSource.query(
        `SELECT * FROM weeks as w WHERE (w."startDate" BETWEEN $1 AND $2 OR w."endDate" BETWEEN $1 AND $2) AND w.id != $3`,
        [updatedWeek.startDate, updatedWeek.endDate, weekId],
    );

    if (weekInRange.length > 0) {
        throw new BadRequestException(
            [`Ya existe una Semana con rango entre las fechas dadas: "${weekInRange[0].name}"`],
            {
                cause: new Error(),
                description: 'Ya existe una semana con esas fechas',
            },
        );
    }

    // Validate name uniqueness within the fiscal year
    const existingWeekWithName = await this.repository.findByName(
        updatedWeek.name,
    );

    if (existingWeekWithName && existingWeekWithName.id !== weekId) {
        throw new BadRequestException(
            ['Ya existe una semana con ese nombre en el año fiscal activo'],
            {
                cause: new Error(),
                description:
                    'Ya existe una semana con ese nombre en el año fiscal activo',
            },
        );
    }

    // Update week properties
    existingWeek.name = updatedWeek.name;
    existingWeek.description = updatedWeek.description;
    existingWeek.startDate = updatedWeek.startDate;
    existingWeek.endDate = updatedWeek.endDate;
    existingWeek.week_state = updatedWeek.week_state;
    existingWeek.state = updatedWeek.state;

    // Save updated week
    const updatedWeekEntity = await this.repository.update(existingWeek);

    console.log('Updated week :>> ', updatedWeekEntity);

    return updatedWeekEntity;
}
}