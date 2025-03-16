import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import {
  createMockUserWithoutPassword,
  createMockAuthResponse,
  createLoginDto,
} from '../../test/factories/user.factory';

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
      jest.spyOn(authService, 'login').mockResolvedValue(mockAuthResponse);

      // Act
      const result = await controller.login(req, loginDto);

      // Assert
      expect(result).toEqual(mockAuthResponse);
      expect(authService.login).toHaveBeenCalledWith(mockUser);
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
      jest.spyOn(authService, 'register').mockResolvedValue(mockAuthResponse);

      // Act
      const result = await controller.register(registerDto);

      // Assert
      expect(result).toEqual(mockAuthResponse);
      expect(authService.register).toHaveBeenCalledWith(
        registerDto.email,
        registerDto.password,
        registerDto.name,
      );
    });
  });
});
