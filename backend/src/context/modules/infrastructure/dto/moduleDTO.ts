import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty } from 'class-validator';

import { ModulesEnum } from '@enums/modules';

export class ModuleDTO {
  @IsNotEmpty()
  @ApiProperty()
  name: string;

  @IsNotEmpty()
  @ApiProperty()
  description: string;

  @IsEnum(ModulesEnum)
  @ApiProperty({
    enum: ModulesEnum,
  })
  readonly enum: ModulesEnum;
}
