import { Controller, Get, Query, Req } from '@nestjs/common';
import { ModuleName, Permissions } from '@decorators/index';
import { PermissionEnum } from '@enums/permissions';
import { ModulesEnum } from '@enums/modules';
import { GetWeekGroups } from '../../application/get/get.weekgroup';
import { FindByIdWeekGroup } from '../../application/findById/findbyId.weekgroup';
import { Weekgroup } from '@models/weekgroup.model';
import { WeekgroupGetDTO } from '../dto/get.weekgroup.dto';
import { dataPaginationResponse } from '@models/app.model';
import { Payload } from '@models/payload.model';
import { Request } from 'express';

import {
ApiBearerAuth,
ApiConsumes,
ApiOperation,
ApiTags,
} from '@nestjs/swagger';

@ApiTags('Weekgroups')
@ApiBearerAuth()
@Controller('weekgroups')
export class GetWeekGroupsController {
constructor(
    private readonly getWeekGroupsService: GetWeekGroups,
    private readonly findByIdService: FindByIdWeekGroup,
) {}

@Get('/all')
@Permissions(PermissionEnum.READ)
@ModuleName(ModulesEnum.WEEKGROUPS)
@ApiOperation({
    summary: 'Obtener Grupos de Semanas',
    description: 'Obtiene todos los grupos de semanas registrados en el sistema',
})
@ApiConsumes('application/json')
async getWeekGroups(
    @Query() filter: WeekgroupGetDTO,
    @Req() request: Request & { user: Payload }
): Promise<Weekgroup[] | dataPaginationResponse> {
    const userPayload = request.user;
    const weekGroups = await this.getWeekGroupsService.getWeekGroups(filter, userPayload);
    return weekGroups;
}

@Get('/findById')
@Permissions(PermissionEnum.DETAIL)
@ModuleName(ModulesEnum.WEEKGROUPS)
@ApiOperation({
    summary: 'Obtener Grupo de Semana por ID',
    description: 'Obtiene un grupo de semana por su ID',
})
@ApiConsumes('application/json')
async getWeekGroupById(
    @Query('id') id: string,
    @Req() request: Request & { user: Payload }
): Promise<Weekgroup | null> {
    const userPayload = request.user;
    const weekGroup = await this.findByIdService.findById(id, userPayload);
    return weekGroup;
}
}