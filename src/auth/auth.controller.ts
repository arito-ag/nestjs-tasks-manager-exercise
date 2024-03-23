import { Controller, Post, Body } from '@nestjs/common';
import { RegisterUserDto } from './dto/register-user.dto';
import { AuthService } from './auth.service';
import { LoginUserDto } from './dto/login-user.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/register')
  register(@Body() user: RegisterUserDto) {
    return this.authService.createUser(user);
  }

  @Post('/login')
  login(@Body() user: LoginUserDto) {
    return this.authService.getUser(user);
  }
}
