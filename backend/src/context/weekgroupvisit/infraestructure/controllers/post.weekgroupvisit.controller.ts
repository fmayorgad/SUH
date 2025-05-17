import { Body, Controller, Post, UseInterceptors } from '@nestjs/common';
import { ModuleName, Permissions, Metadata } from '@decorators/index';
import { PermissionEnum } from '@enums/permissions';
import { ModulesEnum } from '@enums/modules';
import { CreateWeekgroupVisit } from '../../application/create/create.weekgroupvisit';
import { CreateWeekgroupVisitDTO } from '../dto/create.weekgroupvisit.dto';
import { WeekgroupVisit } from '@models/weekgroupvisit.model';
import { AuditInterceptor } from 'src/core/infraestructure/interceptors/audit.interceptor';

import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('WeekgroupVisits')
@ApiBearerAuth()
@Controller('weekgroupvisits')
export class PostWeekgroupVisitController {
  constructor(
    private readonly createWeekgroupVisitService: CreateWeekgroupVisit,
  ) {}

  @Post('create')
  @Permissions(PermissionEnum.CREATE)
  @ModuleName(ModulesEnum.WEEKGROUPS) // Using same module as weekgroups
  @Metadata('AUDIT', 'Creación de visita de grupo de semanas')
  @UseInterceptors(AuditInterceptor)
  @ApiOperation({
    summary: 'Crear Visita de Grupo de Semanas',
    description: 'Crea una nueva visita para un grupo de semanas',
  })
  @ApiBody({ type: CreateWeekgroupVisitDTO })
  @ApiResponse({
    status: 201,
    description: 'Visita creada exitosamente',
    type: WeekgroupVisit,
  })
  @ApiResponse({
    status: 400,
    description: 'Datos inválidos'
  })
  @ApiResponse({
    status: 500,
    description: 'Error del servidor'
  })
  async createWeekgroupVisit(
    @Body() createDto: CreateWeekgroupVisitDTO,
  ): Promise<WeekgroupVisit> {
    const weekgroupVisit = await this.createWeekgroupVisitService.createWeekgroupVisit(createDto);
    return weekgroupVisit;
  }
} 