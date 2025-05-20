import { Controller, Get, Query, Req } from '@nestjs/common';
import { ModuleName, Permissions } from '@decorators/index';
import { PermissionEnum } from '@enums/permissions';
import { ModulesEnum } from '@enums/modules';
import { GetWeekgroupVisits } from '../../application/get/get.weekgroupvisit';
import { WeekgroupVisit } from '@models/weekgroupvisit.model';
import { WeekgroupVisitGetDTO } from '../dto/get.weekgroupvisit.dto';
import { dataPaginationResponse } from '@models/app.model';
import { Payload } from '@models/payload.model';

import {
  ApiBearerAuth,
  ApiConsumes,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { Request } from 'express';

@ApiTags('WeekgroupVisits')
@ApiBearerAuth()
@Controller('weekgroupvisits')
export class GetWeekgroupVisitController {
  constructor(
    private readonly getWeekgroupVisitsService: GetWeekgroupVisits,
  ) {}

  @Get('/all')
  @Permissions(PermissionEnum.READ)
  @ModuleName(ModulesEnum.WEEKGROUPS) // Assuming we use the same module as weekgroups
  @ApiOperation({
    summary: 'Obtener Visitas de Grupos de Semanas',
    description: 'Obtiene todas las visitas de grupos de semanas registradas en el sistema',
  })
  @ApiConsumes('application/json')
  async getWeekgroupVisits(
    @Query() filter: WeekgroupVisitGetDTO,
    @Req() request: Request & { user: Payload }
  ): Promise<WeekgroupVisit[] | dataPaginationResponse> {
    const userPayload = request.user;
    const weekgroupVisits = await this.getWeekgroupVisitsService.getWeekgroupVisits(filter, userPayload);
    return weekgroupVisits;
  }
} 