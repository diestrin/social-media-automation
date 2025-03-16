import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';
import { AccountType } from '../src/accounts/dto/account.dto';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { cleanupDatabase } from './helpers/test-utils';

describe('AccountController (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let jwtService: JwtService;

  // Generate a unique email for each test run to avoid unique constraint violations
  const uniqueId = Date.now().toString();
  const mockUser = {
    email: `test-${uniqueId}@example.com`,
    name: 'Test User',
    password: 'password123',
  };
  let userId: string;

  const mockAccount = {
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

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        transform: true,
      }),
    );

    prisma = app.get<PrismaService>(PrismaService);
    jwtService = app.get<JwtService>(JwtService);

    await app.init();
  });

  beforeEach(async () => {
    try {
      // Hash the password before creating the user
      const hashedPassword = await bcrypt.hash(mockUser.password, 10);
      const user = await prisma.user.create({
        data: {
          ...mockUser,
          password: hashedPassword,
        },
      });
      userId = user.id;
    } catch (error) {
      throw error; // Re-throw to fail the test if user creation fails
    }

    // Clean up only accounts for this specific user
    await prisma.account.deleteMany({
      where: {
        userId,
      },
    });
  });

  afterEach(async () => {
    // Clean up all test data for this specific test
    await cleanupDatabase(prisma, {
      userId,
      email: mockUser.email,
    });
  });

  afterAll(async () => {
    await app.close();
  });

  describe('/accounts (POST)', () => {
    it('should create a new account', async () => {
      // Generate JWT token with the correct payload structure
      const token = jwtService.sign({ id: userId, email: mockUser.email });

      const response = await request(app.getHttpServer())
        .post('/accounts')
        .set('Authorization', `Bearer ${token}`)
        .send(mockAccount)
        .expect(201);

      expect(response.body).toMatchObject({
        type: mockAccount.type,
        name: mockAccount.name,
        description: mockAccount.description,
        goals: mockAccount.goals,
        interests: mockAccount.interests,
      });

      // Verify credentials are masked
      expect(response.body.credentials.apiKey).toMatch(/^.{4}\.\.\..{4}$/);
    });

    it('should validate required fields', async () => {
      // Generate JWT token with the correct payload structure
      const token = jwtService.sign({ id: userId, email: mockUser.email });

      await request(app.getHttpServer())
        .post('/accounts')
        .set('Authorization', `Bearer ${token}`)
        .send({})
        .expect(400);
    });
  });

  describe('/accounts (GET)', () => {
    it('should return all accounts for the user', async () => {
      // Generate JWT token with the correct payload structure
      const token = jwtService.sign({ id: userId, email: mockUser.email });

      // Create test account
      const account = await prisma.account.create({
        data: {
          ...mockAccount,
          userId,
          contentPreferences: {},
        },
      });

      const response = await request(app.getHttpServer())
        .get('/accounts')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(response.body).toHaveLength(1);
      expect(response.body[0]).toMatchObject({
        id: account.id,
        type: account.type,
        name: account.name,
      });
    });

    it('should filter accounts by type', async () => {
      // Generate JWT token with the correct payload structure
      const token = jwtService.sign({ id: userId, email: mockUser.email });

      // Create test accounts
      await prisma.account.create({
        data: {
          ...mockAccount,
          userId,
          contentPreferences: {},
        },
      });

      const response = await request(app.getHttpServer())
        .get('/accounts')
        .query({ type: AccountType.TWITTER })
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(response.body).toHaveLength(1);
      expect(response.body[0].type).toBe(AccountType.TWITTER);
    });
  });

  describe('/accounts/:id (GET)', () => {
    it('should return a single account', async () => {
      // Generate JWT token with the correct payload structure
      const token = jwtService.sign({ id: userId, email: mockUser.email });

      const account = await prisma.account.create({
        data: {
          ...mockAccount,
          userId,
          contentPreferences: {},
        },
      });

      const response = await request(app.getHttpServer())
        .get(`/accounts/${account.id}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(response.body).toMatchObject({
        id: account.id,
        type: account.type,
        name: account.name,
      });
    });

    it('should return 404 for non-existent account', async () => {
      // Generate JWT token with the correct payload structure
      const token = jwtService.sign({ id: userId, email: mockUser.email });

      await request(app.getHttpServer())
        .get('/accounts/non-existent-id')
        .set('Authorization', `Bearer ${token}`)
        .expect(404);
    });
  });

  describe('/accounts/:id (PATCH)', () => {
    it('should update an account', async () => {
      // Generate JWT token with the correct payload structure
      const token = jwtService.sign({ id: userId, email: mockUser.email });

      const account = await prisma.account.create({
        data: {
          ...mockAccount,
          userId,
          contentPreferences: {},
        },
      });

      const updateData = {
        name: 'Updated Name',
        description: 'Updated Description',
      };

      const response = await request(app.getHttpServer())
        .patch(`/accounts/${account.id}`)
        .set('Authorization', `Bearer ${token}`)
        .send(updateData)
        .expect(200);

      expect(response.body).toMatchObject(updateData);
    });
  });

  describe('/accounts/:id (DELETE)', () => {
    it('should delete an account', async () => {
      // Generate JWT token with the correct payload structure
      const token = jwtService.sign({ id: userId, email: mockUser.email });

      const account = await prisma.account.create({
        data: {
          ...mockAccount,
          userId,
          contentPreferences: {},
        },
      });

      await request(app.getHttpServer())
        .delete(`/accounts/${account.id}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      const deletedAccount = await prisma.account.findUnique({
        where: { id: account.id },
      });
      expect(deletedAccount).toBeNull();
    });
  });

  describe('/accounts/:id/verify (POST)', () => {
    it('should verify account credentials', async () => {
      // Generate JWT token with the correct payload structure
      const token = jwtService.sign({ id: userId, email: mockUser.email });

      const account = await prisma.account.create({
        data: {
          ...mockAccount,
          userId,
          contentPreferences: {},
        },
      });

      await request(app.getHttpServer())
        .post(`/accounts/${account.id}/verify`)
        .set('Authorization', `Bearer ${token}`)
        .expect(201);
    });

    it('should return 404 for non-existent account', async () => {
      // Generate JWT token with the correct payload structure
      const token = jwtService.sign({ id: userId, email: mockUser.email });

      await request(app.getHttpServer())
        .post('/accounts/non-existent-id/verify')
        .set('Authorization', `Bearer ${token}`)
        .expect(404);
    });
  });
});
