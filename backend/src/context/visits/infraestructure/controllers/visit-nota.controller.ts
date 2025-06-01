import { Controller, Post, Body, HttpStatus, Get, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { CreateVisitNota } from '../../application/create-nota/create.visit-nota';
import { CreateVisitNotaDTO } from '../dto/create.visit-nota.dto';
import { PermissionEnum } from '@enums/permissions';
import { ModulesEnum } from '@enums/modules';
import { ModuleName, Permissions } from '@decorators/index';

@ApiTags('Visit Notas')
@ApiBearerAuth()
@Controller('visits')
export class VisitNotaController {
  constructor(
    private readonly createVisitNota: CreateVisitNota,
  ) {}

  @Post('/notas')
  @Permissions(PermissionEnum.CREATE)
  @ModuleName(ModulesEnum.VISITS)
  @ApiOperation({ summary: 'Create a new visit nota aclaratoria' })
  @ApiResponse({ status: HttpStatus.CREATED, description: 'Visit nota created successfully' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Invalid input data' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Visit not found' })
  async create(@Body() createVisitNotaDto: CreateVisitNotaDTO) {
    try {
      const visitNota = await this.createVisitNota.execute(createVisitNotaDto);
      return {
        statusCode: HttpStatus.CREATED,
        message: 'Visit nota created successfully',
        data: visitNota,
      };
    } catch (error) {
      throw error;
    }
  }
} 