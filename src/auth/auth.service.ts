import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { RegisterUserDto } from './dto/register-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { LoginUserDto } from './dto/login-user.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  // This service will be used to authenticate user who is logging in. This is only the base code
  async getUser(user: LoginUserDto) {
    const { username, password } = user;
    // Validate if user exist
    const userFound = await this.userRepository.findOne({
      where: {
        username,
      },
    });

    if (!userFound)
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);

    if (userFound.password === password) return userFound;
    else throw new HttpException('Incorrect password', HttpStatus.BAD_REQUEST);
  }

  async createUser(user: RegisterUserDto) {
    // Validate if user already exist
    const userFound = await this.userRepository.findOne({
      where: {
        username: user.username,
      },
    });

    if (userFound)
      throw new HttpException('User already exists', HttpStatus.CONFLICT);

    const newUser = this.userRepository.create(user);
    return this.userRepository.save(newUser);
  }
}
