import { Inject, Injectable } from '@nestjs/common';

import { Permission } from '@models/permission.model';

import { PermissionRepository } from '../domain/permission-repository';

@Injectable()
export class GetPermissions {
  constructor(
    @Inject('PrRepository')
    private readonly repository: PermissionRepository,
  ) {}

  async execute(criteria?: Record<string, unknown>): Promise<Permission[]> {
    return await this.repository.findByCriteria(criteria);
  }
}
