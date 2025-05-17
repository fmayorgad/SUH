import { Controller, Put, Body, Query, UseInterceptors } from '@nestjs/common';
import { UpdateWeekDto } from '../dto/update.week.dto';
import { ModuleName, Permissions, Metadata } from '@decorators/index';
import { PermissionEnum } from '@enums/permissions';
import { ModulesEnum } from '@enums/modules';
import { UpdateWeek } from '../../application/update/update.week';
import { Week } from '@models/week.model';
import { AuditInterceptor } from 'src/core/infraestructure/interceptors/audit.interceptor';

import {
ApiBearerAuth,
ApiConsumes,
ApiOperation,
ApiTags,
} from '@nestjs/swagger';

// Application

@ApiTags('Weeks')
@ApiBearerAuth()
@Controller('weeks')
export class PutWeeksController {
constructor(private readonly updateWeekService: UpdateWeek) {}

@Put('update')
@Permissions(PermissionEnum.UPDATE)
@ModuleName(ModulesEnum.WEEKS)
@Metadata('AUDIT', 'Actualización de semana')
@UseInterceptors(AuditInterceptor)
@ApiConsumes('application/x-www-form-urlencoded', 'application/json')
@ApiOperation({
    summary: 'Actualizar Semana',
    description:
        'Actualiza una semana en el sistema, con sus respectivas restricciones',
})
async updateWeek(@Query('id') weekid: string, @Body() updateWeekDto: UpdateWeekDto) {
    const updatedWeek = await this.updateWeekService.update(weekid, updateWeekDto as any);
    return updatedWeek;
}
}