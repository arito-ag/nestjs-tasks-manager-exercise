import { Controller, Post, Body } from '@nestjs/common';
import { RegisterUserDto } from './dto/register-user.dto';
import { AuthService } from './auth.service';
import { LoginUserDto } from './dto/login-user.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/register')
  register(@Body() registerDto: RegisterUserDto) {
    return this.authService.createUser(registerDto);
  }

  @Post('/login')
  login(@Body() loginDto: LoginUserDto) {
    return this.authService.getUser(loginDto);
  }
}
