import { Body, Controller, Get, Post, Param, ParseIntPipe, Patch, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiTags, ApiBearerAuth } from '@nestjs/swagger';

import { TeachingAssignmentsService } from './teaching-assignments.service.js';
import { CreateTeachingAssignmentDto } from './dto/create-teaching-assignment.dto.js';
import { UpdateTeachingAssignmentDto } from './dto/update-teaching-assignment.dto.js';

import { Role } from '../generated/prisma/client.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { RolesGuard } from '../auth/guards/roles.guard.js';
import { Roles } from '../auth/decorators/roles.decorator.js';

@ApiTags('Teaching Assignments')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('assignments')
export class TeachingAssignmentsController {
    constructor(
        private readonly assignmentsService: TeachingAssignmentsService,
    ) { }

    @ApiOperation({ summary: 'Get all teaching assignments' })
    @Get()
    getAssignments() {
        return this.assignmentsService.getAssignments();
    }

    @ApiOperation({ summary: 'Assign a teacher to a class and subject' })
    @Roles(Role.ADMIN)
    @Post()
    createAssignment(@Body() dto: CreateTeachingAssignmentDto) {
        return this.assignmentsService.createAssignment(dto);
    }

    @ApiOperation({ summary: 'Get teaching assignment by ID' })
    @Get(':id')
    getAssignmentById(
        @Param('id', ParseIntPipe) id: number,
    ) {
        return this.assignmentsService.getAssignmentById(id);
    }


    @ApiOperation({ summary: 'Update a teaching assignment' })
    @Roles(Role.ADMIN)
    @Patch(':id')
    updateAssignment(
        @Param('id', ParseIntPipe) id: number,
        @Body() dto: UpdateTeachingAssignmentDto,
    ) {
        return this.assignmentsService.updateAssignment(id, dto);
    }
}