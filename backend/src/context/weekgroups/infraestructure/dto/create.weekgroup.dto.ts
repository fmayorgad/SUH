import {
    IsArray,
    IsEnum,
    IsNotEmpty,
    IsOptional,
    IsString,
    IsUUID,
    MaxLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateWeekgroupDto {
    @ApiProperty({
        description: 'The name of the week group',
        required: true,
        maxLength: 100,
    })
    @IsString()
    @IsNotEmpty()
    @MaxLength(100)
    name: string;

    @ApiProperty({
        description: 'Optional description of the week group',
        required: false,
        maxLength: 200,
    })
    @IsString()
    @IsOptional()
    @MaxLength(200)
    description?: string;

    @ApiProperty({
        description: 'The ID of the associated week',
        required: false,
    })
    id_week: string;

    @ApiProperty({
        description: 'The ID of the lead',
        required: true,
        format: 'uuid',
    })
    @IsUUID()
    @IsNotEmpty()
    lead: string;

    @ApiProperty({
        description: 'Optional list of associated week groups',
        required: false,
        type: [String],
        format: 'uuid',
    })
    @IsOptional()
    @IsArray()
    @IsNotEmpty({ each: true })
    @IsUUID('4', { each: true })
    weekgroupusers?: string[];

    @ApiProperty({
        description: 'Optional list of associated prestadores',
        required: false,
        type: [String],
        format: 'uuid',
    })
    @IsOptional()
    @IsArray()
    @IsNotEmpty({ each: true })
    @IsUUID('4', { each: true })
    weekgroupprestadores?: string[];
}
