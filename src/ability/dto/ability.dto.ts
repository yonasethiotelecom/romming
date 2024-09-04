import { JobRole } from '@prisma/client';
import { IsArray, IsEnum, IsInt, IsOptional, IsString } from 'class-validator';

export class CreateRolDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsEnum(JobRole)
  jobRole: JobRole;

  @IsOptional()
  @IsInt()
  orgId?: number;

  @IsOptional()
  @IsArray()
  abilities: AbilityDto[];
}

export class AbilityDto {
  @IsString()
  subject: string;

  @IsArray()
  @IsString({ each: true })
  action: string[];

  @IsOptional()
  @IsInt()
  roleId?: number;
}
