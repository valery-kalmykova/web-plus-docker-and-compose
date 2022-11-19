import { IsNotEmpty, IsString } from 'class-validator';

export class SigninUserDto {
  @IsNotEmpty()
  @IsString()
  username: string;

  @IsNotEmpty()
  @IsString()
  password: string;
}
