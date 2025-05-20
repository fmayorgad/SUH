import { Body, Controller, HttpCode, HttpStatus, Param, Put, UseInterceptors } from '@nestjs/common';
import { ApiBearerAuth, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { UpdateVisit } from '../../application/update/update.visit';
import { UpdateVisitDto } from '../dto/update.visit.dto';
import { ModuleName, Permissions, Metadata, User } from '@decorators/index';
import { ModulesEnum } from '@enums/modules';
import { PermissionEnum } from '@enums/permissions';
import { AuditInterceptor } from 'src/core/infraestructure/interceptors/audit.interceptor';
import { Payload } from '@models/payload.model';

@ApiTags('Visits')
@ApiBearerAuth()
@Controller('visits')
export class UpdateVisitController {
  constructor(private readonly updateVisitUseCase: UpdateVisit) {}

  @ApiConsumes('application/json')
  @Put(':id')
  @HttpCode(HttpStatus.OK)
  @Permissions(PermissionEnum.UPDATE)
  @ModuleName(ModulesEnum.VISITS)
  @Metadata('AUDIT', 'Actualización de visita')
  @UseInterceptors(AuditInterceptor)
  async execute(
    @Param('id') id: string, 
    @Body() visitDto: UpdateVisitDto,
    @User() userPayload: Payload
  ) {
    const visit = await this.updateVisitUseCase.execute(id, visitDto, userPayload);
    return visit;
  }
} 