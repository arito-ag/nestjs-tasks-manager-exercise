import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { UsersService } from 'src/users/users.service';
import * as bcryptjs from 'bcryptjs';

@Injectable()
export class AuthService {
  constructor(private readonly usersService: UsersService) {}

  // This service will be used to authenticate user who is logging in. This is only the base code
  async login(user: LoginDto) {
    const { username, password } = user;

    // Validate if user exist
    const userFound = await this.usersService.findOneByUsername(username);
    if (!userFound) throw new NotFoundException('User not found');

    // Validate password match
    const isPasswordValid = await bcryptjs.compare(
      password,
      userFound.password,
    );
    if (!isPasswordValid) throw new UnauthorizedException('Incorrect password');

    return userFound;
  }

  async register(user: RegisterDto) {
    // Validate if user already exist
    const { username } = user;
    user.password = await bcryptjs.hash(user.password, 10);
    const userFound = await this.usersService.findOneByUsername(username);

    if (userFound) throw new BadRequestException('User already exists');

    return this.usersService.create(user);
  }
}
