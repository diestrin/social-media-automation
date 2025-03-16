/**
 * Mock implementation for bcrypt
 */

export const compare = jest.fn();
export const hash = jest.fn();
export const genSalt = jest.fn();

// Reset all mocks before each test
beforeEach(() => {
  compare.mockReset();
  hash.mockReset();
  genSalt.mockReset();
});
