import { Module } from '@nestjs/common';
import { TeachersController } from './teachers.controller.js';
import { TeachersService } from './teachers.service.js';
import { PrismaModule } from '../prisma/prisma.module.js';
import { AuthModule } from '../auth/auth.module.js';


@Module({
  imports: [PrismaModule, AuthModule],
  controllers: [TeachersController],
  providers: [TeachersService],
})
export class TeachersModule { }