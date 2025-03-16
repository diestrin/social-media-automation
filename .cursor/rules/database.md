# Database Guidelines

## Schema Design

- Use snake_case for table and column names
- Use singular names for tables (e.g., `user` not `users`)
- Define primary keys for all tables
- Use foreign keys to enforce relationships
- Add appropriate indexes for performance
- Use appropriate data types for columns
- Include created_at and updated_at timestamps for all tables
- Use soft deletes (deleted_at) where appropriate

## TypeORM Usage

- Use TypeORM entities to define database schema
- Use TypeORM migrations for schema changes
- Use TypeORM repositories for database operations
- Use QueryBuilder for complex queries
- Use transactions for operations that modify multiple tables
- Use eager loading to avoid N+1 query problems
- Use lazy loading for large relationships

## Migrations

- Create migration files for all schema changes
- Name migrations descriptively (e.g., `create-user-table.ts`)
- Test migrations before applying to production
- Include both up and down methods for reversibility
- Keep migrations small and focused
- Document complex migrations

## Performance

- Add appropriate indexes for frequently queried columns
- Use pagination for large result sets
- Optimize queries for performance
- Monitor query performance
- Use caching for frequently accessed data
- Avoid N+1 query problems

## Data Integrity

- Use constraints to enforce data integrity
- Validate data before inserting or updating
- Use transactions for multi-step operations
- Implement proper error handling for database operations
- Use optimistic locking for concurrent updates

## Security

- Use parameterized queries to prevent SQL injection
- Encrypt sensitive data
- Implement row-level security where needed
- Use least privilege principle for database users
- Regularly backup database

## Testing

- Use test databases for testing
- Use test containers for integration tests
- Clean up test data after tests
- Test database migrations
- Test database performance
