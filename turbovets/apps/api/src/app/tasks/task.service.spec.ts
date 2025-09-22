import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TaskService } from './task.service';
import { Task, TaskStatus, TaskPriority } from './task.entity';
import { User } from '../users/user.entity';
import { Permission } from '../roles/role.entity';
import { ForbiddenException, NotFoundException } from '@nestjs/common';

describe('TaskService', () => {
  let service: TaskService;
  let repository: Repository<Task>;

  const mockUser: User = {
    id: '1',
    email: 'test@example.com',
    firstName: 'Test',
    lastName: 'User',
    password: 'password',
    roles: [
      {
        id: '1',
        name: 'Admin',
        permissions: [
          Permission.CREATE_TASK,
          Permission.READ_TASK,
          Permission.UPDATE_TASK,
          Permission.DELETE_TASK,
          Permission.ASSIGN_TASK,
          Permission.MANAGE_USERS,
        ],
        description: 'Admin role',
        users: [],
        isDefault: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ],
    assignedTasks: [],
    createdTasks: [],
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
    hasPermission: function (permission: string): boolean {
      return this.roles.some((role) => role.permissions.includes(permission as Permission));
    },
  };

  const mockTask: Task = {
    id: '1',
    title: 'Test Task',
    description: 'Test Description',
    status: TaskStatus.TODO,
    priority: TaskPriority.MEDIUM,
    assignee: null,
    creator: mockUser,
    dueDate: new Date(),
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TaskService,
        {
          provide: getRepositoryToken(Task),
          useValue: {
            create: jest.fn().mockReturnValue(mockTask),
            save: jest.fn().mockResolvedValue(mockTask),
            findOne: jest.fn().mockResolvedValue(mockTask),
            createQueryBuilder: jest.fn(() => ({
              leftJoinAndSelect: jest.fn().mockReturnThis(),
              where: jest.fn().mockReturnThis(),
              getMany: jest.fn().mockResolvedValue([mockTask]),
            })),
            remove: jest.fn().mockResolvedValue(undefined),
          },
        },
      ],
    }).compile();

    service = module.get<TaskService>(TaskService);
    repository = module.get<Repository<Task>>(getRepositoryToken(Task));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createTask', () => {
    it('should create a task successfully', async () => {
      const createTaskDto = {
        title: 'Test Task',
        description: 'Test Description',
        priority: TaskPriority.MEDIUM,
      };

      const result = await service.createTask(createTaskDto, mockUser);
      expect(result).toEqual(mockTask);
    });

    it('should throw ForbiddenException when user lacks permission', async () => {
      const userWithoutPermission = { ...mockUser, hasPermission: () => false };
      const createTaskDto = {
        title: 'Test Task',
        description: 'Test Description',
        priority: TaskPriority.MEDIUM,
      };

      await expect(service.createTask(createTaskDto, userWithoutPermission)).rejects.toThrow(
        ForbiddenException
      );
    });
  });

  describe('getTasks', () => {
    it('should return all tasks for admin user', async () => {
      const result = await service.getTasks(mockUser);
      expect(result).toEqual([mockTask]);
    });

    it('should throw ForbiddenException when user lacks permission', async () => {
      const userWithoutPermission = { ...mockUser, hasPermission: () => false };
      await expect(service.getTasks(userWithoutPermission)).rejects.toThrow(
        ForbiddenException
      );
    });
  });

  describe('getTaskById', () => {
    it('should return a task by id', async () => {
      const result = await service.getTaskById('1', mockUser);
      expect(result).toEqual(mockTask);
    });

    it('should throw NotFoundException when task not found', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValue(null);
      await expect(service.getTaskById('1', mockUser)).rejects.toThrow(
        NotFoundException
      );
    });
  });

  describe('updateTask', () => {
    it('should update a task successfully', async () => {
      const updateTaskDto = {
        title: 'Updated Task',
        status: TaskStatus.IN_PROGRESS,
      };

      const result = await service.updateTask('1', updateTaskDto, mockUser);
      expect(result).toEqual(mockTask);
    });

    it('should throw ForbiddenException when user lacks permission', async () => {
      const userWithoutPermission = { ...mockUser, hasPermission: () => false };
      const updateTaskDto = {
        title: 'Updated Task',
      };

      await expect(
        service.updateTask('1', updateTaskDto, userWithoutPermission)
      ).rejects.toThrow(ForbiddenException);
    });
  });

  describe('deleteTask', () => {
    it('should delete a task successfully', async () => {
      await expect(service.deleteTask('1', mockUser)).resolves.not.toThrow();
    });

    it('should throw ForbiddenException when user lacks permission', async () => {
      const userWithoutPermission = { ...mockUser, hasPermission: () => false };
      await expect(service.deleteTask('1', userWithoutPermission)).rejects.toThrow(
        ForbiddenException
      );
    });
  });
});
