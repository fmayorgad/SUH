import { SetMetadata } from '@nestjs/common';
import { PermissionEnum } from '@enums/permissions';

export const Permissions = (...permissions: PermissionEnum[]) =>
  SetMetadata('permissions', permissions);
