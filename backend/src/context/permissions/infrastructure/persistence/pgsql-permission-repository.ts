import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Permission } from '@models/permission.model';

import { PermissionRepository } from '@context/permissions/domain/permission-repository';

export class PgsqlPermissionRepository implements PermissionRepository {
  constructor(
    @InjectRepository(Permission)
    private readonly repository: Repository<Permission>,
  ) {}

  findByCriteria(criteria?: Record<string, unknown>): Promise<Permission[]> {
    return this.repository.find(criteria);
  }

  save(permission: Permission): Promise<Permission> {
    return this.repository.save(permission);
  }
}
