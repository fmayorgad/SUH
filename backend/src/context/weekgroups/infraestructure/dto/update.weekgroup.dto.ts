import {
    IsNotEmpty,
    IsString,
    IsOptional,
    IsArray,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateWeekgroupDto {
    @ApiProperty({
        description: 'The name of the weekgroup',
        required: true,
    })
    @IsNotEmpty()
    @IsString()
    name: string;

    @ApiProperty({
        description: 'Optional description of the weekgroup',
        required: false,
    })
    @IsOptional()
    @IsString()
    description?: string;

    @ApiProperty({
        description: 'The lead user ID',
        required: true,
    })
    @IsNotEmpty()
    @IsString()
    lead: string;

    @ApiProperty({
        description: 'The state of the weekgroup',
        required: false,
    })
    @IsOptional()
    @IsString()
    state?: string;

    @ApiProperty({
        description: 'List of member user IDs',
        type: [String],
        required: false,
    })
    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    members?: string[];

    @ApiProperty({
        description: 'List of selected prestador IDs',
        type: [String],
        required: false,
    })
    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    selectedPrestadores?: string[];
} 