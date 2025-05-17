import { Controller, Put, Body, Query, UseInterceptors } from '@nestjs/common';
import { UpdateWeekgroupDto } from '../dto/update.weekgroup.dto';
import { ModuleName, Permissions, Metadata } from '@decorators/index';
import { PermissionEnum } from '@enums/permissions';
import { ModulesEnum } from '@enums/modules';
import { UpdateWeekGroup } from '../../application/update/update.weekgroup';
import { Weekgroup } from '@models/weekgroup.model';
import { AuditInterceptor } from 'src/core/infraestructure/interceptors/audit.interceptor';

import {
  ApiBearerAuth,
  ApiConsumes,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('Weekgroups')
@ApiBearerAuth()
@Controller('weekgroups')
export class PutWeekGroupsController {
  constructor(private readonly updateWeekGroupService: UpdateWeekGroup) {}

  @Put('update')
  @Permissions(PermissionEnum.UPDATE)
  @ModuleName(ModulesEnum.WEEKGROUPS)
  @Metadata('AUDIT', 'Actualización de grupo de semanas')
  @UseInterceptors(AuditInterceptor)
  @ApiConsumes('application/x-www-form-urlencoded', 'application/json')
  @ApiOperation({
    summary: 'Actualizar Grupo de Semanas',
    description:
      'Actualiza un grupo de semanas en el sistema, con sus respectivas restricciones',
  })
  async updateWeekGroup(
    @Query('id') weekGroupId: string,
    @Body() updateWeekGroupDto: UpdateWeekgroupDto,
  ) {
    const updatedWeekGroup = await this.updateWeekGroupService.update(
      weekGroupId,
      updateWeekGroupDto as any,
    );
    return updatedWeekGroup;
  }
} 