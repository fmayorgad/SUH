import { Body, Controller, HttpCode, Post, UseInterceptors } from '@nestjs/common';
import { ApiConsumes, ApiTags } from '@nestjs/swagger';

import { AllowUnauthorizedRequest } from '@decorators/allow-unauthorized-request.decorator';
import { Metadata } from '@decorators/index';
import { RefreshToken } from '@context/auth/application/refresh-token';
import { TokenDto } from '@context/auth/infra/dto/token.dto';
import { AuditInterceptor } from 'src/core/infraestructure/interceptors/audit.interceptor';

@ApiTags('Auth')
@Controller('auth')
export class RefreshTokenController {
  constructor(private readonly refreshToken: RefreshToken) { }

  @ApiConsumes('application/x-www-form-urlencoded', 'application/json')
  @Post('refresh-token')
  @HttpCode(200)
  @AllowUnauthorizedRequest()
  @Metadata('AUDIT', 'Actualización de token')
  @UseInterceptors(AuditInterceptor)
  async execute(@Body() tokenDto: TokenDto): Promise<Record<string, string>> {
    const token = await this.refreshToken.execute(tokenDto.token);

    return { token };
  }
}
