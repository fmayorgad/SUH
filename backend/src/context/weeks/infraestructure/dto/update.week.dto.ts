import {
    IsNotEmpty,
    IsString,
    IsDate,
    IsOptional,
    IsArray,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateWeekDto {
    @ApiProperty({
        description: 'The name of the week',
        required: true,
    })
    @IsNotEmpty()
    @IsString()
    name: string;

    @ApiProperty({
        description: 'The start date of the week',
        required: true,
        type: Date,
    })
    @IsNotEmpty()
    startDate: Date;

    @ApiProperty({
        description: 'The end date of the week',
        required: true,
        type: Date,
    })
    @IsNotEmpty()
    endDate: Date;

    @ApiProperty({
        description: 'Optional description of the week',
        required: false,
    })
    @IsOptional()
    @IsString()
    description?: string;
}
