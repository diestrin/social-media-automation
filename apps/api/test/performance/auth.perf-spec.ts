/**
 * Performance tests for auth endpoints
 */
import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../../src/app.module';
import { PrismaService } from '../../src/prisma/prisma.service';
import { createRegisterDto, createLoginDto } from '../factories/user.factory';
import { createTestApp, cleanupDatabase } from '../helpers/test-utils';

describe('Auth Performance Tests', () => {
  let app: INestApplication;
  let prisma: PrismaService;

  beforeAll(async () => {
    // Setup test environment
    const moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = await createTestApp(moduleFixture);
    prisma = moduleFixture.get<PrismaService>(PrismaService);

    // Create a test user for login tests
    const registerDto = createRegisterDto();
    await request(app.getHttpServer()).post('/auth/register').send(registerDto);
  });

  afterAll(async () => {
    await cleanupDatabase(prisma);
    await app.close();
  });

  it('should handle multiple login requests efficiently', async () => {
    // Arrange
    const loginDto = createLoginDto();
    const numRequests = 50;
    const startTime = Date.now();

    // Act
    const requests = Array(numRequests)
      .fill(0)
      .map(() =>
        request(app.getHttpServer())
          .post('/auth/login')
          .send(loginDto)
          .expect(201),
      );

    await Promise.all(requests);
    const endTime = Date.now();

    // Assert
    const totalTime = endTime - startTime;
    const avgTime = totalTime / numRequests;

    console.log(`Total time for ${numRequests} requests: ${totalTime}ms`);
    console.log(`Average time per request: ${avgTime}ms`);

    // This is a basic performance assertion - adjust based on your requirements
    expect(avgTime).toBeLessThan(150); // Average request should be under 50ms
  });

  it('should handle concurrent registration requests', async () => {
    // Arrange
    const numRequests = 10;
    const startTime = Date.now();

    // Act
    const requests = Array(numRequests)
      .fill(0)
      .map((_, i) =>
        request(app.getHttpServer())
          .post('/auth/register')
          .send(
            createRegisterDto({
              email: `perf-test-${i}@example.com`,
              name: `Performance Test User ${i}`,
            }),
          )
          .expect(201),
      );

    await Promise.all(requests);
    const endTime = Date.now();

    // Assert
    const totalTime = endTime - startTime;
    const avgTime = totalTime / numRequests;

    console.log(
      `Total time for ${numRequests} concurrent registrations: ${totalTime}ms`,
    );
    console.log(`Average time per registration: ${avgTime}ms`);

    // This is a basic performance assertion - adjust based on your requirements
    expect(avgTime).toBeLessThan(100); // Average registration should be under 100ms
  });
});
