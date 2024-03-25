import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersService } from 'src/users/users.service';
import { Task } from './entities/task.entity';
import { Repository } from 'typeorm';
import { CreateTaskDto } from './dto/create-task.dto';
import { TASK_STATUS } from './constants/status';
import { UpdateTaskDto } from './dto/update-task.dto';
import { TransactionsService } from 'src/transactions/transactions.service';
import { TRANSACTION_TYPES } from 'src/transactions/constants/types';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task) private readonly taskRepository: Repository<Task>,
    private readonly usersService: UsersService,
    private readonly transactionsService: TransactionsService,
  ) {}

  private readonly manyTasksFields = {
    id: true,
    title: true,
    description: true,
    deadline: true,
    status: true,
  };

  private readonly oneTaskFields = {
    id: true,
    title: true,
    description: true,
    deadline: true,
    comments: true,
    tags: true,
    file: true,
    createdAt: true,
    updatedAt: true,
    status: true,
  };

  async getAll(username: string) {
    const userFound = await this.usersService.findByUsername(username);
    const userId = userFound.id;
    return this.taskRepository.find({
      where: { userId },
      select: this.manyTasksFields,
    });
  }

  getById(id: number) {
    return this.taskRepository.findOne({
      where: { id },
      select: this.oneTaskFields,
    });
  }

  async getByFilters(username: string) {
    const userFound = await this.usersService.findByUsername(username);
    const userId = userFound.id;
    return this.taskRepository.find({
      where: { userId },
      select: this.manyTasksFields,
    });
  }

  async create(username: string, task: CreateTaskDto) {
    const userFound = await this.usersService.findByUsername(username);

    task['status'] = TASK_STATUS.PENDING;
    const newTask = this.taskRepository.create(task);
    newTask.userId = userFound.id;

    const taskCreated = await this.taskRepository.save(newTask);

    await this.transactionsService.create({
      type: TRANSACTION_TYPES.COMPLETED,
      description: `Task ${newTask.id} created by ${username}`,
      userId: userFound.id,
    });

    return taskCreated;
  }

  async update(id: number, task: UpdateTaskDto) {
    const { task: taskInfo, user } = await this.getTaskAndUserInfo(id);

    const validateStatus =
      task.status !== undefined ? this.findStatusInConstant(task.status) : true;

    if (!validateStatus)
      throw new BadRequestException(
        `That Task Status: "${task.status}" is not allowed`,
      );

    await this.taskRepository.update(id, task);

    await this.transactionsService.create({
      type: TRANSACTION_TYPES.COMPLETED,
      description: `Task ${id} updated by ${user.username}`,
      userId: taskInfo.userId,
    });

    return {
      message: `Task: "${taskInfo.title}" updated`,
    };
  }

  async delete(id: number) {
    const { task, user } = await this.getTaskAndUserInfo(id);
    await this.taskRepository.delete({ id });

    await this.transactionsService.create({
      type: TRANSACTION_TYPES.COMPLETED,
      description: `Task ${id} deleted by ${user.username}`,
      userId: task.userId,
    });

    return {
      message: `Task: "${task.title}" deleted`,
    };
  }

  async getByTaskIdAndUserId(id: number, userId: number) {
    const taskFound = await this.taskRepository.findOne({
      where: { id, userId },
    });
    if (!taskFound) throw new UnauthorizedException();
    return taskFound;
  }

  private findStatusInConstant(status: string): boolean {
    const keys = Object.values(TASK_STATUS);
    return keys.includes(status);
  }

  private async getTaskAndUserInfo(taskId: number) {
    const task = await this.taskRepository.findOne({ where: { id: taskId } });
    const user = await this.usersService.findById(task.userId);

    return {
      task,
      user,
    };
  }
}
