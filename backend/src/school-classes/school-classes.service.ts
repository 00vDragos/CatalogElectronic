import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { Prisma } from '../generated/prisma/client.js';
import { CreateSchoolClassDto } from './dto/create-school-class.dto.js';
import { PrismaService } from '../prisma/prisma.service.js';
import { UpdateSchoolClassDto } from './dto/update-school-class.dto.js';

@Injectable()
export class SchoolClassesService {
    constructor(private readonly prisma: PrismaService) { }

    async getClasses() {
        return this.prisma.schoolClass.findMany({
            include: {
                _count: {
                    select: { students: true },
                },
            },
            orderBy: { name: 'asc' },
        });
    }

    async getClassStudents(id: number) {
        const schoolClass = await this.prisma.schoolClass.findUnique({
            where: { id },
            include: {
                students: {
                    orderBy: { lastName: 'asc' },
                },
            },
        });

        if (!schoolClass) {
            throw new NotFoundException(`Class with ID ${id} not found`);
        }

        return schoolClass;
    }
    async createClass(dto: CreateSchoolClassDto) {
        try {
            return await this.prisma.schoolClass.create({
                data: dto,
            });
        } catch (error) {
            if (
                error instanceof Prisma.PrismaClientKnownRequestError &&
                error.code === 'P2002'
            ) {
                throw new ConflictException(
                    'This class already exists for the selected school year',
                );
            }

            throw error;
        }
    }
    async updateClass(id: number, dto: UpdateSchoolClassDto) {
        try {
            return await this.prisma.schoolClass.update({
                where: { id },
                data: dto,
            });
        } catch (error) {
            if (error instanceof Prisma.PrismaClientKnownRequestError) {
                if (error.code === 'P2025') {
                    throw new NotFoundException(
                        `Class with ID ${id} not found`,
                    );
                }

                if (error.code === 'P2002') {
                    throw new ConflictException(
                        'This class already exists for the selected school year',
                    );
                }
            }

            throw error;
        }
    }
}