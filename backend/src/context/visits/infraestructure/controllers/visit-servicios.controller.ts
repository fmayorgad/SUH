import { Body, Controller, Delete, Get, Inject, Param, Post, Put } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { VisitServiciosDto } from '../dto/visit-servicios.dto';
import { PgsqlVisitServiciosRepository } from '../persistence/pgsql.visit_servicios.repository';
import { VisitServicios } from '@models/visit_servicios.model';

@ApiTags('visit-servicios')
@Controller('visit-servicios')
export class VisitServiciosController {
  constructor(
    @Inject('PgsqlVisitServiciosRepository')
    private readonly visitServiciosRepository: PgsqlVisitServiciosRepository,
  ) {}

  @Get('visit/:visitId')
  @ApiOperation({ summary: 'Get all servicios for a visit' })
  @ApiParam({ name: 'visitId', type: String })
  @ApiResponse({ status: 200, description: 'Return all servicios for a visit' })
  async findByVisitId(@Param('visitId') visitId: string): Promise<VisitServicios[]> {
    return this.visitServiciosRepository.findByVisitId(visitId);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new visit-servicio relation' })
  @ApiResponse({ status: 201, description: 'The visit-servicio has been created successfully' })
  async create(@Body() visitServiciosDto: VisitServiciosDto): Promise<VisitServicios> {
    const visitServicio = new VisitServicios();
    visitServicio.visit_id = { id: visitServiciosDto.visit_id } as any;
    visitServicio.servicio_id = { id: visitServiciosDto.servicio_id } as any; 
    visitServicio.state = visitServiciosDto.state;
    
    return this.visitServiciosRepository.create(visitServicio);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a visit-servicio relation' })
  @ApiParam({ name: 'id', type: String })
  @ApiResponse({ status: 200, description: 'The visit-servicio has been updated successfully' })
  async update(@Param('id') id: string, @Body() visitServiciosDto: VisitServiciosDto): Promise<VisitServicios> {
    const visitServicio = new VisitServicios();
    visitServicio.id = id;
    visitServicio.visit_id = { id: visitServiciosDto.visit_id } as any;
    visitServicio.servicio_id = { id: visitServiciosDto.servicio_id } as any; 
    visitServicio.state = visitServiciosDto.state;
    
    return this.visitServiciosRepository.update(visitServicio);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a visit-servicio relation' })
  @ApiParam({ name: 'id', type: String })
  @ApiResponse({ status: 200, description: 'The visit-servicio has been deleted successfully' })
  async delete(@Param('id') id: string): Promise<void> {
    return this.visitServiciosRepository.delete(id);
  }
} 