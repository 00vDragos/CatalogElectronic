import { Module } from '@nestjs/common';
import { StudentsController } from './students.controller.js';
import { StudentsService } from './students.service.js';
import { PrismaModule } from '../prisma/prisma.module.js';
import { GradesModule } from '../grades/grades.module.js';
import { AuthModule } from '../auth/auth.module.js';

@Module({
  imports: [PrismaModule, GradesModule, AuthModule],
  controllers: [StudentsController],
  providers: [StudentsService],
})
export class StudentsModule { }
