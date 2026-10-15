import { Module } from '@nestjs/common';
import { StudentsModule } from './students/students.module.js';
import { PrismaModule } from './prisma/prisma.module.js';
import { ConfigModule } from '@nestjs/config';
import { SchoolClassesModule } from './school-classes/school-classes.module.js';
import { TeachersModule } from './teachers/teachers.module.js';
import { SubjectsModule } from './subjects/subjects.module.js';
import { TeachingAssignmentsModule } from './teaching-assignments/teaching-assignments.module.js';
import { GradesModule } from './grades/grades.module.js';
import { AuthModule } from './auth/auth.module.js';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    StudentsModule,
    PrismaModule,
    SchoolClassesModule,
    TeachersModule,
    SubjectsModule,
    TeachingAssignmentsModule,
    GradesModule,
    AuthModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule { }
