import { Controller, Get, Query } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiConsumes,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { ModuleName, Permissions } from '@decorators/index';
import { PermissionEnum } from '@enums/permissions';
import { ModulesEnum } from '@enums/modules';
import { GetWeeks } from '../../application/get/get.week';
import { FindByIdWeek } from '../../application/findById/findbyId.week';
import { Week } from '@models/week.model';
import { WeekGetDTO } from '../dto/get.dto';
import { dataPaginationResponse } from '@models/app.model';

// Application

@ApiTags('Weeks')
@ApiBearerAuth()
@Controller('weeks')
export class GetWeeksController {
  constructor(
    private readonly getWeeksService: GetWeeks,
    private readonly findByIdService: FindByIdWeek,
  ) {}

  @Get('/all')
  @Permissions(PermissionEnum.READ)
  @ModuleName(ModulesEnum.WEEKS)
  @ApiOperation({
    summary: 'Obtener Semanas',
    description: 'Obtiene todas las semanas registradas en el sistema',
  })
  async getWeeks(
    @Query() filter: WeekGetDTO,
  ): Promise<Week[] | dataPaginationResponse> {
    const weeks = await this.getWeeksService.getWeeks(filter);
    return weeks;
  }

  //find by givend id qry param
  @Get('/findById')
  @Permissions(PermissionEnum.READ)
  @ModuleName(ModulesEnum.WEEKS)
  @ApiOperation({
    summary: 'Obtener Semana por ID',
    description: 'Obtiene una semana por su ID',
  })
  async getWeekById(@Query('id') id: string): Promise<Week | null> {
    const week = await this.findByIdService.findById(id);
    return week;
  }
}
