import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import { AuthService } from './auth.service';
import { User } from '../users/user.entity';
import { UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

jest.mock('bcrypt');

describe('AuthService', () => {
  let service: AuthService;
  let repository: Repository<User>;
  let jwtService: JwtService;

  const mockUser: User = {
    id: '1',
    email: 'test@example.com',
    firstName: 'Test',
    lastName: 'User',
    password: 'hashedPassword',
    roles: [],
    assignedTasks: [],
    createdTasks: [],
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
    hasPermission: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: getRepositoryToken(User),
          useValue: {
            findOne: jest.fn().mockResolvedValue(mockUser),
            create: jest.fn().mockReturnValue(mockUser),
            save: jest.fn().mockResolvedValue(mockUser),
          },
        },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn().mockReturnValue('test-token'),
          },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    repository = module.get<Repository<User>>(getRepositoryToken(User));
    jwtService = module.get<JwtService>(JwtService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('validateUser', () => {
    it('should return user object when credentials are valid', async () => {
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      const result = await service.validateUser('test@example.com', 'password');
      expect(result).toBeDefined();
      expect(result.password).toBeUndefined();
    });

    it('should return null when user is not found', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValue(null);
      const result = await service.validateUser('test@example.com', 'password');
      expect(result).toBeNull();
    });

    it('should return null when password is invalid', async () => {
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);
      const result = await service.validateUser('test@example.com', 'wrongpassword');
      expect(result).toBeNull();
    });
  });

  describe('login', () => {
    it('should return access token and user data', async () => {
      const result = await service.login(mockUser);
      expect(result.access_token).toBeDefined();
      expect(result.user).toBeDefined();
      expect(result.user.password).toBeUndefined();
      expect(jwtService.sign).toHaveBeenCalled();
    });
  });

  describe('register', () => {
    it('should create a new user successfully', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValue(null);
      (bcrypt.hash as jest.Mock).mockResolvedValue('hashedPassword');

      const result = await service.register(
        'new@example.com',
        'password',
        'New',
        'User'
      );

      expect(result).toBeDefined();
      expect(result.password).toBeUndefined();
      expect(repository.create).toHaveBeenCalled();
      expect(repository.save).toHaveBeenCalled();
    });

    it('should throw UnauthorizedException when email already exists', async () => {
      await expect(
        service.register('test@example.com', 'password', 'Test', 'User')
      ).rejects.toThrow(UnauthorizedException);
    });
  });
});
