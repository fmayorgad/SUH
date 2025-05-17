import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsEnum, IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';
import { generalStateTypes } from '@enums/general-state-type';

export class VisitServiciosDto {
  @ApiProperty({ description: 'ID of the visit', type: String })
  @IsUUID('4')
  @IsNotEmpty()
  visit_id: string;

  @ApiProperty({ description: 'ID of the servicio', type: String })
  @IsUUID('4')
  @IsNotEmpty()
  servicio_id: string;

  @ApiProperty({ description: 'Notes for the servicio', type: String, required: false })
  @IsString()
  @IsOptional()
  notes?: string;

  @ApiProperty({ description: 'Indicates if the servicio was found during the visit', type: Boolean, required: false })
  @IsBoolean()
  @IsOptional()
  encontrado?: boolean;

  @ApiProperty({ description: 'State of the visit-servicio', enum: generalStateTypes })
  @IsEnum(generalStateTypes)
  @IsOptional()
  state: generalStateTypes = generalStateTypes.ACTIVO;
} 