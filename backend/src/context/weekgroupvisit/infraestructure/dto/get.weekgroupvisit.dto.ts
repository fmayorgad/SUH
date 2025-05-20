import { IsEmail, IsEnum, IsNotEmpty, IsOptional, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { VisitTypesEnum } from '@enums/visit-types.enum';
import { WeekGroupsPrestadoresEnum } from '@enums/weekgroupsprestadores';

export class WeekgroupVisitGetDTO {
  @IsOptional()
  @ApiProperty({ required: false })
  @IsUUID(4)
  readonly id: string;

  @IsOptional()
  @ApiProperty({ required: false })
  readonly searchText: string;

  @IsOptional()
  @ApiProperty({ required: false })
  readonly weekgroupId: string;

  @IsOptional()
  @ApiProperty({ required: false })
  readonly leadId: string;

  @IsOptional()
  @ApiProperty({ required: false })
  readonly prestadorId: string;

  @IsOptional()
  @ApiProperty({ 
    required: false,
  })
  readonly startDate: string;

  @IsOptional() 
  @ApiProperty({ 
    required: false,
  })
  readonly endDate: string;

  @IsOptional()
  @IsEnum(VisitTypesEnum)
  @ApiProperty({
    required: false,
    enum: VisitTypesEnum,
    description: 'Type of visit (PROGRAMADA or CERTIFICACION)'
  })
  readonly visitType: VisitTypesEnum;

  @IsOptional()
  @IsEnum(WeekGroupsPrestadoresEnum)
  @ApiProperty({
    required: false,
    enum: WeekGroupsPrestadoresEnum,
    description: 'State of the visit process (PENDIENTE, AGENDADA, COMPLETADA)'
  })
  readonly visitState: WeekGroupsPrestadoresEnum;

  @IsOptional()
  @ApiProperty({
    required: false,
    description: 'User ID to filter results by (lead or member)'
  })
  userId?: string;
} 