# Git Workflow

## Branch Strategy

- `main` branch is the production-ready code
- `develop` branch is the integration branch for features
- Feature branches are created from `develop`
- Branch naming convention:
  - `feature/feature-name`
  - `fix/bug-name`
  - `chore/task-name`
  - `docs/documentation-name`

## Commit Guidelines

- Follow conventional commits format:
  - `feat:` for new features
  - `fix:` for bug fixes
  - `docs:` for documentation changes
  - `style:` for formatting changes
  - `refactor:` for code refactoring
  - `test:` for adding or modifying tests
  - `chore:` for maintenance tasks
- Keep commits small and focused
- Write descriptive commit messages
- Reference issue numbers in commit messages when applicable

## Pull Requests

- Create a pull request for each feature or fix
- Use the PR template
- Require at least one code review before merging
- Squash commits before merging to main
- Delete branches after merging

## Code Reviews

- Review code for correctness, style, and performance
- Use inline comments for specific feedback
- Approve only when all comments are addressed
- Be constructive and respectful in feedback
- Focus on the code, not the person

## Continuous Integration

- All PRs must pass CI checks before merging
- CI checks include:
  - Linting
  - Type checking
  - Unit tests
  - Integration tests
  - Build verification

## Release Process

- Tag releases with semantic versioning
- Generate release notes from conventional commits
- Create a release branch for each release
- Hotfixes are applied directly to release branches
- Merge hotfixes back to develop and main
