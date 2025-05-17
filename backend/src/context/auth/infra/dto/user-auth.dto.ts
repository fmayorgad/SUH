import { IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UserAuthDto {
  @IsNotEmpty()
  @ApiProperty({
    description: 'El login del usuario puede ser: la identificación, El correo electrónico o el número de celular.]',
    required: false,
  })
  login: string;

  @IsNotEmpty()
  @ApiProperty({
    type: 'string',
    format: 'password',
    description: 'Contraseña del usuario',
  })
  password: string;
}
