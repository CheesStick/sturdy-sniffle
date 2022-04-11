import { IsEmail, Length, MinLength } from "class-validator";

export class UpdateProfileInfoDto {
  @Length(8, 28)
  username: string;

  @IsEmail()
  email: string;
}

export class updateProfilePasswordDto {
  @MinLength(8)
  currentPassword: string;

  @MinLength(8)
  password: string;
}