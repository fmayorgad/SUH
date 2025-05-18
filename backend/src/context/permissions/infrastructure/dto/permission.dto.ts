import { IsEnum, IsNotEmpty, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

import { PermissionEnum } from '@enums/permissions';

export class PermissionDTO {
  @IsNotEmpty()
  @ApiProperty()
  readonly name: string;

  @IsOptional()
  @IsEnum(PermissionEnum)
  @ApiProperty({
    enum: PermissionEnum,
  })
  readonly action: PermissionEnum;
}
