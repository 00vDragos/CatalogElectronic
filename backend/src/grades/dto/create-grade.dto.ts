import { ApiProperty } from '@nestjs/swagger';
import { IsInt, Max, Min } from 'class-validator';

export class CreateGradeDto {
    @ApiProperty({ example: 9, minimum: 1, maximum: 10 })
    @IsInt()
    @Min(1)
    @Max(10)
    value!: number;

    @ApiProperty({ example: 3 })
    @IsInt()
    @Min(1)
    studentId!: number;

    @ApiProperty({ example: 2 })
    @IsInt()
    @Min(1)
    assignmentId!: number;
}