import { Controller, Get, Query, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { GetServicios } from '../../application/get/get.servicio';
import { GetServicioDTO } from '../dto/get.servicio.dto';
import { Servicio } from '@models/servicio.model';
import { dataPaginationResponse } from '@models/app.model';
import { ModulesEnum } from '@enums/modules'; 
import { PermissionEnum } from '@enums/permissions'; 
import { ModuleName, Permissions } from '@decorators/index'; 

@ApiTags('Servicios') // Plural tag
@ApiBearerAuth()
@Controller('servicios') // Plural endpoint
export class GetServicioController {
  constructor(private readonly getServiciosService: GetServicios) {}

  @Get('/getAll')
  @HttpCode(HttpStatus.OK)
  @Permissions(PermissionEnum.READ) // Add permissions if needed
  @ModuleName(ModulesEnum.SERVICIOS) // Add SERVICIOS to enum if needed
  @ApiOperation({ summary: 'Get servicios based on filter criteria' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Servicios retrieved successfully',
    // type: PaginatedServicioResponseDTO, // Define a specific paginated response DTO if needed
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized',
  })
  async getServicios(
    @Query() filterDto: GetServicioDTO,
  ): Promise<Servicio[] | dataPaginationResponse> {
    return await this.getServiciosService.run(filterDto);
  }
} 