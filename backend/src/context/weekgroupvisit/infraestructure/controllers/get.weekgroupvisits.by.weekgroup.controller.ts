import { Controller, Get, Param, ParseUUIDPipe } from '@nestjs/common';
import { ModuleName, Permissions } from '@decorators/index';
import { PermissionEnum } from '@enums/permissions';
import { ModulesEnum } from '@enums/modules';
import { GetWeekgroupVisitsByWeekgroup } from '../../application/get/get.weekgroupvisits.by.weekgroup';
import { WeekgroupVisit } from '@models/weekgroupvisit.model';

import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('WeekgroupVisits')
@ApiBearerAuth()
@Controller('weekgroupvisits')
export class GetWeekgroupVisitsByWeekgroupController {
  constructor(
    private readonly getWeekgroupVisitsByWeekgroupService: GetWeekgroupVisitsByWeekgroup,
  ) {}

  @Get('/by-weekgroup/:weekgroupId')
  @Permissions(PermissionEnum.READ)
  @ModuleName(ModulesEnum.WEEKGROUPS)
  @ApiOperation({
    summary: 'Obtener Visitas por Grupo de Semanas',
    description: 'Obtiene todas las visitas asociadas a un grupo de semanas específico',
  })
  @ApiParam({
    name: 'weekgroupId',
    type: 'string',
    format: 'uuid',
    description: 'ID del grupo de semanas',
    required: true,
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de visitas del grupo de semanas',
    type: [WeekgroupVisit],
  })
  async getVisitsByWeekgroupId(
    @Param('weekgroupId', ParseUUIDPipe) weekgroupId: string,
  ): Promise<WeekgroupVisit[]> {
    return await this.getWeekgroupVisitsByWeekgroupService.execute(weekgroupId);
  }
} 