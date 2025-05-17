import { Reflector } from '@nestjs/core';
import {
  type ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';

import { AuthGuard } from '@nestjs/passport';

import {
  JsonWebTokenError,
  NotBeforeError,
  TokenExpiredError,
} from 'jsonwebtoken';

import type { Payload } from '@models/payload.model';
import type { PermissionEnum } from '@enums/permissions';
import type { Observable } from 'rxjs';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private readonly reflector: Reflector) {
    super();
  }

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const allowUnauthorizedRequest: boolean = this.reflector.get<boolean>(
      'allowUnauthorizedRequest',
      context.getHandler(),
    );

    const currentPermissions: PermissionEnum[] = this.reflector.get<
      PermissionEnum[]
    >('permissions', context.getHandler());

    const user: Payload = context.switchToHttp().getRequest().user;

    if (currentPermissions) return super.canActivate(context);

    if (!user) return allowUnauthorizedRequest;
  }

  handleRequest(
    err: any,
    user: any,
    info: any,
    context: ExecutionContext,
    status: any,
  ) {
    if (info instanceof JsonWebTokenError) {
      if (info instanceof TokenExpiredError) {
        throw new TokenExpiredError('jwt expired', info.expiredAt);
      }

      if (info instanceof NotBeforeError) {
        throw new UnauthorizedException('Token not active');
      }

      throw new UnauthorizedException('Invalid JWT');
    }

    return super.handleRequest(err, user, info, context, status);
  }
}
