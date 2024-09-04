import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class ChangePassDto {

  @IsNotEmpty()
  @IsString()
  oldPassword: string;

  @IsNotEmpty()
  @IsString()
  newPassword: string;

}
