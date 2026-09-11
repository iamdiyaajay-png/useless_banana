# Project Setup

This project uses Next.js and Prisma ORM with SQLite.

## Installation

```bash
# Install dependencies
npm install
```

## Database Migration & Seeding

Since we are using SQLite, no external database server is required.

```bash
# Apply migrations to the dev.db database
npx prisma db push

# Run the seed script to populate demo data
npx tsx prisma/seed.ts
```

## Running the Development Server

```bash
# Start Next.js development server
npm run dev
```

The application will be available at `http://localhost:3000`.

## Environment Variables

No required environment variables at this stage for local development (database uses SQLite file `dev.db`). When transitioning to production, we will add standard Next.js security headers and database URLs.
