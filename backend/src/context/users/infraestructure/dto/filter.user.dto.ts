import { IsOptional, IsString, IsUUID, IsEnum, IsNumber, Min, IsInt } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { generalStateTypes } from '@enums/general-state-type';
import { Type } from 'class-transformer';

export class FilterUsersDto {
    @ApiProperty({
        description: 'Search text to filter by name, email, lastname or surname',
        required: false,
        example: 'john',
    })
    @IsOptional()
    @IsString()
    searchText?: string;

    @ApiProperty({
        description: 'Profile ID to filter users',
        required: false,
        example: '123e4567-e89b-12d3-a456-426614174000',
    })
    @IsOptional()
    @IsUUID()
    profileId?: string;

    @ApiProperty({
        description: 'State to filter users',
        required: false,
        enum: generalStateTypes,
        example: generalStateTypes.ACTIVO,
    })
    @IsOptional()
    @IsEnum(generalStateTypes)
    state?: generalStateTypes;

    @ApiProperty({
        description: 'Number of records to skip (for pagination)',
        required: false,
        example: 0,
    })
    @IsOptional()
    @IsInt()
    @Min(0)
    @Type(() => Number)
    skip?: number;

    @ApiProperty({
        description: 'Number of records to take (for pagination)',
        required: false,
        example: 10,
    })
    @IsOptional()
    @IsInt()
    @Min(1)
    @Type(() => Number)
    take?: number;
} 