import { ApiProperty } from '@nestjs/swagger';
import { IsInt, Min } from 'class-validator';

export class CreateTeachingAssignmentDto {
    @ApiProperty({ example: 1 })
    @IsInt()
    @Min(1)
    teacherId!: number;

    @ApiProperty({ example: 2 })
    @IsInt()
    @Min(1)
    classId!: number;

    @ApiProperty({ example: 1 })
    @IsInt()
    @Min(1)
    subjectId!: number;
}