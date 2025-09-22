import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
  Request,
} from '@nestjs/common';
import { TaskService } from './task.service';
import { Task, TaskStatus, TaskPriority } from './task.entity';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { User } from '../users/user.entity';

class CreateTaskDto {
  title: string;
  description: string;
  priority: TaskPriority;
  assigneeId?: string;
  dueDate?: Date;
}

class UpdateTaskDto {
  title?: string;
  description?: string;
  status?: TaskStatus;
  priority?: TaskPriority;
  assigneeId?: string;
  dueDate?: Date;
}

@Controller('tasks')
@UseGuards(JwtAuthGuard)
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Post()
  async createTask(
    @Body() createTaskDto: CreateTaskDto,
    @Request() req,
  ): Promise<Task> {
    return this.taskService.createTask(createTaskDto, req.user as User);
  }

  @Get()
  async getTasks(@Request() req): Promise<Task[]> {
    return this.taskService.getTasks(req.user as User);
  }

  @Get(':id')
  async getTaskById(
    @Param('id') id: string,
    @Request() req,
  ): Promise<Task> {
    return this.taskService.getTaskById(id, req.user as User);
  }

  @Put(':id')
  async updateTask(
    @Param('id') id: string,
    @Body() updateTaskDto: UpdateTaskDto,
    @Request() req,
  ): Promise<Task> {
    return this.taskService.updateTask(id, updateTaskDto, req.user as User);
  }

  @Delete(':id')
  async deleteTask(
    @Param('id') id: string,
    @Request() req,
  ): Promise<void> {
    return this.taskService.deleteTask(id, req.user as User);
  }

  @Put(':id/assign')
  async assignTask(
    @Param('id') id: string,
    @Body('assigneeId') assigneeId: string,
    @Request() req,
  ): Promise<Task> {
    return this.taskService.assignTask(id, assigneeId, req.user as User);
  }
}
