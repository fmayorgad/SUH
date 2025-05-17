import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class FindByIdWeekgroupDto {
    @ApiProperty({
        description: 'The ID of the weekgroup',
        required: true,
    })
    @IsNotEmpty()
    @IsString()
    id: string;
} 