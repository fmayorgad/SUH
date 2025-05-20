import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Like, Not, Repository, DataSource } from 'typeorm';
import { WeekGroupRepository } from './../../domain/weekgroups.repository';
import { Weekgroup } from '@models/weekgroup.model';
import { isArray } from 'class-validator';
import { dataPaginationResponse } from '@models/app.model';
import { WeekgroupVisitSchema } from '@schemas/weekgroupvisit.schema';
import { WeekgroupPrestadores } from '@models/weekgroup_prestadores.model';
import { WeekgroupVisit } from '@models/weekgroupvisit.model';

@Injectable()
export class PgsqlWeekGroupsRepository implements WeekGroupRepository {
  constructor(
    @InjectRepository(Weekgroup)
    private readonly repository: Repository<Weekgroup>,
    private dataSource: DataSource
  ) {}

  async create(weekGroup): Promise<any> {
    const newWeekGroup = this.repository.create(weekGroup);
    return await this.repository.save(newWeekGroup);
  }

  async findByName(name: string): Promise<Weekgroup | null> {
    const weekGroup = await this.repository.findOne({
      where: {
        name,
      },
    });

    return weekGroup;
  }

  async getWeekGroups(
    filter: any,
  ): Promise<Weekgroup[] | dataPaginationResponse> {
    try {
      const { searchText, lead, verificadores } = filter;

      console.log('filter repos:>> ', filter);

      const queryBuilder = this.repository
        .createQueryBuilder('weekgroup')
        .leftJoinAndSelect('weekgroup.leadData', 'leadData')
        .leftJoinAndSelect('weekgroup.weekgroupusers', 'weekgroupusers')
        .leftJoinAndSelect('weekgroup.weeks', 'weeks')
        .leftJoinAndSelect('weekgroupusers.members', 'members')
        .leftJoinAndSelect('weekgroup.weekgroupprestadores', 'weekgroupprestadores')
        .leftJoinAndSelect('weekgroupprestadores.prestadores', 'prestadores')
        .leftJoinAndSelect('prestadores.prestadorType', 'prestadorType');

      if (searchText) {
        queryBuilder.andWhere('weekgroup.name LIKE :searchText', {
          searchText: `%${searchText}%`,
        });
      }

      if (lead) {
        queryBuilder.andWhere('weekgroup.lead IN (:...lead)', { lead });
      }

      if (isArray(verificadores)) {
        queryBuilder.andWhere('weekgroupusers.id_user IN (:...verificadores)', {
          verificadores,
        });
      } else if (verificadores) {
        queryBuilder.andWhere('weekgroupusers.id_user = :verificadores', {
          verificadores,
        });
      }
      
      // Filter by userId if provided
      if (filter.userId) {
        queryBuilder.andWhere('(weekgroup.lead = :userId OR weekgroupusers.id_user = :userId)', 
          { userId: filter.userId });
      }
      
      //pagination
      if (filter?.skip) {
          queryBuilder.skip(filter?.skip).take(filter?.take);
      }
        
      queryBuilder.orderBy('weeks.week_state', 'DESC');

      const weekGroups = await queryBuilder.getMany();

      // Get all prestador IDs from weekgroupprestadores
      const prestadorIds: string[] = [];
      weekGroups.forEach(weekgroup => {
        if (weekgroup.weekgroupprestadores && weekgroup.weekgroupprestadores.length) {
          weekgroup.weekgroupprestadores.forEach(wp => {
            if (wp.prestadores?.id) {
              prestadorIds.push(wp.prestadores.id);
            }
          });
        }
      });

      console.log('prestadorIds in getWeekGroups :>> ', prestadorIds);

      // If we have any prestador ids, get their visits
      if (prestadorIds.length > 0) {
        const visitsQuery = await this.dataSource
          .getRepository(WeekgroupVisitSchema)
          .createQueryBuilder('visit')
          .leftJoinAndSelect('visit.lead', 'lead')
          .leftJoinAndSelect('visit.prestador', 'prestador')
          .where('visit.prestador_id IN (:...ids)', { ids: prestadorIds })
          .getMany();

        console.log('visitsQuery in getWeekGroups :>> ', visitsQuery);

        // Create a map for quick lookup of visits by prestador ID
        const visitsMap: { [key: string]: WeekgroupVisit[] } = {};
        visitsQuery.forEach(visit => {
          if (visit.prestador?.id) {
            if (!visitsMap[visit.prestador.id]) {
              visitsMap[visit.prestador.id] = [];
            }
            visitsMap[visit.prestador.id].push(visit);
          }
        });

        console.log('visitsMap in getWeekGroups :>> ', visitsMap);

        // Add the visits to the weekgroupprestadores objects
        weekGroups.forEach(weekgroup => {
          if (weekgroup.weekgroupprestadores && weekgroup.weekgroupprestadores.length) {
            weekgroup.weekgroupprestadores.forEach(wp => {
              console.log('wp in getWeekGroups :>> ', wp);
              if (wp.prestadores?.id && visitsMap[wp.prestadores.id]) {
                wp.visits = visitsMap[wp.prestadores.id];
              }
            });
          }
        });
      }

      const orderedWeeks = weekGroups.sort((a, b) => {
        const stateOrder = { ACTIVA: 1, ATRASADA: 2, CERRADA: 3 };
        return stateOrder[a.weeks.week_state] - stateOrder[b.weeks.week_state];
      });


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

      return weekGroups;
    } catch (error) {
      console.error('Error fetching week groups:', error);
      throw new Error('Failed to fetch week groups');
    }
  }

