import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { TasksService } from './tasks.service';
import { UpdateTaskDto } from './dto/update-task.dto';

@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Get('all/:id')
  getAllTasks(@Param('id', ParseIntPipe) id: number) {
    return this.tasksService.getAll(id);
  }

  @Get('one/:taskId')
  getOneTask(@Param('taskId', ParseIntPipe) taskId: number) {
    return this.tasksService.getById(taskId);
  }

  @Get(':id')
  getTaskByFilters(@Param('id', ParseIntPipe) id: number) {
    return this.tasksService.getByFilters(id);
  }

  @Post()
  createTask(@Body() task: CreateTaskDto) {
    return this.tasksService.create(task);
  }

  @Patch(':id')
  updateTask(
    @Param('id', ParseIntPipe) id: number,
    @Body() task: UpdateTaskDto,
  ) {
    return this.tasksService.update(id, task);
  }

  @Delete(':id')
  deleteTask(@Param('id', ParseIntPipe) id: number) {
    return this.tasksService.delete(id);
  }
}
