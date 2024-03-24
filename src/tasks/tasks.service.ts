import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersService } from 'src/users/users.service';
import { Task } from './entities/task.entity';
import { Repository } from 'typeorm';
import { CreateTaskDto } from './dto/create-task.dto';
import { TASK_STATUS } from './constants/status';
import { UpdateTaskDto } from './dto/update-task.dto';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task) private readonly taskRepository: Repository<Task>,
    private readonly userService: UsersService,
  ) {}

  async getAll(username: string) {
    const userFound = await this.userService.findByUsername(username);
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
    const userFound = await this.userService.findByUsername(username);
    const userId = userFound.id;
    return this.taskRepository.find({ where: { userId } });
  }

  async create(username: string, task: CreateTaskDto) {
    const userFound = await this.userService.findByUsername(username);
    if (!userFound) throw new NotFoundException('User not found');

    task['status'] = TASK_STATUS.PENDING;
    const newTask = this.taskRepository.create(task);
    newTask.userId = userFound.id;
    return this.taskRepository.save(newTask);
  }

  async update(id: number, task: UpdateTaskDto) {
    const validateStatus =
      task.status !== undefined ? this.findStatusInConstant(task.status) : true;

    if (!validateStatus)
      throw new BadRequestException(
        `That Task Status: "${task.status}" is not allowed`,
      );

    return this.taskRepository.update(id, task);
  }

  async delete(id: number) {
    const deletedTask = await this.taskRepository.delete({ id });
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
}
