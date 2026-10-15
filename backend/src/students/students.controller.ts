import { Param, ParseIntPipe, Body, Controller, Get, Post, Query, Patch, Delete, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';

import type { Student } from '../generated/prisma/client.js';
import { StudentsService } from './students.service.js';
import { GradesService } from '../grades/grades.service.js';

import { CreateStudentDto } from './dto/create-student.dto.js';
import { FilterStudentsDto } from './dto/filter-students.dto.js';
import { UpdateStudentDto } from './dto/update-student.dto.js';

import { Role } from '../generated/prisma/client.js';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { CurrentUser } from '../auth/decorators/current-user.decorator.js';
import type { JwtPayload } from '../auth/types/authenticated-request.js';
import { RolesGuard } from '../auth/guards/roles.guard.js';
import { Roles } from '../auth/decorators/roles.decorator.js';


@ApiTags('Students')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('students')
export class StudentsController {
    constructor(
        private readonly studentsService: StudentsService,
        private readonly gradesService: GradesService,
    ) { }

    @ApiOperation({ summary: 'Get all students with optional filters' })
    @Roles(Role.ADMIN, Role.TEACHER)
    @Get()
    async getStudents(
        @Query() filters: FilterStudentsDto
    ): Promise<Student[]> {
        return this.studentsService.getStudents(filters);
    }

    @ApiOperation({ summary: 'Create a new student' })
    @Roles(Role.ADMIN)
    @Post()
    async createStudent(
        @Body() dto: CreateStudentDto
    ): Promise<Student> {
        return this.studentsService.createStudent(dto);
    }


    @ApiOperation({ summary: 'Get student by ID' })
    @Roles(Role.ADMIN, Role.TEACHER)
    @Get(':id')
    async getStudentById(
        @Param('id', ParseIntPipe) id: number
    ): Promise<Student> {
        return this.studentsService.getStudentById(id);
    }

    @ApiOperation({ summary: 'Update student by ID' })
    @Roles(Role.ADMIN)
    @Patch(':id')
    async updateStudent(
        @Param('id', ParseIntPipe) id: number,
        @Body() dto: UpdateStudentDto
    ): Promise<Student> {
        return this.studentsService.updateStudent(id, dto);
    }


    @ApiOperation({ summary: 'Delete student by ID' })
    @Roles(Role.ADMIN)
    @Delete(':id')
    async deleteStudent(
        @Param('id', ParseIntPipe) id: number
    ): Promise<Student> {
        return this.studentsService.deleteStudent(id);
    }

    @ApiOperation({ summary: 'Get grades and averages for a student' })
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    @Get(':id/grades')
    getStudentGrades(
        @Param('id', ParseIntPipe) id: number,
        @CurrentUser() user: JwtPayload,
    ) {
        return this.gradesService.getStudentGrades(id, user);
    }



    // @ApiOperation({ summary: 'Get all students' })
    // @Get()
    // getStudents(): string[] {
    //     return this.studentsService.getStudents();
    // }
    // @ApiOperation({ summary: 'Add a student in list' })
    // @ApiBody({ type: CreateStudentDto }) // am pastrat acest decorator doar ca sa stiu ca se poate
    // @Post()
    // createStudent(@Body() createStudentDto: CreateStudentDto): void {
    //     this.studentsService.createStudent(createStudentDto.name);
    // }    Alte ramasite de la primul api de dinainte de a crea DB si a folosi Schema Prisma
}