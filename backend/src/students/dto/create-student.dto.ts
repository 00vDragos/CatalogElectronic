import { IsString, IsNotEmpty, IsEmail, IsOptional, IsInt, Min } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';



export class CreateStudentDto {
    @ApiProperty({ example: 'Alex' })
    @IsString()
    @IsNotEmpty()
    firstName!: string;

    @ApiProperty({ example: 'Popescu' })
    @IsString()
    @IsNotEmpty()
    lastName!: string;

    @ApiProperty({ example: 'alex@example.com' })
    @IsEmail()
    email!: string;

    @ApiProperty({ example: '123' })
    @IsString()
    @IsNotEmpty()
    cnp!: string;

    @ApiPropertyOptional({ example: '0712345678' })
    @IsOptional()
    @IsString()
    phone?: string;

    @ApiProperty({ example: 1 })
    @IsInt()
    @Min(1)
    classId!: number;
}
