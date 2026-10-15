# Catalog Electronic

A full-stack electronic gradebook application developed with **NestJS, React, TypeScript, PostgreSQL, and Prisma**.

The application provides role-based access for administrators, teachers, and students, allowing school information and grades to be managed through a REST API and a responsive web interface.

## Tech Stack

**Backend**
- NestJS 12 and TypeScript
- PostgreSQL and Prisma 7
- JWT authentication and role-based authorization
- bcryptjs for password hashing
- class-validator for request validation
- Swagger/OpenAPI documentation
- Vitest for unit testing

**Frontend**
- React 19 and TypeScript
- Vite 8
- CSS for responsive layouts
- Fetch API for communication with the backend

## Features

### Administrator
- View students, teachers, classes, subjects, and teaching assignments
- Create new records using the administration dashboard
- Access protected administrative endpoints

### Teacher
- View assigned classes and subjects
- View students enrolled in assigned classes
- Add, edit, and delete grades for authorized teaching assignments
- View student grades and calculated averages

### Student
- Access a personal dashboard
- View grades grouped by subject
- View subject averages and overall average
- Access only their own grades

### Authentication and Authorization
- Login using email and password
- JWT-based authentication
- Administrator, teacher, and student roles
- Protected API endpoints with NestJS guards
- Authorization checks for grade-related operations

## Project Structure

```text
CatalogElectronic/
├── backend/
│   ├── prisma/
│   │   ├── migrations/
│   │   ├── schema.prisma
│   │   └── seed.ts
│   ├── src/
│   │   ├── auth/
│   │   ├── students/
│   │   ├── teachers/
│   │   ├── school-classes/
│   │   ├── subjects/
│   │   ├── teaching-assignments/
│   │   ├── grades/
│   │   └── prisma/
│   ├── prisma7.config.ts
│   └── .env.example
├── frontend/
│   └── src/
│       ├── components/
│       ├── features/
│       ├── hooks/
│       ├── services/
│       └── types/
└── README.md
```

## Prerequisites

Install the following tools:

- Node.js 24
- npm
- PostgreSQL
- Git

## Installation

### 1. Clone the repository

```bash
git clone <repository-url>
cd CatalogElectronic
```

### 2. Configure PostgreSQL

Create a PostgreSQL database and a user with permissions to access it.

Example database name:

```text
catalog_electronic
```

### 3. Configure environment variables

Navigate to the backend directory:

```bash
cd backend
```

Copy `.env.example` to `.env` and update the values:

```dotenv
DATABASE_URL="postgresql://catalog_user:YOUR_PASSWORD@localhost:5432/catalog_electronic?schema=public"
JWT_SECRET="replace-with-a-long-random-secret"
SEED_PASSWORD="replace-with-a-demo-password"
```

Do not commit your `.env` file or real credentials.

### 4. Install backend dependencies

```bash
npm install
```

### 5. Set up the database

Run the Prisma commands from the `backend` directory:

```bash
npx prisma migrate deploy --config prisma7.config.ts
npx prisma generate --config prisma7.config.ts
npx prisma db seed --config prisma7.config.ts
```

The seed script creates sample school data and demo accounts.

### 6. Start the backend

```bash
npm run start:dev
```

The backend runs at:

```text
http://localhost:3000
```

Swagger API documentation:

```text
http://localhost:3000/api
```

### 7. Start the frontend

Open another terminal:

```bash
cd frontend
npm install
npm run dev
```

Open the frontend at:

```text
http://localhost:5173
```

## Demo Accounts

The seed script creates example users with different roles.

Use the email addresses defined in `backend/prisma/seed.ts` and the password configured through `SEED_PASSWORD`.

For security reasons, passwords and JWT secrets are not included in this repository.

## API Overview

| Method | Endpoint | Description |
|---|---|---|
| POST | `/auth/login` | Authenticate a user |
| GET | `/auth/me` | Retrieve the authenticated user |
| GET | `/students` | List students |
| GET | `/teachers` | List teachers |
| GET | `/classes` | List school classes |
| GET | `/subjects` | List subjects |
| GET | `/assignments` | List teaching assignments |
| GET | `/teachers/me/assignments` | Retrieve a teacher's assignments |
| GET | `/students/:id/grades` | Retrieve student grades and averages |
| GET | `/grades/me` | Retrieve the authenticated student's grades |
| POST | `/grades` | Add a grade |
| PATCH | `/grades/:id` | Update a grade |
| DELETE | `/grades/:id` | Delete a grade |

Endpoint availability depends on the authenticated user's role and authorization rules.

## Testing

The project includes Vitest tests for backend services.

For example, the grade service has unit tests covering:

- Grade creation
- Teacher authorization
- Student-class validation
- Student grade access restrictions
- Average calculations

To run tests:

```bash
cd backend
npm run test
```

**Note:** The full test suite is still being updated. Some scaffold-generated tests require additional dependency mocks. Selected grade service tests pass.

## Known Limitations

- The administrator dashboard currently supports listing and creating records, but not editing or deleting all entity types through the UI.
- Accounts are created for demo users by the seed script. Creating a student or teacher profile through the administrative dashboard does not automatically create login credentials.
- The application currently uses local development URLs and is not configured for production deployment.

## Future Improvements

- Complete administrative CRUD functionality
- Add account creation and password management for new users
- Expand automated tests and end-to-end testing
- Add pagination, filtering, and search across administrative tables
- Configure production deployment and environment-based API URLs

## Author

Developed as a full-stack technical assessment project.