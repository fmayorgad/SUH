import { Body, Controller, HttpCode, HttpStatus, Param, Put, UseInterceptors } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiConsumes,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { UpdateUserDto } from '../dto/update.user.dto';
import { ModuleName, Permissions, Metadata } from '@decorators/index';
import { PermissionEnum } from '@enums/permissions';
import { ModulesEnum } from '@enums/modules';
import { AuditInterceptor } from 'src/core/infraestructure/interceptors/audit.interceptor';

// Application
import { UpdateUser } from '../../application/update/update.user';
import { Users } from '@models/user.model';

@ApiTags('Users')
@ApiBearerAuth()
@Controller('users')
export class PutUsersController {
  constructor(private readonly updateUserService: UpdateUser) {}

  @Put(':id')
  @Permissions(PermissionEnum.UPDATE)
  @ModuleName(ModulesEnum.USERS)
  @ApiConsumes('application/x-www-form-urlencoded', 'application/json')
  @ApiOperation({
    summary: 'Update User',
    description:
      'Updates an existing user in the system with the specified information',
  })
  @Metadata('AUDIT', 'Actualización de usuario')
  @UseInterceptors(AuditInterceptor)
  async updateUser(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<Users> {
    return await this.updateUserService.update(id, updateUserDto);
  }
} 