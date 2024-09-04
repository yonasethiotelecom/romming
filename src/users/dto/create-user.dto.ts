import { IsEmail, IsInt, IsNotEmpty, IsString } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty()
  title: string;

  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  @IsString()
  empId: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  password: string;

  @IsInt()
  roleId: number;
}
