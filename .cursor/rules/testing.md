# Testing Standards

## Testing Framework

- Use Jest as the primary testing framework
- Use `@nestjs/testing` for NestJS-specific testing utilities
- Use `supertest` for API endpoint testing

## Test Types

- **Unit Tests**: Test individual functions and classes in isolation
- **Integration Tests**: Test interactions between components
- **E2E Tests**: Test complete API endpoints and workflows
- **Performance Tests**: Test system performance under load (for critical paths)

## Test Coverage

- Aim for at least 80% code coverage
- Focus on testing business logic and edge cases
- All services should have unit tests
- All API endpoints should have integration tests

## Test Organization

- Place tests in a `__tests__` directory next to the code being tested
- Name test files with `.spec.ts` suffix
- Group related tests with `describe` blocks
- Use clear test descriptions with `it` or `test` functions

## Test Data

- Use factories or fixtures for test data
- Avoid hardcoded test data
- Clean up test data after tests
- Use in-memory databases for unit tests when possible
- Use test containers for integration tests

## Mocking

- Mock external dependencies in unit tests
- Use Jest's mocking capabilities
- Create dedicated mock files for complex dependencies
- Avoid mocking database in integration tests

## CI Integration

- Run tests automatically on pull requests
- Fail CI if tests fail
- Generate and store test coverage reports
- Run linting checks alongside tests

## Best Practices

- Keep tests fast and independent
- Follow the AAA pattern (Arrange, Act, Assert)
- One assertion per test when possible
- Test both success and failure cases
- Test edge cases and boundary conditions
