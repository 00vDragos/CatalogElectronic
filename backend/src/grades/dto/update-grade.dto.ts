import { ApiProperty } from '@nestjs/swagger';
import { IsInt, Max, Min } from 'class-validator';

export class UpdateGradeDto {
    @ApiProperty({ example: 10, minimum: 1, maximum: 10 })
    @IsInt()
    @Min(1)
    @Max(10)
    value!: number;
}