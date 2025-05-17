import { IsJWT } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class TokenDto {
  @IsJWT()
  @ApiProperty()
  token: string;
}
