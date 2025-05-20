import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { WeekgroupVisitRepository } from '../../domain/weekgroupvisit.repository';
import { WeekgroupVisit } from '@models/weekgroupvisit.model';
import { WeekgroupVisitGetDTO } from '../dto/get.weekgroupvisit.dto';
import { dataPaginationResponse } from '@models/app.model';
import { WeekgroupVisitSchema } from '@schemas/weekgroupvisit.schema';

@Injectable()
export class PgsqlWeekgroupVisitRepository implements WeekgroupVisitRepository {
  constructor(
    @InjectRepository(WeekgroupVisitSchema)
    private readonly weekgroupVisitRepository: Repository<WeekgroupVisit>,
  ) {}

  async create(weekgroupVisit: WeekgroupVisit): Promise<WeekgroupVisit | null> {
    const createdWeekgroupVisit = await this.weekgroupVisitRepository.save(weekgroupVisit);
    return createdWeekgroupVisit;
  }

  async findById(id: string): Promise<WeekgroupVisit | null> {
    const weekgroupVisit = await this.weekgroupVisitRepository.findOne({
      where: { id },
      relations: ['weekgroup', 'lead', 'prestador'],
    });
    return weekgroupVisit;
  }

  async getWeekgroupVisits(filter: WeekgroupVisitGetDTO): Promise<WeekgroupVisit[] | dataPaginationResponse> {
    const query = this.weekgroupVisitRepository.createQueryBuilder('weekgroupvisit')
      .leftJoinAndSelect('weekgroupvisit.weekgroup', 'weekgroup')
      .leftJoinAndSelect('weekgroupvisit.lead', 'user')
      .leftJoinAndSelect('weekgroupvisit.prestador', 'prestador')
      .leftJoinAndSelect('weekgroup.weekgroupusers', 'weekgroupusers');

    if (filter.id) {
      query.andWhere('weekgroupvisit.id = :id', { id: filter.id });
    }

    if (filter.searchText) {
      query.andWhere('weekgroupvisit.description ILIKE :searchText', 
        { searchText: `%${filter.searchText}%` });
    }

    if (filter.weekgroupId) {
      query.andWhere('weekgroupvisit.weekgroup = :weekgroupId', { weekgroupId: filter.weekgroupId });
    }

    if (filter.leadId) {
      query.andWhere('weekgroupvisit.lead = :leadId', { leadId: filter.leadId });
    }

    if (filter.prestadorId) {
      query.andWhere('weekgroupvisit.prestador = :prestadorId', { prestadorId: filter.prestadorId });
    }

    if (filter.visitType) {
      query.andWhere('weekgroupvisit.visitType = :visitType', { visitType: filter.visitType });
    }

    if (filter.visitState) {
      query.andWhere('weekgroupvisit.visitState = :visitState', { visitState: filter.visitState });
    }

    if (filter.startDate && filter.endDate) {
      query.andWhere('weekgroupvisit.visitDate BETWEEN :startDate AND :endDate', 
        { startDate: filter.startDate, endDate: filter.endDate });
    }

    // Filter by userId if provided
    if (filter.userId) {
      query.andWhere('(weekgroupvisit.lead = :userId OR weekgroupusers.id_user = :userId)', 
        { userId: filter.userId });
    }

    const result = await query.getMany();
    return result;
  }

  async getWeekgroupVisitsForUser(filter: WeekgroupVisitGetDTO, userId: string): Promise<WeekgroupVisit[] | dataPaginationResponse> {
    const query = this.weekgroupVisitRepository.createQueryBuilder('weekgroupvisit')
      .leftJoinAndSelect('weekgroupvisit.weekgroup', 'weekgroup')
      .leftJoinAndSelect('weekgroupvisit.lead', 'user')
      .leftJoinAndSelect('weekgroupvisit.prestador', 'prestador')
      .leftJoinAndSelect('weekgroup.members', 'members')
      // Filter where the user is either the lead of the visit or a member of the weekgroup
      .where('(weekgroupvisit.lead = :userId OR members.id = :userId)', { userId });

    if (filter.id) {
      query.andWhere('weekgroupvisit.id = :id', { id: filter.id });
    }

    if (filter.searchText) {
      query.andWhere('weekgroupvisit.description ILIKE :searchText', 
        { searchText: `%${filter.searchText}%` });
    }

    if (filter.weekgroupId) {
      query.andWhere('weekgroupvisit.weekgroup = :weekgroupId', { weekgroupId: filter.weekgroupId });
    }

    if (filter.leadId) {
      query.andWhere('weekgroupvisit.lead = :leadId', { leadId: filter.leadId });
    }

    if (filter.prestadorId) {
      query.andWhere('weekgroupvisit.prestador = :prestadorId', { prestadorId: filter.prestadorId });
    }

    if (filter.visitType) {
      query.andWhere('weekgroupvisit.visitType = :visitType', { visitType: filter.visitType });
    }

    if (filter.visitState) {
      query.andWhere('weekgroupvisit.visitState = :visitState', { visitState: filter.visitState });
    }

    if (filter.startDate && filter.endDate) {
      query.andWhere('weekgroupvisit.visitDate BETWEEN :startDate AND :endDate', 
        { startDate: filter.startDate, endDate: filter.endDate });
    }

    const result = await query.getMany();
    return result;
  }

  async getVisitsByWeekgroupId(weekgroupId: string, userId?: string): Promise<WeekgroupVisit[]> {
    const query = this.weekgroupVisitRepository.createQueryBuilder('weekgroupvisit')
      .leftJoinAndSelect('weekgroupvisit.weekgroup', 'weekgroup')
      .leftJoinAndSelect('weekgroupvisit.lead', 'user')
      .leftJoinAndSelect('weekgroupvisit.prestador', 'prestador')
      .leftJoinAndSelect('weekgroup.weekgroupusers', 'weekgroupusers')
      .where('weekgroupvisit.weekgroup = :weekgroupId', { weekgroupId });
    
    // Filter by userId if provided
    if (userId) {
      query.andWhere('(weekgroupvisit.lead = :userId OR weekgroupusers.id_user = :userId)', 
        { userId });
    }
    
    query.orderBy('weekgroupvisit.visitDate', 'DESC');  // Latest visits first
    
    const visits = await query.getMany();
    return visits;
  }

  async getVisitsByWeekgroupIdForUser(weekgroupId: string, userId: string): Promise<WeekgroupVisit[]> {
    const visits = await this.weekgroupVisitRepository.createQueryBuilder('weekgroupvisit')
      .leftJoinAndSelect('weekgroupvisit.weekgroup', 'weekgroup')
      .leftJoinAndSelect('weekgroupvisit.lead', 'user')
      .leftJoinAndSelect('weekgroupvisit.prestador', 'prestador')
      .leftJoinAndSelect('weekgroup.members', 'members')
      .where('weekgroupvisit.weekgroup = :weekgroupId', { weekgroupId })
      // Filter where the user is either the lead of the visit or a member of the weekgroup
      .andWhere('(weekgroupvisit.lead = :userId OR members.id = :userId)', { userId })
      .orderBy('weekgroupvisit.visitDate', 'DESC')  // Latest visits first
      .getMany();
    
    return visits;
  }

  async update(weekgroupVisit: WeekgroupVisit): Promise<WeekgroupVisit | null> {
    const updatedWeekgroupVisit = await this.weekgroupVisitRepository.save(weekgroupVisit);
    return updatedWeekgroupVisit;
  }
} 