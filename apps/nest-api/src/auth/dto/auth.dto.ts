import { IsEmail, MinLength, Length, IsNotEmpty } from 'class-validator';

export class RegisterProfileDto {
  @Length(8, 28)
  username: string;

  @IsEmail()
  email: string;

  @MinLength(8)
  password: string;
}

export class LoginProfileDto {
  @IsEmail()
  email: string;

  @IsNotEmpty()
  password: string;
}