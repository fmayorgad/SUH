import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsUUID } from 'class-validator';

export class GetAssociationDTO {
  @ApiProperty({
    description: 'id perfil',
    required: false
  })
  @IsOptional()
  @IsUUID(4)
  readonly profile: string;

  @ApiProperty({
    description: 'id profile',
    required: false
  })
  @IsOptional()
  @IsUUID(4)
  readonly module: string;

  @ApiProperty({
    description: 'id permiso',
    required: false
  })
  @IsOptional()
  @IsUUID(4)
  readonly permission: string;
}