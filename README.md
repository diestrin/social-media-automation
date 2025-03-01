# Social Media Automation Platform

An AI-powered social media automation platform that helps manage multiple social media accounts with automated content generation and scheduling capabilities.

## Features

- Multi-account social media management
- AI-powered content generation
- Content approval workflow
- Automated posting
- Analytics and insights (coming soon)

## Prerequisites

- Node.js (v18 or later)
- Yarn
- Docker and Docker Compose
- Twitter Developer Account (for API access)

## Getting Started

1. Clone the repository:
   ```bash
   git clone [repository-url]
   cd social-media-automation
   ```

2. Install dependencies:
   ```bash
   yarn install
   ```

3. Start the development environment:
   ```bash
   docker-compose up -d
   ```

4. Create a `.env` file in the `apps/api` directory:
   ```env
   # Database
   DATABASE_URL=postgresql://social_media:development_only@localhost:5432/social_media
   
   # Redis
   REDIS_URL=redis://localhost:6379
   
   # Twitter API (Replace with your credentials)
   TWITTER_API_KEY=your_api_key
   TWITTER_API_SECRET=your_api_secret
   TWITTER_ACCESS_TOKEN=your_access_token
   TWITTER_ACCESS_TOKEN_SECRET=your_access_token_secret
   
   # OpenAI (Replace with your API key)
   OPENAI_API_KEY=your_openai_api_key
   ```

5. Start the API development server:
   ```bash
   yarn api:dev
   ```

## Project Structure

- `apps/api`: NestJS backend application
- `apps/web`: Web frontend (coming soon)
- `libs/`: Shared libraries and modules
- `docs/`: Project documentation
- `docker/`: Docker configurations
- `config/`: Configuration files

## Development

- Run API in development mode: `yarn api:dev`
- Run tests: `yarn test`
- Format code: `yarn format`
- Lint code: `yarn lint`

## Documentation

For detailed documentation about the project architecture and development plans, see [PROJECT_PLAN.md](docs/PROJECT_PLAN.md).

## Contributing

1. Create a feature branch
2. Commit your changes
3. Push to the branch
4. Create a Pull Request

## License

This project is private and proprietary. 