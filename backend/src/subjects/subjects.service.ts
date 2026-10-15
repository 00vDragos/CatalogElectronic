import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { Prisma } from '../generated/prisma/client.js';
import { CreateSubjectDto } from './dto/create-subject.dto.js';
import { UpdateSubjectDto } from './dto/update-subject.dto.js';

@Injectable()
export class SubjectsService {
    constructor(private readonly prisma: PrismaService) { }

    async getSubjects() {
        return this.prisma.subject.findMany({
            orderBy: { name: 'asc' },
        });
    }

    async createSubject(dto: CreateSubjectDto) {
        try {
            return await this.prisma.subject.create({
                data: dto,
            });
        } catch (error) {
            if (
                error instanceof Prisma.PrismaClientKnownRequestError &&
                error.code === 'P2002'
            ) {
                throw new ConflictException('Subject already exists');
            }

            throw error;
        }
    }

    async updateSubject(id: number, dto: UpdateSubjectDto) {
        try {
            return await this.prisma.subject.update({
                where: { id },
                data: dto,
            });
        } catch (error) {
            if (error instanceof Prisma.PrismaClientKnownRequestError) {
                if (error.code === 'P2025') {
                    throw new NotFoundException('Subject not found');
                }

                if (error.code === 'P2002') {
                    throw new ConflictException('Subject already exists');
                }
            }

            throw error;
        }
    }
}