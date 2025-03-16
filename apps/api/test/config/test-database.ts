/**
 * Test database configuration
 *
 * This file provides configuration for test databases
 */

import { PrismaService } from '../../src/prisma/prisma.service';

/**
 * Creates an in-memory database for unit tests
 */
export const createInMemoryDatabase = (): PrismaService => {
  // This is a mock implementation for unit tests
  // In a real implementation, you might use SQLite in-memory or a test container
  const prismaService = new PrismaService();

  // Override the connection URL to use an in-memory database
  // This is just a placeholder - actual implementation would depend on your setup
  (prismaService as any).$connect = jest.fn().mockResolvedValue(undefined);
  (prismaService as any).$disconnect = jest.fn().mockResolvedValue(undefined);

  return prismaService;
};

/**
 * Creates a test database for integration tests
 *
 * This should be used with test containers or a dedicated test database
 */
export const createTestDatabase = async (): Promise<PrismaService> => {
  const prismaService = new PrismaService();

  // Connect to the test database
  await prismaService.$connect();

  return prismaService;
};
