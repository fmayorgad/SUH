import { Body, Controller, HttpCode, HttpStatus, Post, UseInterceptors } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiConsumes,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { CreateUserDto } from '../dto/create.user.dto';
import { ModuleName, Permissions, Metadata } from '@decorators/index';
import { PermissionEnum } from '@enums/permissions';
import { ModulesEnum } from '@enums/modules';
import { AuditInterceptor } from 'src/core/infraestructure/interceptors/audit.interceptor';

// Application
import { CreateUser } from '../../application/create/create.user';
import { Users } from '@models/user.model';

@ApiTags('Users')
@ApiBearerAuth()
@Controller('users')
export class PostUsersController {
  constructor(private readonly createUserService: CreateUser) {}

  @Post('create')
  @Permissions(PermissionEnum.CREATE)
  @ModuleName(ModulesEnum.USERS)
  @ApiConsumes('application/x-www-form-urlencoded', 'application/json')
  @ApiOperation({
    summary: 'Create User',
    description:
      'Creates a new user in the system with the specified information',
  })
  @Metadata('AUDIT', 'Creación de usuario')
  @UseInterceptors(AuditInterceptor)
  async createUser(@Body() createUserDto: CreateUserDto): Promise<Users> {
    return await this.createUserService.create(createUserDto);
  }
} 