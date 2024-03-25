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

  async getAll(username: string) {
    const userFound = await this.usersService.findByUsername(username);
    const userId = userFound.id;
    return this.taskRepository.find({ where: { userId } });
  }

  async getById(id: number) {
    const taskFound = await this.taskRepository.findOne({
      where: {
        id,
      },
    });

    if (!taskFound) throw new UnauthorizedException();

    return taskFound;
  }

  async getByFilters(username: string) {
    const userFound = await this.usersService.findByUsername(username);
    const userId = userFound.id;
    return this.taskRepository.find({ where: { userId } });
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

    const taskUpdated = await this.taskRepository.update(id, task);

    await this.transactionsService.create({
      type: TRANSACTION_TYPES.COMPLETED,
      description: `Task ${id} updated by ${user.username}`,
      userId: taskInfo.userId,
    });

    return taskUpdated;
  }

  async delete(id: number) {
    const { task, user } = await this.getTaskAndUserInfo(id);
    const deletedTask = await this.taskRepository.delete({ id });

    await this.transactionsService.create({
      type: TRANSACTION_TYPES.COMPLETED,
      description: `Task ${id} deleted by ${user.username}`,
      userId: task.userId,
    });

    return deletedTask;
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
