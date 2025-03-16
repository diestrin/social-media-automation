import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException, BadRequestException } from '@nestjs/common';
import { AccountService } from './account.service';
import { PrismaService } from '../prisma/prisma.service';
import { AccountType } from './dto/account.dto';

describe('AccountService', () => {
  let service: AccountService;
  let prisma: PrismaService;

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
    lastSyncAt: new Date(),
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AccountService,
        {
          provide: PrismaService,
          useValue: {
            account: {
              create: jest.fn(),
              findMany: jest.fn(),
              findFirst: jest.fn(),
              update: jest.fn(),
              delete: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    service = module.get<AccountService>(AccountService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
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

      jest.spyOn(prisma.account, 'create').mockResolvedValue(mockAccount);

      const result = await service.create(mockUserId, createDto);

      expect(prisma.account.create).toHaveBeenCalledWith({
        data: {
          userId: mockUserId,
          type: createDto.type,
          name: createDto.name,
          description: createDto.description,
          goals: createDto.goals,
          interests: createDto.interests,
          credentials: createDto.credentials,
          postFrequency: createDto.postFrequency,
          bestTimeToPost: createDto.bestTimeToPost,
          contentPreferences: {},
        },
      });

      expect(result).toEqual(
        expect.objectContaining({
          id: mockAccount.id,
          type: mockAccount.type,
          name: mockAccount.name,
        }),
      );

      // Verify credentials are masked
      expect(result.credentials.apiKey).toMatch(/^.{4}\.\.\..{4}$/);
    });
  });

  describe('findAll', () => {
    it('should return all accounts for a user', async () => {
      jest.spyOn(prisma.account, 'findMany').mockResolvedValue([mockAccount]);

      const result = await service.findAll(mockUserId);

      expect(prisma.account.findMany).toHaveBeenCalledWith({
        where: { userId: mockUserId },
      });
      expect(result).toHaveLength(1);
      expect(result[0]).toEqual(
        expect.objectContaining({
          id: mockAccount.id,
          type: mockAccount.type,
        }),
      );
    });

    it('should filter accounts by type', async () => {
      jest.spyOn(prisma.account, 'findMany').mockResolvedValue([mockAccount]);

      await service.findAll(mockUserId, AccountType.TWITTER);

      expect(prisma.account.findMany).toHaveBeenCalledWith({
        where: { userId: mockUserId, type: AccountType.TWITTER },
      });
    });
  });

  describe('findOne', () => {
    it('should return a single account', async () => {
      jest.spyOn(prisma.account, 'findFirst').mockResolvedValue(mockAccount);

      const result = await service.findOne(mockUserId, mockAccount.id);

      expect(prisma.account.findFirst).toHaveBeenCalledWith({
        where: { id: mockAccount.id, userId: mockUserId },
      });
      expect(result).toEqual(
        expect.objectContaining({
          id: mockAccount.id,
          type: mockAccount.type,
        }),
      );
    });

    it('should throw NotFoundException if account not found', async () => {
      jest.spyOn(prisma.account, 'findFirst').mockResolvedValue(null);

      await expect(
        service.findOne(mockUserId, 'non-existent-id'),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update an account', async () => {
      const updateDto = {
        name: 'Updated Name',
        description: 'Updated Description',
      };

      jest.spyOn(prisma.account, 'findFirst').mockResolvedValue(mockAccount);
      jest.spyOn(prisma.account, 'update').mockResolvedValue({
        ...mockAccount,
        ...updateDto,
      });

      const result = await service.update(
        mockUserId,
        mockAccount.id,
        updateDto,
      );

      expect(prisma.account.update).toHaveBeenCalledWith({
        where: { id: mockAccount.id },
        data: updateDto,
      });
      expect(result.name).toBe(updateDto.name);
      expect(result.description).toBe(updateDto.description);
    });

    it('should throw NotFoundException if account not found', async () => {
      jest.spyOn(prisma.account, 'findFirst').mockResolvedValue(null);

      await expect(
        service.update(mockUserId, 'non-existent-id', {}),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should delete an account', async () => {
      jest.spyOn(prisma.account, 'findFirst').mockResolvedValue(mockAccount);
      jest.spyOn(prisma.account, 'delete').mockResolvedValue(mockAccount);

      await service.remove(mockUserId, mockAccount.id);

      expect(prisma.account.delete).toHaveBeenCalledWith({
        where: { id: mockAccount.id },
      });
    });

    it('should throw NotFoundException if account not found', async () => {
      jest.spyOn(prisma.account, 'findFirst').mockResolvedValue(null);

      await expect(
        service.remove(mockUserId, 'non-existent-id'),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('verifyCredentials', () => {
    it('should verify Twitter credentials', async () => {
      jest.spyOn(prisma.account, 'findFirst').mockResolvedValue(mockAccount);

      const result = await service.verifyCredentials(
        mockUserId,
        mockAccount.id,
      );

      expect(result).toBe(true);
    });

    it('should throw NotFoundException if account not found', async () => {
      jest.spyOn(prisma.account, 'findFirst').mockResolvedValue(null);

      await expect(
        service.verifyCredentials(mockUserId, 'non-existent-id'),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw BadRequestException for unsupported account type', async () => {
      jest.spyOn(prisma.account, 'findFirst').mockResolvedValue({
        ...mockAccount,
        type: 'UNSUPPORTED' as AccountType,
      });

      await expect(
        service.verifyCredentials(mockUserId, mockAccount.id),
      ).rejects.toThrow(BadRequestException);
    });
  });
});
