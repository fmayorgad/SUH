import { Controller, Post, Param, HttpCode, HttpStatus, UseInterceptors, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiParam } from '@nestjs/swagger';
import { SendVisitToPrestador } from '../../application/send-to-prestador/send.visit.to.prestador';
import { ModuleName, Permissions, Metadata } from '@decorators/index';
import { ModulesEnum } from '@enums/modules';
import { PermissionEnum } from '@enums/permissions';
import { AuditInterceptor } from 'src/core/infraestructure/interceptors/audit.interceptor';

@ApiTags('Visits')
@ApiBearerAuth()
@Controller('visits')
export class SendToPrestadorController {
  constructor(private readonly sendVisitToPrestador: SendVisitToPrestador) {}

  @Get(':id/sendToPrestador')
  @HttpCode(HttpStatus.OK)
  @Permissions(PermissionEnum.UPDATE)
  @ModuleName(ModulesEnum.VISITS)
  @Metadata('AUDIT', 'Envío de visita al prestador')
  @UseInterceptors(AuditInterceptor)
  @ApiOperation({ summary: 'Send a visit notification to the prestador' })
  @ApiParam({ name: 'id', description: 'Visit ID', type: String })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Visit notification sent successfully',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Visit not found',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Bad request',
  })
  async sendToPrestador(@Param('id') id: string) {
    return await this.sendVisitToPrestador.execute(id);
  }
} 