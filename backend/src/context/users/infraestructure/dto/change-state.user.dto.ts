import { IsNotEmpty, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { generalStateTypes } from '@enums/general-state-type';

export class ChangeStateUserDto {
    @ApiProperty({
        description: 'New state for the user',
        required: true,
        enum: generalStateTypes,
        example: generalStateTypes.ACTIVO,
    })
    @IsNotEmpty()
    @IsEnum(generalStateTypes)
    state: generalStateTypes;
} 