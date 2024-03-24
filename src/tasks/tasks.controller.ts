import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { TasksService } from './tasks.service';
import { RequestWithUser } from 'src/auth/interface/request-with-user.interface';
import { AuthGuard } from 'src/auth/guard/auth.guard';
import { TaskGuard } from 'src/auth/guard/task.guard';
import { UpdateTaskDto } from './dto/update-task.dto';

@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  // OK
  @Get('')
  @UseGuards(AuthGuard)
  async getAllTasks(@Request() req: RequestWithUser) {
    const { username } = req.user;
    return this.tasksService.getAll(username);
  }

  // OK
  @Get(':id')
  @UseGuards(AuthGuard, TaskGuard)
  async getOneTask(@Param('id', ParseIntPipe) id: number) {
    return this.tasksService.getById(id);
  }

  // ToDo: Add Filters
  @Get('filters')
  @UseGuards(AuthGuard)
  getTaskByFilters(@Request() req: RequestWithUser) {
    const { username } = req.user;
    return this.tasksService.getByFilters(username);
  }

  // OK
  @Post()
  @UseGuards(AuthGuard)
  createTask(@Request() req: RequestWithUser, @Body() task: CreateTaskDto) {
    const { username } = req.user;
    return this.tasksService.create(username, task);
  }

  @Patch(':id')
  @UseGuards(AuthGuard, TaskGuard)
  updateTask(@Param('id') id: number, @Body() task: UpdateTaskDto) {
    return this.tasksService.update(id, task);
  }

  @Delete(':id')
  @UseGuards(AuthGuard, TaskGuard)
  deleteTask(@Param('id', ParseIntPipe) id: number) {
    return this.tasksService.delete(id);
  }
}
