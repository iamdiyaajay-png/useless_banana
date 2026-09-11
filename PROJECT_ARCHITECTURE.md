# National Banana Registry - Architecture

## 1. Existing Stack Detected
No existing stack was detected. The `USELESS` directory was completely empty except for configuration files. 

## 2. Architecture Chosen
We have adopted a monolithic Full-Stack architecture suitable for an 18-hour hackathon.

- **Framework**: Next.js (App Router)
- **Frontend**: React, Vanilla CSS (Institutional Design System)
- **Backend**: Next.js Server Components / API Routes
- **Database**: SQLite (via Prisma ORM)

## 3. Logical Services
The application is structured into logical services inside `src/lib/services.ts`. These services access the single database and provide modular boundaries:
- `logEvent()`: Audit Service
- `generateBananaId()`: Registry Service
- `generateDocumentNumber()`: Document Service

*Note: Analysis, Dating, and Verification services will be built upon this foundation in subsequent steps.*

## 4. Why This Architecture?
- **Speed**: Next.js allows full-stack development without managing separate repositories.
- **Simplicity**: SQLite requires zero infrastructure setup, making it ideal for the short timeline.
- **Type Safety**: Prisma provides automatic typing, reducing errors in the short development window.
- **Extensibility**: The database schema is strongly relational, ensuring we can cleanly attach new modules without rewriting the core `Banana` entity.
