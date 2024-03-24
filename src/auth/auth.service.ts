import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcryptjs from 'bcryptjs';
import { TransactionsService } from 'src/transactions/transactions.service';
import { TRANSACTION_TYPES } from 'src/transactions/constants/types';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly transactionsService: TransactionsService,
    private readonly jwtService: JwtService,
  ) {}

  // This service will be used to authenticate user who is logging in. This is only the base code
  async login(user: LoginDto) {
    const { username, password } = user;

    const userFound = await this.usersService.findByUsername(username);
    if (!userFound) throw new NotFoundException('User not found');

    const isPasswordValid = await bcryptjs.compare(
      password,
      userFound.password,
    );
    if (!isPasswordValid) throw new UnauthorizedException('Incorrect password');

    const payload = { username: userFound.username };
    const token = await this.jwtService.signAsync(payload);

    await this.transactionsService.create(
      TRANSACTION_TYPES.USER.LOGIN,
      `User: ${username} logged in`,
      userFound.id,
    );

    return {
      token,
      username,
    };
  }

  async register(user: RegisterDto) {
    const { username } = user;
    const userFound = await this.usersService.findByUsername(username);
    if (userFound) throw new BadRequestException('User already exists');

    user.password = await bcryptjs.hash(user.password, 10);
    const userCreated = await this.usersService.create(user);

    await this.transactionsService.create(
      TRANSACTION_TYPES.USER.REGISTER,
      `User: ${username} registered`,
      userCreated.id,
    );

    return {
      username,
      message: 'Welcome to Task Manager. Register Successfully',
    };
  }
}
