import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import {
  createMockUserWithoutPassword,
  createMockAuthResponse,
  createLoginDto,
} from '../../test/factories/user.factory';
import { Response } from 'express';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: AuthService;

  beforeEach(async () => {
    // Follow AAA pattern - Arrange
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: {
            login: jest.fn(),
            register: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('login', () => {
    it('should return access token and user data', async () => {
      // Arrange
      const mockUser = createMockUserWithoutPassword();
      const mockAuthResponse = createMockAuthResponse(mockUser);
      const loginDto = createLoginDto();
      const req = { user: mockUser };
      const mockResponse = {
        cookie: jest.fn(),
      } as unknown as Response;

      jest.spyOn(authService, 'login').mockResolvedValue(mockAuthResponse);

      // Act
      const result = await controller.login(req, loginDto, mockResponse);

      // Assert
      expect(result).toEqual(mockAuthResponse);
      expect(authService.login).toHaveBeenCalledWith(mockUser);
      expect(mockResponse.cookie).toHaveBeenCalledWith(
        'auth_token',
        mockAuthResponse.access_token,
        expect.any(Object),
      );
    });
  });

  describe('register', () => {
    it('should create a new user and return access token', async () => {
      // Arrange
      const mockUser = createMockUserWithoutPassword();
      const mockAuthResponse = createMockAuthResponse(mockUser);
      const registerDto = {
        email: 'test@example.com',
        password: 'password123',
        name: 'Test User',
      };
      const mockResponse = {
        cookie: jest.fn(),
      } as unknown as Response;

      jest.spyOn(authService, 'register').mockResolvedValue(mockAuthResponse);

      // Act
      const result = await controller.register(registerDto, mockResponse);

      // Assert
      expect(result).toEqual(mockAuthResponse);
      expect(authService.register).toHaveBeenCalledWith(
        registerDto.email,
        registerDto.password,
        registerDto.name,
      );
      expect(mockResponse.cookie).toHaveBeenCalledWith(
        'auth_token',
        mockAuthResponse.access_token,
        expect.any(Object),
      );
    });
  });

  describe('logout', () => {
    it('should clear the auth_token cookie', async () => {
      // Arrange
      const mockResponse = {
        clearCookie: jest.fn(),
      } as unknown as Response;

      // Act
      const result = await controller.logout(mockResponse);

      // Assert
      expect(result).toEqual({ message: 'Logged out successfully' });
      expect(mockResponse.clearCookie).toHaveBeenCalledWith('auth_token');
    });
  });
});
