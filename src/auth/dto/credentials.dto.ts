import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class Credentials {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  password: string;
}
