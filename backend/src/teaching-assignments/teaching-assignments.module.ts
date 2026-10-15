import { Module, UseGuards } from '@nestjs/common';

import { AuthModule } from '../auth/auth.module.js';
import { TeachingAssignmentsController } from './teaching-assignments.controller.js';
import { TeachingAssignmentsService } from './teaching-assignments.service.js';
import { PrismaModule } from '../prisma/prisma.module.js';
@Module({
  imports: [PrismaModule, AuthModule],
  controllers: [TeachingAssignmentsController],
  providers: [TeachingAssignmentsService]
})
export class TeachingAssignmentsModule { }
