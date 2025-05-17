import { Controller, Get, Query, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiConsumes } from '@nestjs/swagger';
import { GetVisits } from '../../application/get/get.visit';
import { GetVisitDTO } from '../dto/get.visit.dto';
import { Visit } from '@models/visit.model';
import { dataPaginationResponse } from '@models/app.model';
import { ModulesEnum } from '@enums/modules'; // Adjust path if needed
import { PermissionEnum } from '@enums/permissions'; // Adjust path if needed
import { ModuleName, Permissions } from '@decorators/index'; // Adjust path if needed

@ApiTags('Visits')
@ApiBearerAuth()
@Controller('visits')
export class GetVisitController {
  constructor(private readonly getVisitsService: GetVisits) {}

  @ApiConsumes('application/json')
  @Get()
  @HttpCode(HttpStatus.OK)
  @Permissions(PermissionEnum.READ) // Add appropriate permissions
  @ModuleName(ModulesEnum.VISITS) // Create VISITS in ModulesEnum if needed
  @ApiOperation({ summary: 'Get visits based on filter criteria' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Visits retrieved successfully',
    // You might need a specific response DTO for pagination
    // type: [Visit], or a pagination response DTO
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized',
  })
  async getVisits(
    @Query() filterDto: GetVisitDTO,
  ): Promise<Visit[] | dataPaginationResponse> {
    return await this.getVisitsService.run(filterDto);
  }
} 