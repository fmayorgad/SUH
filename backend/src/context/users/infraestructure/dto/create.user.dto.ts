import {
    IsNotEmpty,
    IsString,
    IsEmail,
    IsOptional,
    IsEnum,
    IsDate,
    IsUUID,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { genderTypes } from '@enums/genders';
import { StatusStatesEnum } from '@enums/status-states.enum';
import { Type } from 'class-transformer';

export class CreateUserDto {
    @ApiProperty({
        description: 'First name of the user',
        required: true,
    })
    @IsNotEmpty()
    @IsString()
    name: string;

    @ApiProperty({
        description: 'Middle name of the user',
        required: false,
    })
    @IsOptional()
    @IsString()
    surname?: string;

    @ApiProperty({
        description: 'Last name of the user',
        required: true,
    })
    @IsNotEmpty()
    @IsString()
    lastname: string;

    @ApiProperty({
        description: 'Birthday of the user',
        required: false,
        type: Date,
    })
    @IsOptional()
    @Type(() => Date)
    @IsDate()
    birthday?: Date;

    @ApiProperty({
        description: 'Gender of the user',
        required: false,
        enum: genderTypes,
    })
    @IsOptional()
    @IsEnum(genderTypes)
    gender?: genderTypes;

    @ApiProperty({
        description: 'Identification type',
        required: false,
    })
    @IsOptional()
    @IsString()
    identification_type?: string;

    @ApiProperty({
        description: 'Identification number',
        required: true,
    })
    @IsNotEmpty()
    @IsString()
    identification_number: string;

    @ApiProperty({
        description: 'Username for login',
        required: true,
    })
    @IsNotEmpty()
    @IsString()
    username: string;

    @ApiProperty({
        description: 'Password for login',
        required: true,
    })
    @IsNotEmpty()
    @IsString()
    password: string;

    @ApiProperty({
        description: 'Status of the user',
        required: false,
        enum: StatusStatesEnum,
        default: StatusStatesEnum.CONTRATISTA,
    })
    @IsOptional()
    @IsEnum(StatusStatesEnum)
    status?: StatusStatesEnum;

    @ApiProperty({
        description: 'Planta code',
        required: false,
    })
    @IsOptional()
    @IsString()
    planta_code?: string;

    @ApiProperty({
        description: 'Profile ID',
        required: true,
    })
    @IsNotEmpty()
    @IsUUID()
    profile_id: string;

    @ApiProperty({
        description: 'Phone number',
        required: false,
    })
    @IsOptional()
    @IsString()
    phone?: string;

    @ApiProperty({
        description: 'Email address',
        required: true,
    })
    @IsNotEmpty()
    @IsEmail()
    email: string;
} 