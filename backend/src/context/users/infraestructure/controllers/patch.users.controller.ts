import { Body, Controller, HttpCode, HttpStatus, Param, Patch, UseInterceptors } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiConsumes,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { ChangeStateUserDto } from '../dto/change-state.user.dto';
import { ModuleName, Permissions, Metadata } from '@decorators/index';
import { PermissionEnum } from '@enums/permissions';
import { ModulesEnum } from '@enums/modules';
import { AuditInterceptor } from 'src/core/infraestructure/interceptors/audit.interceptor';

// Application
import { ChangeStateUser } from '../../application/change-state/change-state.user';
import { Users } from '@models/user.model';

@ApiTags('Users')
@ApiBearerAuth()
@Controller('users')
export class PatchUsersController {
  constructor(private readonly changeStateUserService: ChangeStateUser) {}

  @Patch(':id/state')
  @Permissions(PermissionEnum.UPDATE)
  @ModuleName(ModulesEnum.USERS)
  @ApiConsumes('application/x-www-form-urlencoded', 'application/json')
  @ApiOperation({
    summary: 'Change User State',
    description:
      'Changes the state of an existing user (activate/deactivate)',
  })
  @Metadata('AUDIT', 'Cambio de estado de usuario')
  @UseInterceptors(AuditInterceptor)
  async changeUserState(
    @Param('id') id: string,
    @Body() changeStateUserDto: ChangeStateUserDto,
  ): Promise<Users> {
    return await this.changeStateUserService.changeState(id, changeStateUserDto.state);
  }
} 