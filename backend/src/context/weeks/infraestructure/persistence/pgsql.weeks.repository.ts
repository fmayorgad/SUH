import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, In, Like, Repository } from 'typeorm';
import { WeekRepository } from './../../domain/weeks.repository';
import { Week } from '@models/week.model';
import { dataPaginationResponse } from '@models/app.model';
import { isArray } from 'class-validator';
import { WeekStates } from '@models/week_states';

@Injectable()
export class PgsqlWeeksRepository implements WeekRepository {
  constructor(
    @InjectRepository(Week)
    private readonly repository: Repository<Week>,
  ) {}

  async create(week): Promise<any> {
    const newWeek = this.repository.create(week);
    return await this.repository.save(newWeek);
  }

  async update(week: Week): Promise<any> {
    return await this.repository.save(week);
  }

  async findByName(name: string): Promise<Week | null> {
    const week = await this.repository.findOne({
      where: {
        name,
        fiscalyears: {
          realState: WeekStates.ACTIVA,
        },
      },
    });

    return week;
  }

  async getWeeks(filter: any): Promise<Week[] | dataPaginationResponse> {
    const { searchText, lead, verificadores, startDate, endDate } = filter;

    //this query its mean to be used has a main enentity ids finder, to be used in the main query to get all and not filter any data, because fulters ar aplied here
    const mainquery = await this.repository.find({
      select: { id: true },
      where: {
        name: searchText ? Like(`%${searchText}%`) : undefined,
        weekGroups: {
          lead: isArray(lead) ? In(lead) : lead,
          weekgroupusers: {
            id_user: isArray(verificadores) ? In(verificadores) : verificadores,
          },
        },
        startDate:
          startDate && endDate ? Between(startDate, endDate) : undefined,
      },
    });

    if (!mainquery || mainquery.length === 0) {
      return {
        total: 0,
        page: 0,
        limit: 0,
        data: [],
      };
    }

    const queryBuilder = this.repository.manager.connection
      .createQueryBuilder(Week, 'week')
      .leftJoinAndSelect('week.weekGroups', 'weekGroups')
      .leftJoinAndSelect('week.fiscalyears', 'fiscalyear')
      .leftJoinAndSelect(
        'weekGroups.weekgroupprestadores',
        'weekgroupprestadores',
      )
      .leftJoinAndSelect('weekGroups.leadData', 'leadData')
      .leftJoinAndSelect('weekGroups.weeks', 'weeks')
      .leftJoinAndSelect('weekGroups.weekgroupusers', 'weekgroupusers')
      .leftJoinAndSelect('weekgroupusers.members', 'users')
      .leftJoinAndSelect('weekgroupprestadores.prestadores', 'prestadores')
      .withDeleted()
      .where('week.id IN (:...ids)', {
        ids: mainquery.map((week) => week.id),
      });
    //pagination
    if (filter?.skip) {
      queryBuilder.skip(filter?.skip).take(filter?.take);
    } else {
      queryBuilder.orderBy('week.startDate', 'DESC');
    }

    const weeks = await queryBuilder.getMany();

    const orderedWeeks = weeks.sort((a, b) => {
      const stateOrder = { ACTIVA: 1, ATRASADA: 2, CERRADA: 3 };
      return stateOrder[a.week_state] - stateOrder[b.week_state];
    });

    //if comes with filter?.skip and filter?.take, then it will be paginated, else it will be all the data
    if (filter?.skip && filter?.take) {
      const total = await queryBuilder.getCount();
      const page = Math.floor(filter?.skip / filter?.take) + 1;
      const limit = filter?.take;
      return {
        total,
        page,
        limit,
        data: orderedWeeks,
      };
    }

    return orderedWeeks;
  }

  async findById(id: string): Promise<Week | null> {
    const week = await this.repository.findOne({
      where: {
        id,
      },
      relations: {
        fiscalyears: true,
        weekGroups: {
          leadData: true,
          weekgroupusers: {
            members: true,
          },
          weekgroupprestadores: {
            prestadores: true,
          },
        },
      },
    });

    return week;
  }
}
