import { IsOptional, IsString, IsUUID, IsEnum, IsInt } from 'class-validator';
import { Type } from 'class-transformer';
import { VisitStatesEnum } from '@enums/visit-states.enum';
import { VisitGeneralStatesEnum } from '@enums/visit-general-states.enum';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class GetVisitDTO {
  @ApiPropertyOptional({
    description: 'Filter by Weekgroup Visit ID',
    format: 'uuid',
  })
  @IsOptional()
  @IsUUID(4)
  weekgroupVisitId?: string;

  @ApiPropertyOptional({
    description: 'Filter by General Visit State',
    enum: VisitGeneralStatesEnum,
  })
  @IsOptional()
  @IsEnum(VisitGeneralStatesEnum)
  generalState?: VisitGeneralStatesEnum;

  @ApiPropertyOptional({
    description: 'Filter by Specific Visit State',
    enum: VisitStatesEnum,
  })
  @IsOptional()
  @IsEnum(VisitStatesEnum)
  specificState?: VisitStatesEnum;

  @ApiPropertyOptional({
    description: 'Number of records to skip for pagination',
    type: Number,
    default: 0,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  skip?: number;

  @ApiPropertyOptional({
    description: 'Number of records to take for pagination',
    type: Number,
    default: 10,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  take?: number;

  @ApiPropertyOptional({
    description: 'Search text',
  })
  @IsOptional() 
  searchText?: string;

  @ApiPropertyOptional({
    description: 'Filter by lead IDs',
    type: [String],
    required: false,
  })
  @IsOptional()
  readonly lead?: string[];

  @ApiPropertyOptional({
    description: 'Filter by verificadores IDs',
    type: [String],
    required: false,
  })
  @IsOptional()
  readonly verificadores?: string[];

  // Add other filter properties as needed
  
} 