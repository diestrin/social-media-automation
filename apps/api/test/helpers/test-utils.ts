/**
 * Test utilities for setting up tests
 */
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../../src/prisma/prisma.service';

/**
 * Creates a test application with standard configuration
 */
export const createTestApp = async (
  moduleFixture: TestingModule,
): Promise<INestApplication> => {
  const app = moduleFixture.createNestApplication();
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );
  await app.init();
  return app;
};

/**
 * Cleans up the database after tests
 */
export const cleanupDatabase = async (
  prisma: PrismaService,
  options?: { userId?: string; email?: string },
): Promise<void> => {
  // If options are provided, use them for targeted cleanup
  if (options) {
    if (options.userId) {
      await prisma.account.deleteMany({
        where: { userId: options.userId },
      });
    }

    if (options.email) {
      await prisma.user.deleteMany({
        where: { email: options.email },
      });
      return;
    }
  }

  // Otherwise, perform a general cleanup (use with caution in parallel tests)
  await prisma.account.deleteMany();
  await prisma.user.deleteMany();
  // Add other tables as needed
};

/**
 * Utility to create a test module with common providers
 */
export const createTestingModuleWithCommonProviders = async (
  imports: any[] = [],
  providers: any[] = [],
  controllers: any[] = [],
): Promise<TestingModule> => {
  return Test.createTestingModule({
    imports,
    providers,
    controllers,
  }).compile();
};
