import { IsDate, IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class UpdateMemberDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(8)
  password: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsDate()
  updateAt: Date;
}