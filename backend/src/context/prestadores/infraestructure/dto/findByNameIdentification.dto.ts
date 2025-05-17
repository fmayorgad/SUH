import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

export class FindByNameIdentificationDTO{
  @ApiProperty({
    description: 'Texto a ser buscado en Nombre o Identificación del prestador o Código de Prestador',
    required: false,
  })
  @IsOptional()
  readonly text: string;

}
