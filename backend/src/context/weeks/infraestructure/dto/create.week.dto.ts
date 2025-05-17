import {
    IsNotEmpty,
    IsString,
    IsDate,
    IsOptional,
    IsArray,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { CreateWeekgroupDto } from '@context/weekgroups/infraestructure/dto/create.weekgroup.dto';

export class CreateWeekDto {
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

    @ApiProperty({
        description: 'Week groups associated with this week',
        type: [CreateWeekgroupDto],
        required: false,
    })
    @IsOptional()
    @IsArray()
    @IsNotEmpty({ each: true })
    weekgroups?: CreateWeekgroupDto[];
}
