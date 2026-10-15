import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service.js';
import { Prisma } from '../generated/prisma/client.js';
import { CreateTeachingAssignmentDto } from './dto/create-teaching-assignment.dto.js';
import { UpdateTeachingAssignmentDto } from './dto/update-teaching-assignment.dto.js';

@Injectable()
export class TeachingAssignmentsService {
    constructor(private readonly prisma: PrismaService) { }

    async getAssignments() {
        return this.prisma.teachingAssignment.findMany({
            include: {
                teacher: true,
                schoolClass: true,
                subject: true,
            },
            orderBy: {
                id: 'asc',
            },
        });
    }
    async getAssignmentById(id: number) {
        const assignment = await this.prisma.teachingAssignment.findUnique({
            where: { id },
            include: {
                teacher: true,
                schoolClass: true,
                subject: true,
            },
        });

        if (!assignment) {
            throw new NotFoundException(
                `Teaching assignment with ID ${id} not found`,
            );
        }

        return assignment;
    }

    async createAssignment(dto: CreateTeachingAssignmentDto) {
        const [teacher, schoolClass, subject] = await Promise.all([
            this.prisma.teacher.findUnique({
                where: { id: dto.teacherId },
            }),
            this.prisma.schoolClass.findUnique({
                where: { id: dto.classId },
            }),
            this.prisma.subject.findUnique({
                where: { id: dto.subjectId },
            }),
        ]);

        if (!teacher) {
            throw new NotFoundException('Teacher not found');
        }

        if (!schoolClass) {
            throw new NotFoundException('School class not found');
        }

        if (!subject) {
            throw new NotFoundException('Subject not found');
        }

        try {
            return await this.prisma.teachingAssignment.create({
                data: dto,
            });
        } catch (error) {
            if (
                error instanceof Prisma.PrismaClientKnownRequestError &&
                error.code === 'P2002'
            ) {
                throw new ConflictException(
                    'This subject already has a teacher assigned to this class',
                );
            }

            throw error;
        }
    }
    async updateAssignment(id: number, dto: UpdateTeachingAssignmentDto) {
        const assignment = await this.prisma.teachingAssignment.findUnique({
            where: { id },
            include: {
                _count: {
                    select: { grades: true },
                },
            },
        });

        if (!assignment) {
            throw new NotFoundException('Teaching assignment not found');
        }

        if (assignment._count.grades > 0) {
            throw new ConflictException(
                'Cannot modify an assignment that has grades',
            );
        }

        const teacherId = dto.teacherId ?? assignment.teacherId;
        const classId = dto.classId ?? assignment.classId;
        const subjectId = dto.subjectId ?? assignment.subjectId;

        const [teacher, schoolClass, subject] = await Promise.all([
            this.prisma.teacher.findUnique({ where: { id: teacherId } }),
            this.prisma.schoolClass.findUnique({ where: { id: classId } }),
            this.prisma.subject.findUnique({ where: { id: subjectId } }),
        ]);

        if (!teacher) {
            throw new NotFoundException('Teacher not found');
        }

        if (!schoolClass) {
            throw new NotFoundException('School class not found');
        }

        if (!subject) {
            throw new NotFoundException('Subject not found');
        }

        try {
            return await this.prisma.teachingAssignment.update({
                where: { id },
                data: dto,
            });
        } catch (error) {
            if (error instanceof Prisma.PrismaClientKnownRequestError) {
                if (error.code === 'P2002') {
                    throw new ConflictException(
                        'This class already has a teacher for this subject',
                    );
                }

                if (error.code === 'P2025') {
                    throw new NotFoundException('Teaching assignment not found');
                }
            }

            throw error;
        }
    }

}