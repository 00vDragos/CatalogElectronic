import { Injectable, NotFoundException, BadRequestException, ForbiddenException } from '@nestjs/common';

import { Role } from '../generated/prisma/client.js';

import { PrismaService } from '../prisma/prisma.service.js';
import { CreateGradeDto } from './dto/create-grade.dto.js';
import { UpdateGradeDto } from './dto/update-grade.dto.js';

import type { JwtPayload } from '../auth/types/authenticated-request.js';

@Injectable()
export class GradesService {
    constructor(private readonly prisma: PrismaService) { }

    async createGrade(dto: CreateGradeDto, userId: number) {
        const [student, assignment] = await Promise.all([
            this.prisma.student.findUnique({
                where: { id: dto.studentId },
            }),

            this.prisma.teachingAssignment.findUnique({
                where: { id: dto.assignmentId },
            }),
        ]);

        if (!student) {
            throw new NotFoundException('Student not found');
        }

        if (!assignment) {
            throw new NotFoundException('Teaching assignment not found');
        }

        const teacher = await this.prisma.teacher.findUnique({
            where: { userId },
        });

        if (!teacher) {
            throw new ForbiddenException('Teacher profile not found');
        }

        if (assignment.teacherId !== teacher.id) {
            throw new ForbiddenException(
                'You are not assigned to this class and subject',
            );
        }

        if (student.classId !== assignment.classId) {
            throw new BadRequestException(
                'Student does not belong to the assigned class',
            );
        }
        return this.prisma.grade.create({
            data: {
                value: dto.value,
                studentId: dto.studentId,
                assignmentId: dto.assignmentId,
            },
            include: {
                student: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                    },
                },
                assignment: {
                    include: {
                        subject: true,
                        teacher: {
                            select: {
                                id: true,
                                firstName: true,
                                lastName: true,
                            },
                        },
                        schoolClass: true,
                    },
                },
            },
        });
    }
    async updateGrade(
        id: number,
        dto: UpdateGradeDto,
        userId: number,
    ) {
        await this.verifyGradeOwnership(id, userId);

        return this.prisma.grade.update({
            where: { id },
            data: { value: dto.value },
        });
    }
    async getMyGrades(user: JwtPayload) {
        const student = await this.prisma.student.findUnique({
            where: { userId: user.sub },
            select: { id: true },
        });

        if (!student) {
            throw new NotFoundException('Student profile not found');
        }

        return this.getStudentGrades(student.id, user);
    }
    async getStudentGrades(studentId: number, user: JwtPayload) {
        const studentExists = await this.prisma.student.findUnique({
            where: { id: studentId },
            select: { id: true, classId: true },
        });

        if (!studentExists) {
            throw new NotFoundException('Student not found');
        }

        if (user.role === Role.STUDENT) {
            const ownProfile = await this.prisma.student.findUnique({
                where: { userId: user.sub },
                select: { id: true },
            });

            if (ownProfile?.id !== studentId) {
                throw new ForbiddenException(
                    'You can only view your own grades',
                );
            }
        } else if (user.role === Role.TEACHER) {
            const teacher = await this.prisma.teacher.findUnique({
                where: { userId: user.sub },
                select: { id: true },
            });

            if (!teacher) {
                throw new ForbiddenException('Teacher profile not found');
            }

            const assignment = await this.prisma.teachingAssignment.findFirst({
                where: {
                    teacherId: teacher.id,
                    classId: studentExists.classId ?? -1,
                },
            });

            if (!assignment) {
                throw new ForbiddenException(
                    'You are not assigned to this student class',
                );
            }
        } else if (user.role !== Role.ADMIN) {
            throw new ForbiddenException('Insufficient permissions');
        }



        const student = await this.prisma.student.findUnique({
            where: { id: studentId },
            select: {
                id: true,
                firstName: true,
                lastName: true,
                grades: {
                    include: {
                        assignment: {
                            include: {
                                subject: true,
                            },
                        },
                    },
                    orderBy: {
                        createdAt: 'asc',
                    },
                },
            },
        });

        if (!student) {
            throw new NotFoundException('Student not found');
        }

        const subjects = new Map<
            number,
            {
                subjectId: number;
                subjectName: string;
                grades: { id: number; value: number; createdAt: Date }[];
            }
        >();

        for (const grade of student.grades) {
            const subject = grade.assignment.subject;

            if (!subjects.has(subject.id)) {
                subjects.set(subject.id, {
                    subjectId: subject.id,
                    subjectName: subject.name,
                    grades: [],
                });
            }

            subjects.get(subject.id)!.grades.push({
                id: grade.id,
                value: grade.value,
                createdAt: grade.createdAt,
            });
        }

        const results = Array.from(subjects.values()).map((subject) => {
            const total = subject.grades.reduce(
                (sum, grade) => sum + grade.value,
                0,
            );

            return {
                ...subject,
                average: Number(
                    (total / subject.grades.length).toFixed(2),
                ),
            };
        });
        const generalAverage =
            results.length > 0
                ? Number(
                    (
                        results.reduce(
                            (sum, subject) => sum + subject.average,
                            0,
                        ) / results.length
                    ).toFixed(2),
                )
                : null;

        return {
            student: {
                id: student.id,
                firstName: student.firstName,
                lastName: student.lastName,
            },
            subjects: results,
            generalAverage,
        };
    }

    async deleteGrade(id: number, userId: number) {
        await this.verifyGradeOwnership(id, userId);

        return this.prisma.grade.delete({
            where: { id },
        });
    }

    private async verifyGradeOwnership(gradeId: number, userId: number) {
        const grade = await this.prisma.grade.findUnique({
            where: { id: gradeId },
            include: {
                assignment: true,
            },
        });

        if (!grade) {
            throw new NotFoundException('Grade not found');
        }

        const teacher = await this.prisma.teacher.findUnique({
            where: { userId },
        });

        if (!teacher || grade.assignment.teacherId !== teacher.id) {
            throw new ForbiddenException(
                'You cannot modify this grade',
            );
        }
    }


}