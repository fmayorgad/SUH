import { Controller, Get, HttpCode, HttpStatus, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBearerAuth } from '@nestjs/swagger';
import { FindServicioById } from '../../application/findbyid/findbyid.servicio';
import { ModuleName, Permissions } from '@decorators/index';
import { ModulesEnum } from '@enums/modules';
import { PermissionEnum } from '@enums/permissions';

@ApiTags('Servicios')
@ApiBearerAuth()
@Controller('servicios')
export class FindServicioByIdController {
  constructor(private readonly findServicioById: FindServicioById) {}

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @Permissions(PermissionEnum.READ)
  @ModuleName(ModulesEnum.SERVICIOS)
  @ApiOperation({ summary: 'Get a servicio by ID' })
  @ApiParam({ name: 'id', description: 'Servicio ID', type: String })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Servicio retrieved successfully',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Servicio not found',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized',
  })
  async findById(@Param('id') id: string) {
    return await this.findServicioById.run(id);
  }
} 