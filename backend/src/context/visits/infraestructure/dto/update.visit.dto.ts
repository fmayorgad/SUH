import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsOptional, IsString, IsBoolean } from 'class-validator';

export class UpdateVisitDto {
  @ApiProperty({
    description: 'SADE number for the visit',
    required: false,
    example: 'SADE-123-2023',
  })
  @IsOptional()
  @IsString()
  sade?: string;

  @ApiProperty({
    description: 'Legal representative name',
    required: false,
    example: 'Juan Pérez',
  })
  @IsOptional()
  @IsString()
  nombre_representante_legal?: string;

  @ApiProperty({
    description: 'Identification number',
    required: false,
    example: '12345678901',
  })
  @IsOptional()
  @IsString()
  identification?: string;

  @ApiProperty({
    description: 'Email',
    required: false,
    example: 'juan.perez@example.com',
  })
  @IsOptional()
  @IsString()
  correoRepresentante?: string;

  @ApiProperty({
    description: 'Visit date',
    required: false,
    example: '2023-07-15',
  })
  @IsOptional()
  @IsDateString()
  visit_date?: string;

  @ApiProperty({
    description: 'Whether notification has been sent to prestador',
    required: false,
    default: false,
  })
  @IsOptional()
  @IsBoolean()
  notification_sended?: boolean;
} 