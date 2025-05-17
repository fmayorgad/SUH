import { IsOptional, IsString, IsUUID, IsEnum, IsInt } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class GetServicioDTO {
  @ApiPropertyOptional({ description: 'Search by name or code' })
  @IsOptional()
  @IsString()
  searchText?: string;

  @ApiPropertyOptional({ description: 'Filter by Group Servicio ID', format: 'uuid' })
  @IsOptional()
  @IsUUID(4)
  grupoServicioId?: string;

  // Add other relevant filters like state, complexity, etc.

  @ApiPropertyOptional({ description: 'Number of records to skip', type: Number, default: 0 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  skip?: number = 0;

  @ApiPropertyOptional({ description: 'Number of records to take', type: Number, default: 10 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  take?: number = 10;
} 