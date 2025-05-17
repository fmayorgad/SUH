import { Controller, Post, Body, UseInterceptors } from '@nestjs/common';
import { CreateWeekgroupDto } from '../dto/create.weekgroup.dto';
import { ModuleName, Permissions, Metadata } from '@decorators/index';
import { PermissionEnum } from '@enums/permissions';
import { ModulesEnum } from '@enums/modules';
import { CreateWeekgroup } from '../../application/create/create.weekgroup';
import { Weekgroup } from '@models/weekgroup.model';
import { AuditInterceptor } from 'src/core/infraestructure/interceptors/audit.interceptor';

import {
ApiBearerAuth,
ApiConsumes,
ApiOperation,
ApiTags,
} from '@nestjs/swagger';

// Application

@ApiTags('Weekgroups')
@ApiBearerAuth()
@Controller('weekgroups')
export class PostWeekGroupsController {
constructor(private readonly createWeekGroupService: CreateWeekgroup) {}

@Post('create')
@Permissions(PermissionEnum.CREATE)
@ModuleName(ModulesEnum.WEEKGROUPS)
@Metadata('AUDIT', 'Creación de grupo de semanas')
@UseInterceptors(AuditInterceptor)
@ApiConsumes('application/x-www-form-urlencoded', 'application/json')
@ApiOperation({
    summary: 'Crear Grupo de Semanas',
    description:
        'Crea un grupo de semanas en el sistema, con sus respectivas restricciones',
})
async createWeekGroup(@Body() createWeekGroupDto: CreateWeekgroupDto) {
    const createWeekGroup = await this.createWeekGroupService.create(createWeekGroupDto as any);
    return createWeekGroup;
}
}