import { Controller, HttpCode, HttpStatus, Get, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { ModuleName, Permissions } from '@decorators/index';
import { ModulesEnum } from '@enums/modules';
import { PermissionEnum } from '@enums/permissions';
import { FindByNameIdentification } from '../../application/findyByNameIdentification';

import { FindByNameIdentificationDTO } from '../dto/findByNameIdentification.dto';

@ApiTags('Prestadores')
@ApiBearerAuth()
@Controller('prestadores')
export class PrestadoresGetController {
  constructor(
    private readonly findByNameIdentification: FindByNameIdentification,
  ) {}

  @ApiConsumes('application/json')
  @Get()
  @HttpCode(HttpStatus.OK)
  @Permissions(PermissionEnum.READ)
  @ModuleName(ModulesEnum.PRESTADORES)
  async get(@Query() dto?: FindByNameIdentificationDTO) {

    const receips = await this.findByNameIdentification.execute(dto.text);

    return receips;
  }
}
