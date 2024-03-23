import { Injectable, NotFoundException } from '@nestjs/common';
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

  getAll(userId: number) {
    return this.taskRepository.find({ where: { userId } });
  }

  async getById(id: number) {
    const taskFound = await this.taskRepository.findBy({ id });
    if (!taskFound) throw new NotFoundException('Task not exist');

    return taskFound;
  }

  getByFilters(userId: number) {
    return this.taskRepository.find({ where: { userId } });
  }

  async create(task: CreateTaskDto) {
    const userFound = await this.userService.findById(task.userId);
    if (!userFound) throw new NotFoundException('User not found');

    task['status'] = TASK_STATUS.PENDING;
    const newTask = this.taskRepository.create(task);
    return this.taskRepository.save(newTask);
  }

  async update(id: number, task: UpdateTaskDto) {
    const taskFound = await this.taskRepository.findOne({ where: { id } });
    if (!taskFound) throw new NotFoundException('Task not exist');

    const updateTask = Object.assign(taskFound, task);
    return this.taskRepository.save(updateTask);
  }

  async delete(id: number) {
    const deletedTask = await this.taskRepository.delete({ id });
    if (deletedTask.affected === 0)
      throw new NotFoundException('Task not exist');

    return deletedTask;
  }
}
