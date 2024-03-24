import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class RegisterDto {
  @IsString()
  @MinLength(4)
  @IsNotEmpty()
  username: string;

  @IsString()
  @MinLength(6)
  password: string;
}
