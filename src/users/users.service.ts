import { Injectable } from '@nestjs/common';
import { SignUpUserDto } from './dto/sign-up-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { LoginUserDto } from './dto/login-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  // This service will be used to authenticate user who is logging in. This is only the base code
  getUser(user: LoginUserDto) {
    const { username, password } = user;
    return this.userRepository.findOne({
      where: {
        username,
        password,
      },
    });
  }

  createUser(user: SignUpUserDto) {
    const newUser = this.userRepository.create(user);
    return this.userRepository.save(newUser);
  }
}
