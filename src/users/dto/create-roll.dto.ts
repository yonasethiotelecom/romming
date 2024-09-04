import { JobRole } from '@prisma/client';
import {
  IsString,
  IsOptional,
  IsEnum,
  IsInt,
  IsArray,
  ArrayNotEmpty,
} from 'class-validator';



export class CreateRoleDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsEnum(JobRole)
  jobRole?: JobRole = JobRole.User;

  @IsOptional()
  @IsInt()
  orgId?: number;

  @IsString()
  subject: string;

  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  action: string[];
}
