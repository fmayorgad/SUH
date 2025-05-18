import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsUUID } from 'class-validator';

export class ProfileDTO {
  // @IsUUID(4)
  // readonly id: string;

  @IsNotEmpty()
  @ApiProperty()
  name: string;
}
