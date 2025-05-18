import { Permission } from '@models/permission.model';

export interface PermissionRepository {
  save(permission: Permission): Promise<Permission>;

  findByCriteria(criteria?: Record<string, unknown>): Promise<Permission[]>;
}