  async findById(id: string): Promise<Weekgroup | null> {
    const queryBuilder = this.repository
      .createQueryBuilder('weekgroup')
      .leftJoinAndSelect('weekgroup.leadData', 'leadData')
      .leftJoinAndSelect('weekgroup.weekgroupusers', 'weekgroupusers')
      .leftJoinAndSelect('weekgroup.weeks', 'weeks')
      .leftJoinAndSelect('weekgroupusers.members', 'members')
      .leftJoinAndSelect('weekgroup.weekgroupprestadores', 'weekgroupprestadores')
      .leftJoinAndSelect('weekgroupprestadores.prestadores', 'prestadores')
      .leftJoinAndSelect('prestadores.prestadorType', 'prestadorType')
      .where('weekgroup.id = :id', { id });
      
    const weekgroup = await queryBuilder.getOne();

    // If we found the weekgroup and it has prestadores, get their visits
    if (weekgroup?.weekgroupprestadores?.length > 0) {
      // Get all prestador IDs
      const prestadorIds: string[] = [];
      weekgroup.weekgroupprestadores.forEach(wp => {
        if (wp.prestadores?.id) {
          prestadorIds.push(wp.prestadores.id);
        }
      });

      console.log('prestadorIds in findById :>> ', prestadorIds);

      // If we have prestador ids, get their visits
      if (prestadorIds.length > 0) {
        const visitsQuery = await this.dataSource
          .getRepository(WeekgroupVisitSchema)
          .createQueryBuilder('visit')
          .leftJoinAndSelect('visit.lead', 'lead')
          .leftJoinAndSelect('visit.prestador', 'prestador')
          .where('visit.prestador_id IN (:...ids)', { ids: prestadorIds })
          .getMany();

        console.log('visitsQuery in findById :>> ', visitsQuery);

        // Create a map for quick lookup of visits by prestador ID
        const visitsMap = {};
        visitsQuery.forEach(visit => {
          if (visit.prestador?.id) {
            if (!visitsMap[visit.prestador.id]) {
              visitsMap[visit.prestador.id] = [];
            }
            visitsMap[visit.prestador.id] =visit;
          }
        });

        console.log('visitsMap in findById :>> ', visitsMap);

        // Add the visits to the weekgroupprestadores objects
        weekgroup.weekgroupprestadores.forEach(wp => {
          console.log('wp in findById :>> ', wp);
          if (wp.prestadores?.id && visitsMap[wp.prestadores.id]) {
            wp.visits = visitsMap[wp.prestadores.id];
          }
        });
      }
    }

    return weekgroup;
  }

  async update(weekGroup: Weekgroup): Promise<Weekgroup | null> {
    return await this.repository.save(weekGroup);
  }
}
