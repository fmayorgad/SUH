import { Controller, Get, Query } from '@nestjs/common';
import { ModuleName, Permissions } from '@decorators/index';
import { PermissionEnum } from '@enums/permissions';
import { ModulesEnum } from '@enums/modules';
import { GetWeekGroups } from '../../application/get/get.weekgroup';
import { FindByIdWeekGroup } from '../../application/findById/findbyId.weekgroup';
import { Weekgroup } from '@models/weekgroup.model';
import { WeekgroupGetDTO } from '../dto/get.weekgroup.dto';
import { dataPaginationResponse } from '@models/app.model';

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
async getWeekGroups(
    @Query() filter: WeekgroupGetDTO,
): Promise<Weekgroup[] | dataPaginationResponse> {
    const weekGroups = await this.getWeekGroupsService.getWeekGroups(filter);
    return weekGroups;
}

@Get('/findById')
@Permissions(PermissionEnum.DETAIL)
@ModuleName(ModulesEnum.WEEKGROUPS)
@ApiOperation({
    summary: 'Obtener Grupo de Semana por ID',
    description: 'Obtiene un grupo de semana por su ID',
})
async getWeekGroupById(@Query('id') id: string): Promise<Weekgroup | null> {
    const weekGroup = await this.findByIdService.findById(id);
    return weekGroup;
}
}