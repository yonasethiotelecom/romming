import { IsNotEmpty, IsString } from 'class-validator';

export class ChangeDto {
  @IsNotEmpty()
  @IsString()
  empId: string;

  @IsNotEmpty()
  @IsString()
  password: string;
}
