import { PartialType } from '@nestjs/swagger';
import { CreateSchoolClassDto } from './create-school-class.dto.js';

export class UpdateSchoolClassDto extends PartialType(CreateSchoolClassDto) { }  