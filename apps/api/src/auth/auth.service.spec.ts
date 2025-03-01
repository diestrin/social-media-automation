import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { ConflictException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';

jest.mock('bcrypt');

describe('AuthService', () => {
  let service: AuthService;
  let prisma: PrismaService;
  let jwtService: JwtService;

  const mockUser = {
    id: 'user-123',
    email: 'test@example.com',
    name: 'Test User',
    password: 'hashed-password',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: PrismaService,
          useValue: {
            user: {
              findUnique: jest.fn(),
              create: jest.fn(),
            },
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
    prisma = module.get<PrismaService>(PrismaService);
    jwtService = module.get<JwtService>(JwtService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('validateUser', () => {
    it('should return user without password if credentials are valid', async () => {
      const { password, ...userWithoutPassword } = mockUser;
      jest.spyOn(prisma.user, 'findUnique').mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);

      const result = await service.validateUser(
        'test@example.com',
        'password123',
      );
      expect(result).toEqual(userWithoutPassword);
    });

    it('should return null if user is not found', async () => {
      jest.spyOn(prisma.user, 'findUnique').mockResolvedValue(null);

      const result = await service.validateUser(
        'test@example.com',
        'password123',
      );
      expect(result).toBeNull();
    });

    it('should return null if password is invalid', async () => {
      jest.spyOn(prisma.user, 'findUnique').mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      const result = await service.validateUser(
        'test@example.com',
        'wrong-password',
      );
      expect(result).toBeNull();
    });
  });

  describe('login', () => {
    it('should return access token and user data', async () => {
      const { password, ...userWithoutPassword } = mockUser;
      const result = await service.login(userWithoutPassword);

      expect(result).toEqual({
        access_token: 'test-token',
        user: {
          id: userWithoutPassword.id,
          email: userWithoutPassword.email,
          name: userWithoutPassword.name,
        },
      });
      expect(jwtService.sign).toHaveBeenCalledWith({
        email: userWithoutPassword.email,
        sub: userWithoutPassword.id,
      });
    });
  });

  describe('register', () => {
    it('should create a new user and return access token', async () => {
      jest.spyOn(prisma.user, 'findUnique').mockResolvedValue(null);
      jest.spyOn(prisma.user, 'create').mockResolvedValue(mockUser);
      (bcrypt.hash as jest.Mock).mockResolvedValue('hashed-password');

      const result = await service.register(
        'test@example.com',
        'password123',
        'Test User',
      );

      expect(prisma.user.create).toHaveBeenCalledWith({
        data: {
          email: 'test@example.com',
          password: 'hashed-password',
          name: 'Test User',
        },
      });
      expect(result).toEqual({
        access_token: 'test-token',
        user: {
          id: mockUser.id,
          email: mockUser.email,
          name: mockUser.name,
        },
      });
    });

    it('should throw ConflictException if email already exists', async () => {
      jest.spyOn(prisma.user, 'findUnique').mockResolvedValue(mockUser);

      await expect(
        service.register('test@example.com', 'password123', 'Test User'),
      ).rejects.toThrow(ConflictException);
    });
  });
});
