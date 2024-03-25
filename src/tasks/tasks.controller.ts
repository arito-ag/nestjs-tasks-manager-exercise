import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
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

  @Get()
  @UseGuards(AuthGuard)
  getTasks(
    @Request() req: RequestWithUser,
    @Query('keyword') keyword?: string,
    @Query('status') status?: string,
    @Query('days') days?: string,
    @Query('format') format?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    const { username } = req.user;
    return this.tasksService.getAll(
      username,
      keyword,
      status,
      days,
      format,
      page,
      limit,
    );
  }

  @Get(':id')
  @UseGuards(AuthGuard, TaskGuard)
  async getOneTask(@Param('id', ParseIntPipe) id: number) {
    return this.tasksService.getById(id);
  }

  @Post()
  @UseGuards(AuthGuard)
  createTask(@Request() req: RequestWithUser, @Body() task: CreateTaskDto) {
    const { username } = req.user;
    return this.tasksService.create(username, task);
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard, TaskGuard)
  updateTask(@Param('id') id: number, @Body() task: UpdateTaskDto) {
    return this.tasksService.update(id, task);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard, TaskGuard)
  deleteTask(@Param('id', ParseIntPipe) id: number) {
    return this.tasksService.delete(id);
  }
}
