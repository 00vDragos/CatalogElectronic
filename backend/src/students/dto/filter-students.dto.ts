import { IsInt, IsOptional, IsString, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';
export class FilterStudentsDto {
    @ApiPropertyOptional({ example: 'Alex' })
    @IsOptional()
    @IsString()
    search?: string;

    @ApiPropertyOptional({ example: 1 })
    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    classId?: number;
}