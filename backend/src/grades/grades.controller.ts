import { Body, Controller, Post, Patch, Param, ParseIntPipe, Delete, UseGuards, Get } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

import { Role } from '../generated/prisma/client.js';

import { GradesService } from './grades.service.js';
import { CreateGradeDto } from './dto/create-grade.dto.js';
import { UpdateGradeDto } from './dto/update-grade.dto.js';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { RolesGuard } from '../auth/guards/roles.guard.js';
import { Roles } from '../auth/decorators/roles.decorator.js';
import { CurrentUser } from '../auth/decorators/current-user.decorator.js';
import type { JwtPayload } from '../auth/types/authenticated-request.js';

@ApiTags('Grades')
@Controller('grades')
export class GradesController {
    constructor(private readonly gradesService: GradesService) { }

    @ApiOperation({ summary: 'Add a grade to a student' })
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.TEACHER)
    @Post()
    createGrade(
        @Body() dto: CreateGradeDto,
        @CurrentUser() user: JwtPayload,
    ) {
        return this.gradesService.createGrade(dto, user.sub);
    }

    @ApiOperation({ summary: 'Get my grades and averages' })
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.STUDENT)
    @Get('me')
    getMyGrades(@CurrentUser() user: JwtPayload) {
        return this.gradesService.getMyGrades(user);
    }

    @ApiOperation({ summary: 'Update a grade' })
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.TEACHER)
    @Patch(':id')
    updateGrade(
        @Param('id', ParseIntPipe) id: number,
        @Body() dto: UpdateGradeDto,
        @CurrentUser() user: JwtPayload,
    ) {
        return this.gradesService.updateGrade(id, dto, user.sub);
    }

    @ApiOperation({ summary: 'Delete a grade' })
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.TEACHER)
    @Delete(':id')
    deleteGrade(
        @Param('id', ParseIntPipe) id: number,
        @CurrentUser() user: JwtPayload,
    ) {
        return this.gradesService.deleteGrade(id, user.sub);
    }



}
