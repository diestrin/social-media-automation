/**
 * Mock implementation for PrismaService
 */

// Create a type-safe mock that can be used with jest's mockResolvedValue
const createMockFunction = () => {
  const fn = jest.fn();
  fn.mockResolvedValue = jest.fn().mockImplementation((value) => {
    fn.mockImplementation(() => Promise.resolve(value));
    return fn;
  });
  return fn;
};

export const createPrismaMock = () => ({
  user: {
    findUnique: createMockFunction(),
    findMany: createMockFunction(),
    create: createMockFunction(),
    update: createMockFunction(),
    delete: createMockFunction(),
    deleteMany: createMockFunction(),
  },
  account: {
    findUnique: createMockFunction(),
    findMany: createMockFunction(),
    create: createMockFunction(),
    update: createMockFunction(),
    delete: createMockFunction(),
    deleteMany: createMockFunction(),
  },
  post: {
    findUnique: createMockFunction(),
    findMany: createMockFunction(),
    create: createMockFunction(),
    update: createMockFunction(),
    delete: createMockFunction(),
    deleteMany: createMockFunction(),
  },
  // Add other models as needed
  $transaction: jest.fn((callback) => callback()),
  $connect: jest.fn(),
  $disconnect: jest.fn(),
});
