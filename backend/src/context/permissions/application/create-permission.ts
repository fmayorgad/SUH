import { Inject, Injectable } from '@nestjs/common';

import { Permission } from '@models/permission.model';

import { PermissionRepository } from '../domain/permission-repository';
import { PermissionEnum } from '@enums/permissions';

@Injectable()
export class CreatePermission {
  constructor(
    @Inject('PrRepository')
    private readonly repository: PermissionRepository,
  ) {}

  async execute(name: string, action: PermissionEnum): Promise<Permission> {
    const permission = new Permission();
    permission.name = name;
    permission.action = action;

    return await this.repository.save(permission);
  }
}
