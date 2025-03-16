/**
 * Setup for performance tests
 */

// Increase timeout for performance tests
jest.setTimeout(60000);

// Disable console output during tests to avoid cluttering test output
// Comment this out if you need to debug
const originalConsoleLog = console.log;
const originalConsoleError = console.error;
const originalConsoleWarn = console.warn;

if (process.env.PERF_TEST_SILENT !== 'false') {
  global.console.log = jest.fn();
  global.console.error = jest.fn();
  global.console.warn = jest.fn();
}

// Restore console after all tests
afterAll(() => {
  global.console.log = originalConsoleLog;
  global.console.error = originalConsoleError;
  global.console.warn = originalConsoleWarn;
});

// Add custom matchers for performance testing
expect.extend({
  toBeWithinRange(received, floor, ceiling) {
    const pass = received >= floor && received <= ceiling;
    if (pass) {
      return {
        message: () =>
          `expected ${received} not to be within range ${floor} - ${ceiling}`,
        pass: true,
      };
    } else {
      return {
        message: () =>
          `expected ${received} to be within range ${floor} - ${ceiling}`,
        pass: false,
      };
    }
  },
});
