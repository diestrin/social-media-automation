import { Test, TestingModule } from '@nestjs/testing';
import { AccountController } from './account.controller';
import { AccountService } from './account.service';
import { AccountType } from './dto/account.dto';

describe('AccountController', () => {
  let controller: AccountController;
  let service: AccountService;

  const mockUserId = 'user-123';
  const mockAccount = {
    id: 'account-123',
    type: AccountType.TWITTER,
    name: 'Test Account',
    description: 'Test Description',
    goals: ['Increase engagement'],
    interests: ['Technology'],
    credentials: {
      apiKey: 'test-api-key',
      apiSecret: 'test-api-secret',
      accessToken: 'test-access-token',
      accessTokenSecret: 'test-access-token-secret',
    },
    postFrequency: 3,
    bestTimeToPost: ['09:00', '15:00'],
    contentPreferences: {},
    isActive: true,
    userId: mockUserId,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockRequest = {
    user: { id: mockUserId },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AccountController],
      providers: [
        {
          provide: AccountService,
          useValue: {
            create: jest.fn(),
            findAll: jest.fn(),
            findOne: jest.fn(),
            update: jest.fn(),
            remove: jest.fn(),
            verifyCredentials: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<AccountController>(AccountController);
    service = module.get<AccountService>(AccountService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a new account', async () => {
      const createDto = {
        type: AccountType.TWITTER,
        name: 'Test Account',
        description: 'Test Description',
        goals: ['Increase engagement'],
        interests: ['Technology'],
        credentials: {
          apiKey: 'test-api-key',
          apiSecret: 'test-api-secret',
          accessToken: 'test-access-token',
          accessTokenSecret: 'test-access-token-secret',
        },
        postFrequency: 3,
        bestTimeToPost: ['09:00', '15:00'],
      };

      jest.spyOn(service, 'create').mockResolvedValue(mockAccount);

      const result = await controller.create(mockRequest, createDto);

      expect(service.create).toHaveBeenCalledWith(mockUserId, createDto);
      expect(result).toEqual(mockAccount);
    });
  });

  describe('findAll', () => {
    it('should return all accounts', async () => {
      jest.spyOn(service, 'findAll').mockResolvedValue([mockAccount]);

      const result = await controller.findAll(mockRequest);

      expect(service.findAll).toHaveBeenCalledWith(mockUserId, undefined);
      expect(result).toEqual([mockAccount]);
    });

    it('should filter accounts by type', async () => {
      jest.spyOn(service, 'findAll').mockResolvedValue([mockAccount]);

      const result = await controller.findAll(mockRequest, AccountType.TWITTER);

      expect(service.findAll).toHaveBeenCalledWith(
        mockUserId,
        AccountType.TWITTER,
      );
      expect(result).toEqual([mockAccount]);
    });
  });

  describe('findOne', () => {
    it('should return a single account', async () => {
      jest.spyOn(service, 'findOne').mockResolvedValue(mockAccount);

      const result = await controller.findOne(mockRequest, mockAccount.id);

      expect(service.findOne).toHaveBeenCalledWith(mockUserId, mockAccount.id);
      expect(result).toEqual(mockAccount);
    });
  });

  describe('update', () => {
    it('should update an account', async () => {
      const updateDto = {
        name: 'Updated Name',
        description: 'Updated Description',
      };

      jest.spyOn(service, 'update').mockResolvedValue({
        ...mockAccount,
        ...updateDto,
      });

      const result = await controller.update(
        mockRequest,
        mockAccount.id,
        updateDto,
      );

      expect(service.update).toHaveBeenCalledWith(
        mockUserId,
        mockAccount.id,
        updateDto,
      );
      expect(result).toEqual({
        ...mockAccount,
        ...updateDto,
      });
    });
  });

  describe('remove', () => {
    it('should delete an account', async () => {
      jest.spyOn(service, 'remove').mockResolvedValue(undefined);

      await controller.remove(mockRequest, mockAccount.id);

      expect(service.remove).toHaveBeenCalledWith(mockUserId, mockAccount.id);
    });
  });

  describe('verifyCredentials', () => {
    it('should verify account credentials', async () => {
      jest.spyOn(service, 'verifyCredentials').mockResolvedValue(true);

      const result = await controller.verifyCredentials(
        mockRequest,
        mockAccount.id,
      );

      expect(service.verifyCredentials).toHaveBeenCalledWith(
        mockUserId,
        mockAccount.id,
      );
      expect(result).toBe(true);
    });
  });
});
