import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthService {
  constructor(private readonly usersService: UsersService) {}

  // This service will be used to authenticate user who is logging in. This is only the base code
  async login(user: LoginDto) {
    const { username, password } = user;
    // Validate if user exist
    const userFound = await this.usersService.findOneByUsername(username);

    if (!userFound)
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);

    if (userFound.password === password) return userFound;
    else throw new HttpException('Incorrect password', HttpStatus.BAD_REQUEST);
  }

  async register(user: RegisterDto) {
    // Validate if user already exist
    const { username, password } = user;
    const userFound = await this.usersService.findOneByUsername(username);

    if (userFound)
      throw new HttpException('User already exists', HttpStatus.CONFLICT);

    return this.usersService.create(user);
  }
}
