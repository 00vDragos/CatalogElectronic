import { NotFoundException, ConflictException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { Prisma } from '../generated/prisma/client.js';
import { CreateStudentDto } from './dto/create-student.dto.js';
import { FilterStudentsDto } from './dto/filter-students.dto.js';
import { UpdateStudentDto } from './dto/update-student.dto.js';

@Injectable()
export class StudentsService {
    constructor(private readonly prisma: PrismaService) { }

    async getStudents(filters: FilterStudentsDto) {
        const { search, classId } = filters;

        const words = search?.trim().split(/\s+/).filter(Boolean) ?? [];

        return this.prisma.student.findMany({
            where: {
                classId,
                AND: words.map((word) => ({
                    OR: [
                        { firstName: { contains: word, mode: 'insensitive' } },
                        { lastName: { contains: word, mode: 'insensitive' } },
                    ],
                })),
            },
            orderBy: [
                { lastName: 'asc' },
                { firstName: 'asc' },
            ],
        });
    }
    async getStudentById(id: number) {
        const student = await this.prisma.student.findUnique({
            where: { id },
        });

        if (!student) {
            throw new NotFoundException(`Student with ID ${id} not found`);
        }

        return student;
    }


    async createStudent(dto: CreateStudentDto) {
        const schoolClass = await this.prisma.schoolClass.findUnique({
            where: { id: dto.classId },
        });

        if (!schoolClass) {
            throw new NotFoundException('School class not found');
        }
        try {
            return await this.prisma.student.create({
                data: dto,
            });
        } catch (error) {
            if (
                error instanceof Prisma.PrismaClientKnownRequestError &&
                error.code === 'P2002'
            ) {
                throw new ConflictException(
                    'A student with this email or CNP already exists'
                );
            }

            throw error;
        }

    }

    async updateStudent(id: number, dto: UpdateStudentDto) {
        try {
            return await this.prisma.student.update({
                where: { id },
                data: dto,
            });
        } catch (error) {
            if (error instanceof Prisma.PrismaClientKnownRequestError) {
                if (error.code === 'P2025') {
                    throw new NotFoundException(
                        `Student with ID ${id} not found`,
                    );
                }

                if (error.code === 'P2002') {
                    throw new ConflictException(
                        'A student with this email or CNP already exists',
                    );
                }
            }

            throw error;
        }
    }

    async deleteStudent(id: number) {
        try {
            return await this.prisma.student.delete({
                where: { id },
            });
        } catch (error) {
            if (error instanceof Prisma.PrismaClientKnownRequestError) {
                if (error.code === 'P2025') {
                    throw new NotFoundException(
                        `Student with ID ${id} not found`,
                    );
                }

                if (error.code === 'P2003') {
                    throw new ConflictException(
                        'Cannot delete a student with existing grades',
                    );
                }
            }

            throw error;
        }
    }






    // private students: string[] = ["Ana", "Maria"];
    // createStudent(name: string): void {
    //     this.students.push(name)
    // }  Ramasite de la primul api  
}


