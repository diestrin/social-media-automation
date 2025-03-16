# Social Media Automation Web App

This is the admin dashboard for the Social Media Automation project. It provides a user interface for managing social media accounts, content creation, scheduling, and analytics.

## Features

- Dashboard with key metrics
- Social media account management
- Content creation and scheduling
- Content approval workflow
- Analytics and reporting

## Tech Stack

- Next.js 14
- React 18
- TypeScript
- Chakra UI for styling
- SWR for data fetching
- React Hook Form for form handling

## Getting Started

### Prerequisites

- Node.js 18+ (as specified in the root .nvmrc)
- Yarn package manager

### Installation

The web app is part of a monorepo. To install dependencies:

```bash
# From the root of the monorepo
yarn install
```

### Development

To run the development server:

```bash
# From the root of the monorepo
yarn web:dev

# Or from the web directory
cd apps/web
yarn dev
```

Open [http://localhost:3001](http://localhost:3001) with your browser to see the result.

### Building for Production

```bash
# From the root of the monorepo
cd apps/web
yarn build
```

## Project Structure

```
web/
├── src/
│   ├── app/              # Next.js App Router
│   ├── components/       # React components
│   └── lib/              # Utility functions and hooks
├── public/               # Static assets
├── package.json          # Dependencies and scripts
└── tsconfig.json         # TypeScript configuration
```

## API Integration

The web app communicates with the backend API for data fetching and mutations. The API endpoints are defined in the API project.
