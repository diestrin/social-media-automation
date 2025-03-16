import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';
import { createRegisterDto, createLoginDto } from './factories/user.factory';
import { createTestApp, cleanupDatabase } from './helpers/test-utils';

describe('AuthController (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  const uniqueId = Math.random().toString(36).substring(2, 15);

  beforeAll(async () => {
    // Setup test environment
    const moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = await createTestApp(moduleFixture);
    prisma = moduleFixture.get<PrismaService>(PrismaService);
  });

  beforeEach(async () => {
    // Clean up only test-specific data
    await cleanupDatabase(prisma, { email: `test-${uniqueId}@example.com` });
  });

  afterAll(async () => {
    // Clean up after all tests
    await cleanupDatabase(prisma);
    await app.close();
  });

  describe('/auth/register (POST)', () => {
    it('should register a new user', () => {
      // Arrange
      const registerDto = createRegisterDto({
        email: `test-${uniqueId}@example.com`,
      });

      // Act & Assert
      return request(app.getHttpServer())
        .post('/auth/register')
        .send(registerDto)
        .expect(201)
        .expect((res) => {
          expect(res.body).toHaveProperty('access_token');
          expect(res.body.user).toEqual({
            id: expect.any(String),
            email: registerDto.email,
            name: registerDto.name,
          });
        });
    });

    it('should fail if email is already registered', async () => {
      // Arrange
      const registerDto = createRegisterDto({
        email: `test-${uniqueId}@example.com`,
      });
      const duplicateDto = createRegisterDto({
        email: `test-${uniqueId}@example.com`,
        name: 'Another User',
      });

      // Act & Assert - First registration
      await request(app.getHttpServer())
        .post('/auth/register')
        .send(registerDto)
        .expect(201);

      // Act & Assert - Second registration with same email
      return request(app.getHttpServer())
        .post('/auth/register')
        .send(duplicateDto)
        .expect(409);
    });

    it('should fail with invalid data', () => {
      // Arrange
      const invalidDto = createRegisterDto({
        email: 'invalid-email',
        password: '123', // Too short
        name: '', // Empty name
      });

      // Act & Assert
      return request(app.getHttpServer())
        .post('/auth/register')
        .send(invalidDto)
        .expect(400);
    });
  });

  describe('/auth/login (POST)', () => {
    beforeEach(async () => {
      // Create a test user before login tests
      const registerDto = createRegisterDto({
        email: `test-${uniqueId}@example.com`,
      });
      await request(app.getHttpServer())
        .post('/auth/register')
        .send(registerDto);
    });

    it('should login successfully with valid credentials', () => {
      // Arrange
      const loginDto = createLoginDto({
        email: `test-${uniqueId}@example.com`,
      });

      // Act & Assert
      return request(app.getHttpServer())
        .post('/auth/login')
        .send(loginDto)
        .expect(201)
        .expect((res) => {
          expect(res.body).toHaveProperty('access_token');
          expect(res.body.user).toEqual({
            id: expect.any(String),
            email: loginDto.email,
            name: 'Test User',
          });
        });
    });

    it('should fail with invalid credentials', () => {
      // Arrange
      const invalidLoginDto = createLoginDto({
        email: `test-${uniqueId}@example.com`,
        password: 'wrong-password',
      });

      // Act & Assert
      return request(app.getHttpServer())
        .post('/auth/login')
        .send(invalidLoginDto)
        .expect(401);
    });

    it('should fail with non-existent user', () => {
      // Arrange
      const nonExistentUserDto = createLoginDto({
        email: 'nonexistent@example.com',
      });

      // Act & Assert
      return request(app.getHttpServer())
        .post('/auth/login')
        .send(nonExistentUserDto)
        .expect(401);
    });
  });
});
