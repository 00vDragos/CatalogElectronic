import { Module } from '@nestjs/common';
import { SchoolClassesController } from './school-classes.controller.js';
import { SchoolClassesService } from './school-classes.service.js';
import { PrismaModule } from '../prisma/prisma.module.js';
import { AuthModule } from '../auth/auth.module.js';


@Module({
  imports: [PrismaModule, AuthModule],
  controllers: [SchoolClassesController],
  providers: [SchoolClassesService],
})
export class SchoolClassesModule { }


