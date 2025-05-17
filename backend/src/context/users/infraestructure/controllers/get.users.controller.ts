import { Controller, HttpCode, HttpStatus, Get, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiConsumes, ApiTags, ApiOperation } from '@nestjs/swagger';
import { ModuleName, Permissions } from '@decorators/index';
import { ModulesEnum } from '@enums/modules';
import { PermissionEnum } from '@enums/permissions';
import { GetAllUsers } from '../../application/getAll';
import { FilterUsersDto } from '../dto/filter.user.dto';
import { dataPaginationResponse } from '@models/app.model';
import { Users } from '@models/user.model';

@ApiTags('Users')
@ApiBearerAuth()
@Controller('users')
export class UsersGetController {
    constructor(
        private readonly getAllUsersService: GetAllUsers,
    ) {}

    @ApiConsumes('application/json')
    @Get('verificadores')
    @HttpCode(HttpStatus.OK)
    @Permissions(PermissionEnum.READ)
    @ModuleName(ModulesEnum.USERS)
    async getVerificadores() {
        const users = await this.getAllUsersService.execute({ profile: 'VERIFICADOR', active: true });
        return users;
    }

    @ApiConsumes('application/json')
    @Get()
    @HttpCode(HttpStatus.OK)
    @Permissions(PermissionEnum.READ)
    @ModuleName(ModulesEnum.USERS)
    @ApiOperation({
        summary: 'Get all users with optional filters',
        description: 'Get all users with optional filtering and pagination',
    })
    async getFilteredUsers(@Query() filter: FilterUsersDto): Promise<Users[] | dataPaginationResponse> {
        return await this.getAllUsersService.execute(filter);
    }
}