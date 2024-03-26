import {
  Body,
  Controller,
  Delete,
  FileTypeValidator,
  Get,
  HttpCode,
  HttpStatus,
  MaxFileSizeValidator,
  Param,
  ParseFilePipe,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  Request,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { TasksService } from './tasks.service';
import { RequestWithUser } from 'src/auth/interface/request-with-user.interface';
import { AuthGuard } from 'src/auth/guard/auth.guard';
import { TaskGuard } from 'src/auth/guard/task.guard';
import { UpdateTaskDto } from './dto/update-task.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadService } from 'src/upload/upload.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('tasks')
@ApiBearerAuth()
@Controller('tasks')
export class TasksController {
  constructor(
    private readonly tasksService: TasksService,
    private readonly uploadService: UploadService,
  ) {}

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
  @UseInterceptors(FileInterceptor('file'))
  async createTask(
    @Request() req: RequestWithUser,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 50000 }),
          new FileTypeValidator({ fileType: '.(png|jpeg|jpg|pdf)' }),
        ],
      }),
    )
    file: Express.Multer.File,
    @Body() task: CreateTaskDto,
  ) {
    const { username } = req.user;
    await this.uploadService.upload(file.originalname, file.buffer);
    task.file = file.originalname;
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
