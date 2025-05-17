import { Reflector } from '@nestjs/core';

import { type CanActivate, type ExecutionContext, Injectable, Inject } from '@nestjs/common';

import { ModulesEnum } from '@enums/modules';
import type { PermissionEnum } from '@enums/permissions';
import type { Payload } from '@models/payload.model';
import { GetModulesUSer } from '@context/auth/application';

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(
    @Inject(GetModulesUSer) private readonly getModulesUSer: GetModulesUSer,
    @Inject(Reflector) private readonly reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const allowUnauthorizedRequest: boolean = this.reflector.get<boolean>(
      'allowUnauthorizedRequest',
      context.getHandler(),
    );

    const currentPermissions: PermissionEnum[] = this.reflector.get<PermissionEnum[]>(
      'permissions',
      context.getHandler(),
    );

    const currentModule: ModulesEnum = this.reflector.get<ModulesEnum>('module', context.getHandler());

    const user: Payload = context.switchToHttp().getRequest().user;
    const userModules = await this.getModulesUSer.execute(user?.sub);

    if (!user) return allowUnauthorizedRequest;

    if (!userModules.profile.modules.length) return user.profile.name === ModulesEnum.ROOT;

    const currentUserModule = userModules.profile.modules.find((module) => module.enumName === currentModule);

    if (!currentUserModule) return false;

    const hasPermissions = currentPermissions.some((currentPermission) =>
      currentUserModule.permissions.map((permission) => permission.action).includes(currentPermission),
    );

    return currentUserModule && hasPermissions;
  }
}
