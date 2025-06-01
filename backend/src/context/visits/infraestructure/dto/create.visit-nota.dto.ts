import { IsNotEmpty, IsString, IsEnum, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { NotaTypesEnum } from '@enums/nota-types.enum';

export class CreateVisitNotaDTO {
  @ApiProperty({
    description: 'Visit ID',
    example: '3757fc27-ea77-4251-985f-aac3d3fb0488'
  })
  @IsNotEmpty()
  @IsUUID()
  visitId: string;

  @ApiProperty({
    description: 'Name of the nota',
    example: 'Nota aclaratoria'
  })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({
    description: 'Acta number',
    example: '3242342'
  })
  @IsNotEmpty()
  @IsString()
  numeroActaInforme: string;

  @ApiProperty({
    description: 'Type of document',
    enum: NotaTypesEnum,
    example: NotaTypesEnum.INFORME
  })
  @IsNotEmpty()
  @IsEnum(NotaTypesEnum)
  tipoDocumento: NotaTypesEnum;

  @ApiProperty({
    description: 'Content of the nota (rich text)',
    example: '<p><span style="color: rgb(240, 102, 102);">Esta mal escrito todo</span></p>'
  })
  @IsNotEmpty()
  @IsString()
  contenido: string;

  @ApiProperty({
    description: 'Justification for the nota',
    example: 'quedo mala'
  })
  @IsNotEmpty()
  @IsString()
  justification: string;
} 