
import 'dotenv/config';
import { hash } from 'bcryptjs';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient, Role } from '../src/generated/prisma/client.js';

const connectionString = process.env.DATABASE_URL;
const seedPassword = process.env.SEED_PASSWORD;

if (!connectionString || !seedPassword) {
    throw new Error('DATABASE_URL and SEED_PASSWORD are required');
}

const prisma = new PrismaClient({
    adapter: new PrismaPg({ connectionString }),
});

async function main() {
    console.log('Starting database seed...');

    const passwordHash = await hash(seedPassword!, 12);

    // 1. Create school classes
    const classes = new Map<string, number>();

    for (const name of ['10A', '10B']) {
        const schoolClass = await prisma.schoolClass.upsert({
            where: {
                name_schoolYear: { name, schoolYear: '2026-2027' },
            },
            update: {},
            create: { name, schoolYear: '2026-2027' },
        });

        classes.set(name, schoolClass.id);
    }

    // 2. Create subjects
    const subjects = new Map<string, number>();

    for (const name of ['Matematică', 'Fizică', 'Informatică']) {
        const subject = await prisma.subject.upsert({
            where: { name },
            update: {},
            create: { name },
        });

        subjects.set(name, subject.id);
    }

    // 3. Helper for demo user accounts
    async function createUser(email: string, role: Role) {
        return prisma.user.upsert({
            where: { email },
            update: {},
            create: { email, role, passwordHash },
        });
    }

    await createUser('admin@catalog.test', Role.ADMIN);

    // 4. Create teachers and their accounts
    const teacherData = [
        {
            firstName: 'Ion',
            lastName: 'Popescu',
            email: 'popescu@catalog.test',
        },
        {
            firstName: 'Maria',
            lastName: 'Ionescu',
            email: 'ionescu@catalog.test',
        },
    ];

    const teachers = new Map<string, number>();

    for (const data of teacherData) {
        const user = await createUser(data.email, Role.TEACHER);

        const teacher = await prisma.teacher.upsert({
            where: { email: data.email },
            update: { userId: user.id },
            create: { ...data, userId: user.id },
        });

        teachers.set(data.lastName, teacher.id);
    }

    // 5. Assign teachers to classes and subjects
    const assignments = [
        { teacher: 'Popescu', className: '10A', subject: 'Matematică' },
        { teacher: 'Popescu', className: '10A', subject: 'Fizică' },
        { teacher: 'Popescu', className: '10B', subject: 'Matematică' },
        { teacher: 'Ionescu', className: '10A', subject: 'Informatică' },
        { teacher: 'Ionescu', className: '10B', subject: 'Informatică' },
    ];

    const assignmentIds = new Map<string, number>();

    for (const item of assignments) {
        const classId = classes.get(item.className)!;
        const subjectId = subjects.get(item.subject)!;

        const assignment = await prisma.teachingAssignment.upsert({
            where: {
                classId_subjectId: { classId, subjectId },
            },
            update: { teacherId: teachers.get(item.teacher)! },
            create: {
                teacherId: teachers.get(item.teacher)!,
                classId,
                subjectId,
            },
        });

        assignmentIds.set(`${item.className}:${item.subject}`, assignment.id);
    }

    // 6. Create students and their accounts
    const studentData = [
        { firstName: 'Alex', lastName: 'Marin', cnp: '101', className: '10A' },
        { firstName: 'Ana', lastName: 'Dumitru', cnp: '102', className: '10A' },
        { firstName: 'Radu', lastName: 'Vasile', cnp: '103', className: '10A' },
        { firstName: 'Ioana', lastName: 'Georgescu', cnp: '104', className: '10B' },
        { firstName: 'Andrei', lastName: 'Stan', cnp: '105', className: '10B' },
        { firstName: 'Elena', lastName: 'Mihai', cnp: '106', className: '10B' },
    ];

    const students: Array<{ id: number; className: string }> = [];

    for (const data of studentData) {
        const email = `student${data.cnp}@catalog.test`;
        const user = await createUser(email, Role.STUDENT);

        const student = await prisma.student.upsert({
            where: { cnp: data.cnp },
            update: { classId: classes.get(data.className)!, userId: user.id },
            create: {
                firstName: data.firstName,
                lastName: data.lastName,
                cnp: data.cnp,
                email,
                classId: classes.get(data.className)!,
                userId: user.id,
            },
        });

        students.push({ id: student.id, className: data.className });
    }

    // 7. Create deterministic demo grades
    const gradeDate = new Date('2026-10-01T10:00:00Z');

    for (const student of students) {
        const classSubjects =
            student.className === '10A'
                ? ['Matematică', 'Fizică', 'Informatică']
                : ['Matematică', 'Informatică'];

        for (const [index, subject] of classSubjects.entries()) {
            const assignmentId = assignmentIds.get(
                `${student.className}:${subject}`,
            )!;

            const value = 8 + (index % 3);

            const existingGrade = await prisma.grade.findFirst({
                where: {
                    studentId: student.id,
                    assignmentId,
                    createdAt: gradeDate,
                },
            });

            if (!existingGrade) {
                await prisma.grade.create({
                    data: {
                        studentId: student.id,
                        assignmentId,
                        value,
                        createdAt: gradeDate,
                    },
                });
            }
        }
    }

    console.log('Database seed completed successfully!');
}

main()
    .catch((error) => {
        console.error('Seeding failed:', error);
        process.exitCode = 1;
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
