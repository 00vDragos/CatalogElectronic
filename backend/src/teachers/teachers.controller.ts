import { Controller, Get, Param, ParseIntPipe, Body, Patch, Post, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiTags, ApiBearerAuth } from '@nestjs/swagger';

import { TeachersService } from './teachers.service.js';
import { CreateTeacherDto } from './dto/create-teacher.dto.js';
import { UpdateTeacherDto } from './dto/update-teacher.dto.js';

import { Role } from '../generated/prisma/client.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { RolesGuard } from '../auth/guards/roles.guard.js';
import { Roles } from '../auth/decorators/roles.decorator.js';
import { CurrentUser } from '../auth/decorators/current-user.decorator.js';
import type { JwtPayload } from '../auth/types/authenticated-request.js';



@ApiTags('Teachers')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('teachers')
export class TeachersController {
    constructor(private readonly teachersService: TeachersService) { }

    @ApiOperation({ summary: 'Get all teachers' })
    @Get()
    getTeachers() {
        return this.teachersService.getTeachers();
    }


    @ApiOperation({ summary: 'Get my teaching assignments' })
    @Roles(Role.TEACHER)
    @Get('me/assignments')
    getMyAssignments(@CurrentUser() user: JwtPayload) {
        return this.teachersService.getMyAssignments(user.sub);
    }

    @ApiOperation({ summary: 'Get teacher by ID with assignments' })
    @Get(':id')
    getTeacherById(@Param('id', ParseIntPipe) id: number) {
        return this.teachersService.getTeacherById(id);
    }



    @ApiOperation({ summary: 'Create a new teacher' })
    @Roles(Role.ADMIN)
    @Post()
    createTeacher(@Body() dto: CreateTeacherDto) {
        return this.teachersService.createTeacher(dto);
    }


    @ApiOperation({ summary: 'Update teacher by ID' })
    @Roles(Role.ADMIN)
    @Patch(':id')
    updateTeacher(
        @Param('id', ParseIntPipe) id: number,
        @Body() dto: UpdateTeacherDto,
    ) {
        return this.teachersService.updateTeacher(id, dto);
    }
}