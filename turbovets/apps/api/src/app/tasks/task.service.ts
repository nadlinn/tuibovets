import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task, TaskStatus, TaskPriority } from './task.entity';
import { User } from '../users/user.entity';
import { Permission } from '../roles/role.entity';

@Injectable()
export class TaskService {
  constructor(
    @InjectRepository(Task)
    private taskRepository: Repository<Task>,
  ) {}

  async createTask(
    createTaskDto: {
      title: string;
      description: string;
      priority: TaskPriority;
      assigneeId?: string;
      dueDate?: Date;
    },
    creator: User,
  ): Promise<Task> {
    if (!creator.hasPermission(Permission.CREATE_TASK)) {
      throw new ForbiddenException('You do not have permission to create tasks');
    }

    const task = this.taskRepository.create({
      ...createTaskDto,
      creator,
      status: TaskStatus.TODO,
    });

    return this.taskRepository.save(task);
  }

  async getTasks(user: User): Promise<Task[]> {
    if (!user.hasPermission(Permission.READ_TASK)) {
      throw new ForbiddenException('You do not have permission to view tasks');
    }

    const query = this.taskRepository
      .createQueryBuilder('task')
      .leftJoinAndSelect('task.assignee', 'assignee')
      .leftJoinAndSelect('task.creator', 'creator');

    // If user doesn't have manage_users permission, only show their tasks
    if (!user.hasPermission(Permission.MANAGE_USERS)) {
      query.where('task.assignee_id = :userId OR task.creator_id = :userId', {
        userId: user.id,
      });
    }

    return query.getMany();
  }

  async getTaskById(id: string, user: User): Promise<Task> {
    if (!user.hasPermission(Permission.READ_TASK)) {
      throw new ForbiddenException('You do not have permission to view tasks');
    }

    const task = await this.taskRepository.findOne({
      where: { id },
      relations: ['assignee', 'creator'],
    });

    if (!task) {
      throw new NotFoundException('Task not found');
    }

    // Check if user has access to this task
    if (
      !user.hasPermission(Permission.MANAGE_USERS) &&
      task.assignee?.id !== user.id &&
      task.creator?.id !== user.id
    ) {
      throw new ForbiddenException('You do not have access to this task');
    }

    return task;
  }

  async updateTask(
    id: string,
    updateTaskDto: {
      title?: string;
      description?: string;
      status?: TaskStatus;
      priority?: TaskPriority;
      assigneeId?: string;
      dueDate?: Date;
    },
    user: User,
  ): Promise<Task> {
    const task = await this.getTaskById(id, user);

    if (!user.hasPermission(Permission.UPDATE_TASK)) {
      throw new ForbiddenException('You do not have permission to update tasks');
    }

    // Only creator or manager can update task
    if (
      !user.hasPermission(Permission.MANAGE_USERS) &&
      task.creator?.id !== user.id
    ) {
      throw new ForbiddenException('You do not have permission to update this task');
    }

    Object.assign(task, updateTaskDto);
    return this.taskRepository.save(task);
  }

  async deleteTask(id: string, user: User): Promise<void> {
    const task = await this.getTaskById(id, user);

    if (!user.hasPermission(Permission.DELETE_TASK)) {
      throw new ForbiddenException('You do not have permission to delete tasks');
    }

    // Only creator or manager can delete task
    if (
      !user.hasPermission(Permission.MANAGE_USERS) &&
      task.creator?.id !== user.id
    ) {
      throw new ForbiddenException('You do not have permission to delete this task');
    }

    await this.taskRepository.remove(task);
  }

  async assignTask(
    id: string,
    assigneeId: string,
    user: User,
  ): Promise<Task> {
    const task = await this.getTaskById(id, user);

    if (!user.hasPermission(Permission.ASSIGN_TASK)) {
      throw new ForbiddenException('You do not have permission to assign tasks');
    }

    // Only creator or manager can assign task
    if (
      !user.hasPermission(Permission.MANAGE_USERS) &&
      task.creator?.id !== user.id
    ) {
      throw new ForbiddenException('You do not have permission to assign this task');
    }

    task.assignee = { id: assigneeId } as User;
    return this.taskRepository.save(task);
  }
}
