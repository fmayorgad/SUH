import { Controller, Get, HttpCode, HttpStatus, Param, Res } from '@nestjs/common';
import { Response } from 'express';
import { FindByIdVisit } from '../../application/findbyid/findbyid.visit';
import { ApiTags, ApiOperation, ApiParam, ApiResponse, ApiBearerAuth, ApiConsumes } from '@nestjs/swagger';
import { PermissionEnum } from '@enums/permissions';
import { ModulesEnum } from '@enums/modules';
import { ModuleName, Permissions } from '@decorators/index'; // Adjust path if needed

@ApiTags('Visits')
@ApiBearerAuth()
@Controller('visits')
export class FindByIdVisitController {
  constructor(private readonly findByIdVisit: FindByIdVisit) {}
  
  @ApiConsumes('application/json')
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @Permissions(PermissionEnum.READ) // Add appropriate permissions
  @ModuleName(ModulesEnum.VISITS)
  @ApiOperation({ summary: 'Find a visit by ID with all related information' })
  @ApiParam({ name: 'id', description: 'Visit ID', type: 'string' })
  @ApiResponse({ status: HttpStatus.OK, description: 'The visit has been found' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Visit not found' })
  async findById(@Param('id') id: string, @Res() res: Response) {
    try {
      const visit = await this.findByIdVisit.execute(id);
      
      if (!visit) {
        return res.status(HttpStatus.NOT_FOUND).json({
          statusCode: HttpStatus.NOT_FOUND,
          message: 'Visit not found',
        });
      }

      return res.status(HttpStatus.OK).json({
        statusCode: HttpStatus.OK,
        data: visit,
      });
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: error.message,
      });
    }
  }
} 