# Code Style and Formatting

## TypeScript Guidelines

- Use TypeScript for all code
- Follow ESLint and Prettier configurations
- Use 2 spaces for indentation
- Maximum line length of 100 characters
- Use single quotes for strings
- Use semicolons at the end of statements
- Use PascalCase for class names and interfaces
- Use camelCase for variables, functions, and methods
- Use UPPER_SNAKE_CASE for constants
- Add JSDoc comments for public APIs and complex functions

## NestJS Conventions

- Follow the NestJS module structure
- Use decorators as recommended by NestJS documentation
- Implement proper dependency injection
- Use providers for services
- Use controllers for handling HTTP requests
- Use guards for authentication and authorization
- Use interceptors for cross-cutting concerns
- Use pipes for input validation and transformation

## File Organization

- One class per file
- File names should match the class name (e.g., `user.service.ts` for `UserService`)
- Group related files in directories
- Use barrel files (index.ts) for exporting multiple files from a directory
- Keep files small and focused on a single responsibility

## Import Order

1. Node.js built-in modules
2. External libraries and frameworks
3. Internal modules (absolute imports)
4. Internal modules (relative imports)
5. Type imports

## Error Handling

- Use custom exception filters for API errors
- Provide meaningful error messages
- Log errors with appropriate severity levels
- Handle async errors with try/catch or Promise chaining
- Return appropriate HTTP status codes for API errors
