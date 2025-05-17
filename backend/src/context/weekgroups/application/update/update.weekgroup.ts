import { Weekgroup } from '@models/weekgroup.model';
import { generalStateTypes } from '@enums/general-state-type';
import { DataSource, FindOptionsWhere, In, Not } from 'typeorm';
import { InjectDataSource } from '@nestjs/typeorm';
import {
  BadRequestException,
  Injectable,
} from '@nestjs/common';
import { WeekgroupUsers } from '@models/weekgroup_users.model';
import { WeekgroupPrestadores } from '@models/weekgroup_prestadores.model';
import { Users } from '@models/user.model';
import { Prestador } from '@models/prestador.model';
import { WeekGroupsPrestadoresEnum } from '@enums/weekgroupsprestadores';
import { Week } from '@models/week.model';

interface UpdateWeekGroupData extends Weekgroup {
  members?: string[];
  selectedPrestadores?: string[];
}

@Injectable()
export class UpdateWeekGroup {
  constructor(
    @InjectDataSource() private dataSource: DataSource,
  ) { }

  async update(weekGroupId: string, updatedWeekGroup: UpdateWeekGroupData): Promise<any | null> {
    console.log('Updating week group :>> ', updatedWeekGroup);

    const weekgroupRepository = this.dataSource.getRepository(Weekgroup);
    const existingWeekGroup = await weekgroupRepository.findOne({
      where: { id: weekGroupId }
    });

    //validate if any weekgroup 

    if (!existingWeekGroup) {
      throw new BadRequestException(
        ['El grupo de semana especificado no existe'],
        {
          cause: new Error(),
          description: 'El grupo de semana especificado no existe',
        },
      );
    }

    // Validate if there is another weekgroup with the same name in the same week
    const existingWeekGroupWithName = await weekgroupRepository.findOne({
      where: {
        name: updatedWeekGroup.name,
        id_week: existingWeekGroup.id_week,
        id: Not(weekGroupId),
      },
    });

    if (existingWeekGroupWithName) {
      throw new BadRequestException(
        ['Ya existe un grupo de semana con ese nombre en la semana actual'],
        {
          cause: new Error(),
          description: 'Ya existe un grupo de semana con ese nombre en la semana actual',
        },
      );
    }

    //Validate also that the week of the weekgroup have an week_state ACTIVA
    const week = await this.dataSource.getRepository(Week).findOne({
      where: { id: existingWeekGroup.id_week.id, state: generalStateTypes.ACTIVO } as unknown as FindOptionsWhere<Week>
    });

    if (!week) {
      throw new BadRequestException(['La semana del grupo de semana no está activa'], { cause: new Error(), description: 'La semana del grupo de semana no está activa' });
    }

    // Update weekgroup properties
    existingWeekGroup.name = updatedWeekGroup.name;
    existingWeekGroup.description = updatedWeekGroup.description;
    existingWeekGroup.lead = updatedWeekGroup.lead;
    existingWeekGroup.state = updatedWeekGroup.state || existingWeekGroup.state;

    // Handle members update only if members array is provided
    if (updatedWeekGroup.members !== undefined) {
      // Remove existing members
      await this.dataSource
        .getRepository(WeekgroupUsers)
        .createQueryBuilder()
        .delete()
        .where('id_weekgroup = :id', { id: weekGroupId })
        .execute();

      // Add new members
      const newMembers = await Promise.all(updatedWeekGroup.members.map(async userId => {
        const weekgroupUser = new WeekgroupUsers();
        const weekgroup = new Weekgroup();
        weekgroup.id = weekGroupId;
        const user = new Users();
        user.id = userId;

        weekgroupUser.id_weekgroup = weekgroup;
        weekgroupUser.id_user = user;
        weekgroupUser.state = generalStateTypes.ACTIVO;
        return weekgroupUser;
      }));

      await this.dataSource
        .getRepository(WeekgroupUsers)
        .save(newMembers);
    }

    // Handle prestadores update only if selectedPrestadores array is provided
    if (updatedWeekGroup.selectedPrestadores !== undefined) {
      // Get existing prestadores for this weekgroup
      const existingPrestadores = await this.dataSource
        .getRepository(WeekgroupPrestadores)
        .find({
          select: ['id_prestador'],
          where: {
            id_weekgroup: In([weekGroupId])
          },
        });

      console.log("existingPrestadores", existingPrestadores)
      console.log("updatedWeekGroup.selectedPrestadores", updatedWeekGroup.selectedPrestadores)

      // Find prestadores to delete (those that exist but are not in updated list)
      const prestadoresToDelete = existingPrestadores.filter(
        existing => !updatedWeekGroup.selectedPrestadores.includes(existing.id_prestador as unknown as string)
      );

      console.log("prestadoresToDelete", prestadoresToDelete)

      // Delete removed prestadores
      if (prestadoresToDelete.length > 0) {
        await this.dataSource
          .getRepository(WeekgroupPrestadores)
          .createQueryBuilder()
          .delete()
          .where('id_weekgroup = :id', { id: weekGroupId })
          .andWhere('id_prestador IN (:...ids)', { ids: prestadoresToDelete.map(p => p.id_prestador) })
          .execute();
      }

      // Find new prestadores to add (those in updated list but not existing)
      const existingPrestadorIds = existingPrestadores.map(p => p.id_prestador as unknown as string);

      const newPrestadorIds = updatedWeekGroup.selectedPrestadores.filter(
        id => !existingPrestadorIds.includes(id)
      );

      // Add new prestadores
      const newPrestadores = await Promise.all(newPrestadorIds.map(async prestadorId => {
        const weekgroupPrestador = new WeekgroupPrestadores();
        const weekgroup = new Weekgroup();
        weekgroup.id = weekGroupId;
        const prestador = new Prestador();
        prestador.id = prestadorId;

        weekgroupPrestador.id_weekgroup = weekgroup;
        weekgroupPrestador.id_prestador = prestador;
        weekgroupPrestador.state = generalStateTypes.ACTIVO;
        weekgroupPrestador.weekgroupState = WeekGroupsPrestadoresEnum.PENDIENTE;
        return weekgroupPrestador;
      }));

      if (newPrestadores.length > 0) {
        await this.dataSource
          .getRepository(WeekgroupPrestadores)
          .save(newPrestadores);
      }
    }

    // Save updated weekgroup - only update the weekgroup table data
    const updatedWeekGroupEntity = await weekgroupRepository
      .createQueryBuilder()
      .update(Weekgroup)
      .set({
        name: existingWeekGroup.name,
        description: existingWeekGroup.description,
        lead: existingWeekGroup.lead,
        state: existingWeekGroup.state
      })
      .where("id = :id", { id: weekGroupId })
      .execute();

    return updatedWeekGroupEntity;
  }
} 