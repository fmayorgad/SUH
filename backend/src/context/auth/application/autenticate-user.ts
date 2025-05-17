import { Inject, Injectable, Logger } from '@nestjs/common';

import { Users as User } from '@models/user.model';

import { OAuthService } from '@context/o-auth/domain/o-auth-service';
import type { Menu, Payload } from '@models/payload.model';

import { AuthRepository } from '@context/auth/domain/auth-repository';
import { IncorrectUserOrPasswordException } from '@context/auth/domain/exceptions/incorrect-user-password.exception';

@Injectable()
export class UserAuthenticator {
  constructor(
    @Inject('AuthRepository') private readonly repository: AuthRepository,
    @Inject('OAuthService') private readonly service: OAuthService,
  ) {}

  async execute(
    login: string,
    password: string,
  ): Promise<Record<string, string>> {
    const user = await this.repository.searchUser(login);
    let userModulesData = await this.repository.searchUserModules(user?.id);

    if (!user) throw new IncorrectUserOrPasswordException();

    if (!(await User.checkPassword(user.password, password))) {
      throw new IncorrectUserOrPasswordException();
    }

    userModulesData = await this.filterMenu(userModulesData);
    const menu = this.organizeMenuUser(userModulesData);
    userModulesData.profile.modules = menu;

    const userPayload = this.service.signJwt(this.payload(user));
    const userModules = JSON.stringify(this.payloadModules(userModulesData));

    return { token: userPayload, userModules };
  }

  private getSubmodules(father, modules: any[]) {
    const submodules = modules.filter((item) => item?.father === father);
    return submodules;
  }

  private organizeMenuUser(user: User) {
    const modules = [];
    for (const key in user?.profile?.modules) {
      const element = user?.profile?.modules[key];
      if (element.father === null) {
        modules.push({
          ...element,
          subModules: this.getSubmodules(
            element?.id,
            user?.profile?.modules,
          ),
        });
      }
    }
    return modules;
  }

  private async filterMenu(user: User) {
    for (const key in user.profile.modules) {
      const arrayPermission = [];
      if (Object.prototype.hasOwnProperty.call(user.profile.modules, key)) {
        const modules = user.profile.modules[key];
        for (const key in modules.permissions) {
          if (Object.prototype.hasOwnProperty.call(modules.permissions, key)) {
            const permission = modules.permissions[key];
            const tieneElPermiso = await this.repository.searchUserMenu(
              modules.id,
              user.profile.id,
              permission.id,
            );
            if (tieneElPermiso === true) {
              arrayPermission.push(permission);
            }
          }
        }
        modules.permissions = arrayPermission;
      }
    }
    return user;
  }

  private payload(user: User): Payload {
    return <Payload>{
      sub: user.id,
      username: user.username,
      app_origin: 'IVC_VISITAS',
      profile: {
        name: user.profile.name,
      },
      name: user.name,
      lastname: user.lastname,
      surname: user.surname,
    };
  }

  private payloadModules(user: User): Menu {
    return <Menu>{
      modules: user.profile.modules.map((module) => ({
        name: module.enumName,
        realName: module.name,
        permissions: module.permissions.map((permission) => ({
          action: permission.action,
        })),
        subModules: module['subModules']?.map((sub) => ({
          name: sub.enumName,
          realName: sub.name,
          permissions: sub.permissions.map((permission) => ({
            action: permission.action,
          })),
        })),
      })),
    };
  }
}
