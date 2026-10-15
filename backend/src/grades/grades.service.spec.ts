
import { Test, type TestingModule } from '@nestjs/testing';
import { ForbiddenException, BadRequestException } from '@nestjs/common';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { GradesService } from './grades.service.js';
import { PrismaService } from '../prisma/prisma.service.js';
import { Role } from '../generated/prisma/client.js';

describe('GradesService', () => {
  let service: GradesService;

  const prismaMock = {
    student: {
      findUnique: vi.fn(),
    },
    teacher: {
      findUnique: vi.fn(),
    },
    teachingAssignment: {
      findUnique: vi.fn(),
      findFirst: vi.fn(),
    },
    grade: {
      findUnique: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    },
  };

  beforeEach(async () => {
    vi.resetAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GradesService,
        {
          provide: PrismaService,
          useValue: prismaMock,
        },
      ],
    }).compile();

    service = module.get<GradesService>(GradesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('allows a teacher to create a grade for an assigned student', async () => {
    prismaMock.student.findUnique.mockResolvedValue({
      id: 1,
      classId: 10,
    });

    prismaMock.teachingAssignment.findUnique.mockResolvedValue({
      id: 20,
      teacherId: 5,
      classId: 10,
    });

    prismaMock.teacher.findUnique.mockResolvedValue({
      id: 5,
    });

    prismaMock.grade.create.mockResolvedValue({
      id: 100,
      value: 9,
      studentId: 1,
      assignmentId: 20,
    });

    const result = await service.createGrade(
      {
        studentId: 1,
        assignmentId: 20,
        value: 9,
      },
      50,
    );

    expect(result.value).toBe(9);

    expect(prismaMock.grade.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: {
          value: 9,
          studentId: 1,
          assignmentId: 20,
        },
      }),
    );
  });

  it('prevents a teacher from grading another teacher assignment', async () => {
    prismaMock.student.findUnique.mockResolvedValue({
      id: 1,
      classId: 10,
    });

    prismaMock.teachingAssignment.findUnique.mockResolvedValue({
      id: 20,
      teacherId: 99,
      classId: 10,
    });

    prismaMock.teacher.findUnique.mockResolvedValue({
      id: 5,
    });

    await expect(
      service.createGrade(
        {
          studentId: 1,
          assignmentId: 20,
          value: 9,
        },
        50,
      ),
    ).rejects.toThrow(ForbiddenException);

    expect(prismaMock.grade.create).not.toHaveBeenCalled();
  });

  it('prevents grading a student from a different class', async () => {
    prismaMock.student.findUnique.mockResolvedValue({
      id: 1,
      classId: 11,
    });

    prismaMock.teachingAssignment.findUnique.mockResolvedValue({
      id: 20,
      teacherId: 5,
      classId: 10,
    });

    prismaMock.teacher.findUnique.mockResolvedValue({
      id: 5,
    });

    await expect(
      service.createGrade(
        {
          studentId: 1,
          assignmentId: 20,
          value: 8,
        },
        50,
      ),
    ).rejects.toThrow(BadRequestException);

    expect(prismaMock.grade.create).not.toHaveBeenCalled();
  });

  it('prevents a student from viewing another students grades', async () => {
    prismaMock.student.findUnique
      .mockResolvedValueOnce({
        id: 2,
        classId: 10,
      })
      .mockResolvedValueOnce({
        id: 1,
      });

    await expect(
      service.getStudentGrades(2, {
        sub: 100,
        role: Role.STUDENT,
      }),
    ).rejects.toThrow(ForbiddenException);
  });

  it('calculates subject averages and general average correctly', async () => {
    prismaMock.student.findUnique
      .mockResolvedValueOnce({
        id: 1,
        classId: 10,
      })
      .mockResolvedValueOnce({
        id: 1,
        firstName: 'Ana',
        lastName: 'Popescu',
        grades: [
          {
            id: 1,
            value: 8,
            createdAt: new Date('2026-10-10'),
            assignment: {
              subject: {
                id: 1,
                name: 'Matematică',
              },
            },
          },
          {
            id: 2,
            value: 10,
            createdAt: new Date('2026-10-11'),
            assignment: {
              subject: {
                id: 1,
                name: 'Matematică',
              },
            },
          },
          {
            id: 3,
            value: 7,
            createdAt: new Date('2026-10-12'),
            assignment: {
              subject: {
                id: 2,
                name: 'Informatică',
              },
            },
          },
        ],
      });

    const result = await service.getStudentGrades(1, {
      sub: 1,
      role: Role.ADMIN,
    });

    expect(result.subjects).toHaveLength(2);

    expect(result.subjects[0].average).toBe(9);
    expect(result.subjects[1].average).toBe(7);

    expect(result.generalAverage).toBe(8);
  });
});
