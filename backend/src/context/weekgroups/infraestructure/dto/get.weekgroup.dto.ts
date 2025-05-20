import { IsEmail, IsEnum, IsNotEmpty, IsOptional, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class WeekgroupGetDTO {
  @IsOptional()
  @ApiProperty({ required: false })
  @IsUUID(4)
  readonly id: string;

  @IsOptional()
  @ApiProperty({ required: false })
  readonly searchText: string;

  @IsOptional()
  @ApiProperty({ required: false })
  readonly lead: string[];

  @IsOptional()
  @ApiProperty({ required: false })
  readonly verificadores: string[];

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
  @ApiProperty({ 
    required: false,
    description: 'User ID to filter results by (lead or member)'
  })
  userId?: string;
}
