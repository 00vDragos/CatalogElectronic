import { Controller, Get, Param, ParseIntPipe, Body, Post, Patch, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiTags, ApiBearerAuth } from '@nestjs/swagger';

import { SchoolClassesService } from './school-classes.service.js';
import { CreateSchoolClassDto } from './dto/create-school-class.dto.js';
import { UpdateSchoolClassDto } from './dto/update-school-class.dto.js';

import { Role } from '../generated/prisma/client.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { RolesGuard } from '../auth/guards/roles.guard.js';
import { Roles } from '../auth/decorators/roles.decorator.js';


@ApiTags('School Classes')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('classes')
export class SchoolClassesController {
    constructor(
        private readonly schoolClassesService: SchoolClassesService,
    ) { }

    @ApiOperation({ summary: 'Get all school classes' })
    @Get()
    getClasses() {
        return this.schoolClassesService.getClasses();
    }


    @ApiOperation({ summary: 'Get students from a school class' })
    @Get(':id/students')
    getClassStudents(
        @Param('id', ParseIntPipe) id: number
    ) {
        return this.schoolClassesService.getClassStudents(id);
    }

    @ApiOperation({ summary: 'Create a new school class' })
    @Roles(Role.ADMIN)
    @Post()
    createClass(@Body() dto: CreateSchoolClassDto) {
        return this.schoolClassesService.createClass(dto);
    }


    @ApiOperation({ summary: 'Update school class by ID' })
    @Roles(Role.ADMIN)
    @Patch(':id')
    updateClass(
        @Param('id', ParseIntPipe) id: number,
        @Body() dto: UpdateSchoolClassDto,
    ) {
        return this.schoolClassesService.updateClass(id, dto);
    }
}


