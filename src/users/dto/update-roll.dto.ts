import { PartialType } from '@nestjs/mapped-types';
import { CreateRoleDto } from './create-roll.dto';
export class UpdateRoleDto extends PartialType(CreateRoleDto) {}
