import { IsNotEmpty, IsOptional, IsUUID, IsDate, IsString, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { VisitTypesEnum } from '@enums/visit-types.enum';
import { WeekGroupsPrestadoresEnum } from '@enums/weekgroupsprestadores';

export class CreateWeekgroupVisitDTO {
  @IsOptional()
  @ApiProperty({
    description: 'Description of the visit',
    example: 'Routine visit to check compliance',
    required: false,
  })
  readonly description: string;

  @IsNotEmpty()
  @ApiProperty({
    description: 'State of the visit',
    example: 'active',
  })
  readonly state: string;

  @IsNotEmpty()
  @ApiProperty({
    description: 'Date of the visit',
    example: '2023-10-15T10:00:00Z',
  })
  @Type(() => Date)
  readonly visitDate: Date;

  @IsNotEmpty()
  @IsEnum(VisitTypesEnum)
  @ApiProperty({
    description: 'Type of visit',
    enum: VisitTypesEnum,
    example: VisitTypesEnum.PROGRAMACION,
  })
  readonly visitType: VisitTypesEnum;

  @IsOptional()
  @IsEnum(WeekGroupsPrestadoresEnum)
  @ApiProperty({
    description: 'State of the visit process',
    enum: WeekGroupsPrestadoresEnum,
    example: WeekGroupsPrestadoresEnum.PENDIENTE,
    required: false,
  })
  readonly visitState?: WeekGroupsPrestadoresEnum;

  @IsNotEmpty()
  @IsUUID(4)
  @ApiProperty({
    description: 'ID of the weekgroup',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  readonly weekgroup: string;

  @IsOptional()
  @IsUUID(4)
  @ApiProperty({
    description: 'ID of the lead',
    example: '123e4567-e89b-12d3-a456-426614174000',
    required: false,
  })
  readonly lead: string;

  @IsOptional()
  @IsUUID(4)
  @ApiProperty({
    description: 'ID of the prestador',
    example: '123e4567-e89b-12d3-a456-426614174000',
    required: false,
  })
  readonly prestador: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    description: 'Notes about the visit',
    example: 'Bring all documentation for review',
    required: false,
  })
  readonly notes: string;
} 