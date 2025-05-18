import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';

export class AssociationRoleModulePermissionDTO {
  @ApiProperty({ example: 'f687f4d2-1d44-45cc-81dc-44efbd5723a2' })
  @IsUUID(4)
  profileId: string;

  @ApiProperty({ example: 'fc25696f-9b29-41a8-8560-ffb21a51a3cb' })
  @IsUUID(4)
  moduleId: string;

  @ApiProperty({ example: 'f687f4d2-1d44-45cc-81dc-44efbd5723a2' })
  @IsUUID(4)
  permissionId: string;
}
