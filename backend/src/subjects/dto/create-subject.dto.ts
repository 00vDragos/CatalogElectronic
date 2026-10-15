import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateSubjectDto {
    @ApiProperty({ example: 'Biologie' })
    @IsString()
    @IsNotEmpty()
    name!: string;
}