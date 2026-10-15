import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateSchoolClassDto {
    @ApiProperty({ example: '11A' })
    @IsString()
    @IsNotEmpty()
    name!: string;

    @ApiProperty({ example: '2026-2027' })
    @IsString()
    @IsNotEmpty()
    schoolYear!: string;
}