/**
 * User test data factory
 *
 * This factory provides methods to create test user data for unit and integration tests.
 */

export interface UserData {
  id: string;
  email: string;
  password: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserWithoutPassword {
  id: string;
  email: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserDto {
  email: string;
  password: string;
  name: string;
}

export interface LoginDto {
  email: string;
  password: string;
}

/**
 * Creates a mock user with default values
 */
export const createMockUser = (
  overrides: Partial<UserData> = {},
): UserData => ({
  id: 'user-123',
  email: 'test@example.com',
  password: 'hashed-password',
  name: 'Test User',
  createdAt: new Date(),
  updatedAt: new Date(),
  ...overrides,
});

/**
 * Creates a user without password
 */
export const createMockUserWithoutPassword = (
  overrides: Partial<UserWithoutPassword> = {},
): UserWithoutPassword => {
  const user = createMockUser();
  const { password, ...userWithoutPassword } = user;
  return {
    ...userWithoutPassword,
    ...overrides,
  };
};

/**
 * Creates a user DTO for registration
 */
export const createRegisterDto = (
  overrides: Partial<UserDto> = {},
): UserDto => ({
  email: 'test@example.com',
  password: 'password123',
  name: 'Test User',
  ...overrides,
});

/**
 * Creates a login DTO
 */
export const createLoginDto = (
  overrides: Partial<LoginDto> = {},
): LoginDto => ({
  email: 'test@example.com',
  password: 'password123',
  ...overrides,
});

/**
 * Creates a mock auth response
 */
export const createMockAuthResponse = (
  user = createMockUserWithoutPassword(),
) => ({
  access_token: 'test-token',
  user: {
    id: user.id,
    email: user.email,
    name: user.name,
  },
});
