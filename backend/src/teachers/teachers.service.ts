import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { Prisma } from '../generated/prisma/client.js';
import { CreateTeacherDto } from './dto/create-teacher.dto.js';
import { UpdateTeacherDto } from './dto/update-teacher.dto.js';
@Injectable()
export class TeachersService {
    constructor(private readonly prisma: PrismaService) { }

    async getTeachers() {
        return this.prisma.teacher.findMany({
            select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
            },
            orderBy: {
                lastName: 'asc',
            },
        });
    }

    async getTeacherById(id: number) {
        const teacher = await this.prisma.teacher.findUnique({
            where: { id },
            include: {
                assignments: {
                    include: {
                        subject: true,
                        schoolClass: true,
                    },
                },
            },
        });

        if (!teacher) {
            throw new NotFoundException(
                `Teacher with ID ${id} not found`,
            );
        }

        return teacher;
    }

    async createTeacher(dto: CreateTeacherDto) {
        try {
            return await this.prisma.teacher.create({
                data: dto,
            });
        } catch (error) {
            if (
                error instanceof Prisma.PrismaClientKnownRequestError &&
                error.code === 'P2002'
            ) {
                throw new ConflictException('Teacher email already exists');
            }

            throw error;
        }
    }

    async updateTeacher(id: number, dto: UpdateTeacherDto) {
        try {
            return await this.prisma.teacher.update({
                where: { id },
                data: dto,
            });
        } catch (error) {
            if (error instanceof Prisma.PrismaClientKnownRequestError) {
                if (error.code === 'P2025') {
                    throw new NotFoundException(
                        `Teacher with ID ${id} not found`,
                    );
                }

                if (error.code === 'P2002') {
                    throw new ConflictException('Teacher email already exists');
                }
            }

            throw error;
        }
    }

    async getMyAssignments(userId: number) {
        const teacher = await this.prisma.teacher.findUnique({
            where: { userId },
            select: {
                id: true,
                firstName: true,
                lastName: true,
                assignments: {
                    select: {
                        id: true,
                        schoolClass: {
                            select: {
                                id: true,
                                name: true,
                                schoolYear: true,
                            },
                        },
                        subject: {
                            select: {
                                id: true,
                                name: true,
                            },
                        },
                    },
                    orderBy: {
                        id: 'asc',
                    },
                },
            },
        });

        if (!teacher) {
            throw new NotFoundException('Teacher profile not found');
        }

        return teacher;
    }
}