import { Body, Controller, HttpCode, HttpStatus, Param, Patch, UseInterceptors } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UpdateWeekgroupVisit } from '../../application/update/update.weekgroupvisit';
import { UpdateWeekgroupVisitDTO } from '../dto/update.weekgroupvisit.dto';
import { WeekgroupVisit } from '@models/weekgroupvisit.model';
import { ModulesEnum } from '@enums/modules';
import { PermissionEnum } from '@enums/permissions';
import { ModuleName, Permissions, Metadata } from '@decorators/index';
import { AuditInterceptor } from 'src/core/infraestructure/interceptors/audit.interceptor';

@ApiTags('WeekgroupVisits')
@ApiBearerAuth()
@Controller('weekgroupvisits')
export class PatchWeekgroupVisitController {
  constructor(private readonly updateWeekgroupVisit: UpdateWeekgroupVisit) {}

  @Patch(':id')
  @Permissions(PermissionEnum.CREATE)
  @ModuleName(ModulesEnum.WEEKGROUPS) 
  @Metadata('AUDIT', 'Actualización de visita de grupo de semanas')
  @UseInterceptors(AuditInterceptor)
  @ApiOperation({ summary: 'Actualizar un Grupo de Visita' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Weekgroup visit successfully updated',
    type: WeekgroupVisit,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Weekgroup visit not found',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid input data',
  })
  async update(
    @Param('id') id: string,
    @Body() updateDto: UpdateWeekgroupVisitDTO,
  ): Promise<WeekgroupVisit | null> {
    return this.updateWeekgroupVisit.updateWeekgroupVisit(id, updateDto);
  }
} 