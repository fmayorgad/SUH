import { Controller, Post, Body, UseInterceptors } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiConsumes,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { CreateWeekDto } from '../dto/create.week.dto';
import { ModuleName, Permissions, Metadata } from '@decorators/index';
import { PermissionEnum } from '@enums/permissions';
import { ModulesEnum } from '@enums/modules';
import { AuditInterceptor } from 'src/core/infraestructure/interceptors/audit.interceptor';

//Application
import { CreateWeek } from '../../application/create/create.week';
import { Week } from '@models/week.model';

@ApiTags('Weeks')
@ApiBearerAuth()
@Controller('weeks')
export class PostWeeksController {
  constructor(private readonly createWeekService: CreateWeek) {}

  @Post('create')
  @Permissions(PermissionEnum.CREATE)
  @ModuleName(ModulesEnum.WEEKS)
  @Metadata('AUDIT', 'Creación de semana')
  @UseInterceptors(AuditInterceptor)
  @ApiConsumes('application/x-www-form-urlencoded', 'application/json')
  @ApiOperation({
    summary: 'Crear Semana',
    description:
      'Crea una semana en el sistema, con sus respectivas restricciones',
  })
  async createWeek(@Body() createWeekDto: CreateWeekDto) {
    const createWeek = await this.createWeekService.create(createWeekDto as any);
    return createWeek;
  }
}
