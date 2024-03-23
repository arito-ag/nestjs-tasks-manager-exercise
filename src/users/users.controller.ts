import { Controller, Post, Body } from '@nestjs/common';
import { SignUpUserDto } from './dto/sign-up-user.dto';
import { UsersService } from './users.service';
import { LoginUserDto } from './dto/login-user.dto';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Post('/signup')
  signUp(@Body() user: SignUpUserDto) {
    return this.usersService.createUser(user);
  }

  @Post('/login')
  login(@Body() user: LoginUserDto) {
    return this.usersService.getUser(user);
  }
}
