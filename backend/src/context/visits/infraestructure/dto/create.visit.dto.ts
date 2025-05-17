import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsUUID, IsOptional, IsEnum, IsDateString, IsString, IsArray } from 'class-validator';
import { VisitStatesEnum } from '@enums/visit-states.enum';
import { generalStateTypes } from '@enums/general-state-type';

export class CreateVisitDTO {
  @ApiPropertyOptional({
    description: 'Start date and time of the visit',
    type: Date,
  })
  @IsOptional()
  @IsDateString()
  start?: Date;

  @ApiPropertyOptional({
    description: 'End date and time of the visit',
    type: Date,
  })
  @IsOptional()
  @IsDateString()
  end?: Date;

  @ApiPropertyOptional({
    description: 'Date of the visit',
    type: Date,
  })
  @IsOptional()
  @IsDateString()
  visitDate?: Date;

  @ApiPropertyOptional({
    description: 'Associated weekgroup visit ID',
    type: String,
    format: 'uuid',
  })
  @IsOptional()
  @IsUUID(4)
  weekgroupVisitId?: string;

  @ApiPropertyOptional({
    description: 'Associated prestador ID',
    type: String,
    format: 'uuid',
  })
  @IsOptional()
  @IsUUID(4)
  prestadorId?: string;

  @ApiPropertyOptional({
    description: 'Associated fiscal year ID',
    type: String,
    format: 'uuid',
  })
  @IsOptional()
  @IsUUID(4)
  fiscalYearId?: string;

  @ApiPropertyOptional({
    description: 'SADE identifier',
    type: String,
    maxLength: 20,
  })
  @IsOptional()
  @IsString()
  sade?: string;

  @ApiPropertyOptional({
    description: 'Excel file with servicios data',
    type: 'string',
    format: 'binary',
  })
  @IsOptional()
  serviciosFile?: any;

  @ApiPropertyOptional({
    description: 'Excel file with capacidad data',
    type: 'string',
    format: 'binary',
  })
  @IsOptional()
  capacidadFile?: any;

  @ApiPropertyOptional({
    description: 'TH verificadores array of UUIDs',
    type: [String],
  })
  @IsOptional()
  @IsArray()
  th_verificadores?: string[];

  @ApiPropertyOptional({
    description: 'TH todos',
    type: String,
  })
  @IsOptional()
  @IsString()
  th_todos?: string;

  @ApiPropertyOptional({
    description: 'TH propios',
    type: String,
  })
  @IsOptional()
  @IsString()
  th_propios?: string;

  @ApiPropertyOptional({
    description: 'Infra verificadores array of UUIDs',
    type: [String],
  })
  @IsOptional()
  @IsArray()
  infra_verificadores?: string[];

  @ApiPropertyOptional({
    description: 'Infra todos',
    type: String,
  })
  @IsOptional()
  @IsString()
  infra_todos?: string;

  @ApiPropertyOptional({
    description: 'Infra propios',
    type: String,
  })
  @IsOptional()
  @IsString()
  infra_propios?: string;

  @ApiPropertyOptional({
    description: 'Dotacion verificadores array of UUIDs',
    type: [String],
  })
  @IsOptional()
  @IsArray()
  dotacion_verificadores?: string[];

  @ApiPropertyOptional({
    description: 'Dotacion todos',
    type: String,
  })
  @IsOptional()
  @IsString()
  dotacion_todos?: string;

  @ApiPropertyOptional({
    description: 'Dotacion propios',
    type: String,
  })
  @IsOptional()
  @IsString()
  dotacion_propios?: string;

  @ApiPropertyOptional({
    description: 'MDI verificadores array of UUIDs',
    type: [String],
  })
  @IsOptional()
  @IsArray()
  mdi_verificadores?: string[];

  @ApiPropertyOptional({
    description: 'MDI todos',
    type: String,
  })
  @IsOptional()
  @IsString()
  mdi_todos?: string;

  @ApiPropertyOptional({
    description: 'MDI propios',
    type: String,
  })
  @IsOptional()
  @IsString()
  mdi_propios?: string;

  @ApiPropertyOptional({
    description: 'Procedimientos verificadores array of UUIDs',
    type: [String],
  })
  @IsOptional()
  @IsArray()
  procedimientos_verificadores?: string[];

  @ApiPropertyOptional({
    description: 'Procedimientos todos',
    type: String,
  })
  @IsOptional()
  @IsString()
  procedimientos_todos?: string;

  @ApiPropertyOptional({
    description: 'Procedimientos propios',
    type: String,
  })
  @IsOptional()
  @IsString()
  procedimientos_propios?: string;

  @ApiPropertyOptional({
    description: 'HCR verificadores array of UUIDs',
    type: [String],
  })
  @IsOptional()
  @IsArray()
  hcr_verificadores?: string[];

  @ApiPropertyOptional({
    description: 'HCR todos',
    type: String,
  })
  @IsOptional()
  @IsString()
  hcr_todos?: string;

  @ApiPropertyOptional({
    description: 'HCR propios',
    type: String,
  })
  @IsOptional()
  @IsString()
  hcr_propios?: string;

  @ApiPropertyOptional({
    description: 'Interdependencias verificadores array of UUIDs',
    type: [String],
  })
  @IsOptional()
  @IsArray()
  interdependencias_verificadores?: string[];

  @ApiPropertyOptional({
    description: 'Interdependencias todos',
    type: String,
  })
  @IsOptional()
  @IsString()
  interdependencias_todos?: string;

  @ApiPropertyOptional({
    description: 'Interdependencias propios',
    type: String,
  })
  @IsOptional()
  @IsString()
  interdependencias_propios?: string;

  @ApiPropertyOptional({
    description: 'Array of verificadores user IDs',
    type: [String],
  })
  @IsOptional()
  @IsArray()
  members?: string[];

  @ApiPropertyOptional({
    description: 'Array of servicios user IDs',
    type: [String],
  })
  @IsOptional()
  @IsArray()
  servicios?: string[];
} 