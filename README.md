# Hyperlocal Kirana Quick-Commerce Platform

This repository contains the complete implementation and documentation for the SESD Project final submission.

## Project Overview
A hyperlocal marketplace that digitizes existing Kirana stores, connecting them with nearby customers and local delivery "helpers" for 15-minute deliveries.

## Mandatory Documentation
- [idea.md](./idea.md) → Project idea, scope, and key features.
- [useCaseDiagram.md](./useCaseDiagram.md) → Functional interactions between actors.
- [sequenceDiagram.md](./sequenceDiagram.md) → End-to-end main ordering flow.
- [classDiagram.md](./classDiagram.md) → Object-oriented structure (major classes + relationships).
- [ErDiagram.md](./ErDiagram.md) → Database schema (MongoDB via Prisma).

## Architecture & OOP Principles
The backend follows **Clean Architecture** patterns:
- **Routes:** API endpoint definitions.
- **Controllers:** Request validation and response orchestration.
- **Services:** Core business logic and database interactions.
- **Middleware:** Auth, Role-based access control, and Global Error Handling.
- **Database:** Prisma ORM for type-safe database access with MongoDB.

## Tech Stack
- **Frontend:** Next.js 14, Tailwind CSS, Lucide Icons.
- **Backend:** Node.js, Express, TypeScript, Prisma, MongoDB.
- **Auth:** JWT-based authentication with Bcrypt password hashing.

## Setup Instructions

### Backend
1. Navigate to `/backend`.
2. Install dependencies: `npm install`.
3. Configure `.env` with `DATABASE_URL` (MongoDB) and `JWT_SECRET`.
4. Generate Prisma client: `npx prisma generate`.
5. Start development server: `npm run dev`.

### Frontend
1. Navigate to `/frontend`.
2. Install dependencies: `npm install`.
3. Start development server: `npm run dev`.

## Evaluation Criteria Highlights
- **OOP Principles:** Utilized inheritance for user profiles and encapsulation in service layers.
- **Clean Architecture:** Strict separation of concerns between HTTP logic, business logic, and data access.
- **Consistent Git Commits:** All modules implemented with meaningful context. 
