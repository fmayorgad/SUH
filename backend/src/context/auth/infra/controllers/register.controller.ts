import { Body, Controller, HttpCode, Post, UseInterceptors } from '@nestjs/common';
import { ApiConsumes, ApiTags } from '@nestjs/swagger';

import { AllowUnauthorizedRequest } from '@decorators/allow-unauthorized-request.decorator';
import { Metadata } from '@decorators/index';
import { UserAuthenticator } from '@context/auth/application/autenticate-user';
import { UserAuthDto } from '@context/auth/infra/dto/user-auth.dto';
import { AuditInterceptor } from 'src/core/infraestructure/interceptors/audit.interceptor';

@ApiTags('Auth')
@Controller('auth')
export class RegisterController {
  constructor(private readonly userAuthenticator: UserAuthenticator) {}

  @ApiConsumes('application/x-www-form-urlencoded', 'application/json')
  @Post('register')
  @HttpCode(200)
  @AllowUnauthorizedRequest()
  @Metadata('AUDIT', 'Registro de usuario')
  @UseInterceptors(AuditInterceptor)
  async execute(@Body() userDto: UserAuthDto): Promise<Record<string, string>> {
    const token = await this.userAuthenticator.execute(userDto.login, userDto.password);
    return token;
  }
}
