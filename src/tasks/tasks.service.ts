import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersService } from 'src/users/users.service';
import { Task } from './entities/task.entity';
import { Repository, SelectQueryBuilder } from 'typeorm';
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

  private readonly manyTasksFields = [
    'task.id',
    'task.title',
    'task.description',
    'task.deadline',
    'task.status',
    'task.file',
  ];

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

  async getAll(
    username: string,
    keyword: string,
    status: string,
    daysLeft: string,
    format: string,
    page: string,
    limit: string,
  ) {
    const userFound = await this.usersService.findByUsername(username);
    const userId = userFound.id;

    const queryToExecute = await this.prepareFilters(
      keyword,
      status,
      daysLeft,
      format,
      userId,
      page,
      limit,
    );

    return queryToExecute.getMany();
  }

  getById(id: number) {
    return this.taskRepository.findOne({
      where: { id },
      select: this.oneTaskFields,
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

    delete taskCreated.userId;
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

  // Filters for getAll here
  private prepareFilters(
    keyword: string,
    status: string,
    daysLeft: string,
    format: string,
    userId: number,
    page: string,
    limit: string,
  ) {
    let queryBuilder = this.taskRepository.createQueryBuilder('task');
    queryBuilder = queryBuilder.select(this.manyTasksFields);
    queryBuilder = queryBuilder.where('task.userId = :userId', { userId });

    if (keyword) queryBuilder = this.getKeywordFilter(queryBuilder, keyword);

    if (status) queryBuilder = this.getStatusFilter(queryBuilder, status);

    if (daysLeft && Number(daysLeft) > 0)
      queryBuilder = this.getDaysLeftFilter(queryBuilder, Number(daysLeft));

    if (format) queryBuilder = this.getFileFormatFilter(queryBuilder, format);

    queryBuilder = this.getPaginationFilter(queryBuilder, page, limit);

    return queryBuilder;
  }

  private getKeywordFilter(
    queryBuilder: SelectQueryBuilder<Task>,
    keyword: string,
  ) {
    return queryBuilder.andWhere(
      '(task.title LIKE :keyword OR task.description LIKE :keyword OR task.comments LIKE :keyword OR task.tags LIKE :keyword)',
      { keyword: `%${keyword}%` },
    );
  }

  private getStatusFilter(
    queryBuilder: SelectQueryBuilder<Task>,
    status: string,
  ) {
    return queryBuilder.andWhere('task.status = :status', {
      status,
    });
  }

  private getDaysLeftFilter(
    queryBuilder: SelectQueryBuilder<Task>,
    daysLeft: number,
  ) {
    const currentDate = new Date();
    const limitDate = new Date(
      currentDate.getTime() + Number(daysLeft) * 24 * 60 * 60 * 1000,
    );

    const limitDateString = limitDate.toISOString().split('T')[0];

    return queryBuilder.andWhere('task.deadline <= :limitDateString', {
      limitDateString,
    });
  }

  private getFileFormatFilter(
    queryBuilder: SelectQueryBuilder<Task>,
    format: string,
  ) {
    return queryBuilder.andWhere(
      '(SUBSTRING_INDEX(task.file, ".", -1) = :format AND task.file IS NOT NULL)',
      { format },
    );
  }

  private getPaginationFilter(
    queryBuilder: SelectQueryBuilder<Task>,
    page: string,
    limit: string,
  ) {
    const pageNumber = page ? parseInt(page, 10) : 1;
    const limitNumber = limit ? parseInt(limit, 10) : 10;
    return queryBuilder.skip((pageNumber - 1) * limitNumber).take(limitNumber);
  }
}
