import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { RequestWithUser } from '../interface/request-with-user.interface';
import { TasksService } from 'src/tasks/tasks.service';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class TaskGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly taskService: TasksService,
    private readonly userService: UsersService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: RequestWithUser = context.switchToHttp().getRequest();

    const username = request.user.username;
    const { id } = request.params;

    const userInfo = await this.userService.findByUsername(username);

    const taskOwnership = await this.taskService.getByTaskIdAndUserId(
      Number(id),
      userInfo.id,
    );

    if (!taskOwnership) throw new UnauthorizedException();

    return true;
  }
}
