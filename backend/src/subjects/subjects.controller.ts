import { Controller, Get, Post, Patch, Body, Param, ParseIntPipe } from '@nestjs/common';
import { ApiOperation, ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { SubjectsService } from './subjects.service.js';
import { CreateSubjectDto } from './dto/create-subject.dto.js';
import { UpdateSubjectDto } from './dto/update-subject.dto.js';

import { UseGuards } from '@nestjs/common';
import { Role } from '../generated/prisma/client.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { RolesGuard } from '../auth/guards/roles.guard.js';
import { Roles } from '../auth/decorators/roles.decorator.js';

@ApiTags('Subjects')
@ApiTags('Subjects')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('subjects')
export class SubjectsController {
    constructor(private readonly subjectsService: SubjectsService) { }

    @ApiOperation({ summary: 'Get all subjects' })
    @Get()
    getSubjects() {
        return this.subjectsService.getSubjects();
    }

    @ApiBearerAuth()
    //@UseGuards(JwtAuthGuard, RolesGuard)->comentam pt ca am adaugat guards pe tot conttroller-ul
    @Roles(Role.ADMIN)
    @ApiOperation({ summary: 'Create a subject' })
    @Post()
    createSubject(@Body() dto: CreateSubjectDto) {
        return this.subjectsService.createSubject(dto);
    }

    @ApiOperation({ summary: 'Update a subject' })
    @Roles(Role.ADMIN)
    @Patch(':id')
    updateSubject(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateSubjectDto) {
        return this.subjectsService.updateSubject(id, dto);
    }
}