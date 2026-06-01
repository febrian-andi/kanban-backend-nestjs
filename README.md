# Kanban Board Backend (NestJS)

Backend service for a Kanban Board application built using **NestJS (v11)**, **TypeScript**, **TypeORM**, and **PostgreSQL**. This service includes JWT authentication, bcrypt password hashing, input validation, and automated database migration support.

---

## 🚀 Core Features

- **Authentication & Authorization**: Registration, Login, and global endpoint protection using JWT.
- **Task Management (Kanban)**: Complete CRUD operations for Tasks (TODO, ON_PROGRESS, DONE, ARCHIVED).
- **Database Relationships**: One-to-Many relationship between Users and Tasks (`createdBy`).
- **Security**: Password hashing with `bcrypt` and sensitive data exclusion using `class-transformer` (`Exclude`).
- **Database Migrations**: Schema version control using TypeORM Migrations to ensure safe deployments in production.
- **Dockerized**: Ready to run with Docker & Docker Compose.

---

## 🛠️ Tech Stack

- **Framework:** [NestJS (v11)](https://nestjs.com/)
- **Language:** TypeScript
- **Database ORM:** [TypeORM](https://typeorm.io/)
- **Database:** PostgreSQL (v15)
- **Cryptography:** bcrypt
- **Others:** class-validator, class-transformer, tsconfig-paths

---

## ⚙️ System Requirements

Ensure you have the following installed on your machine:
- **Node.js** (v20 or newer)
- **NPM** (v10 or newer)
- **Docker & Docker Desktop** (for database/containers)

---

## 🏁 Getting Started (Local Development)

### 1. Clone the Project & Install Dependencies
```bash
npm install
```

### 2. Configure Environment Variables
Copy `.env.example` to `.env` and adjust the variables accordingly:
```bash
cp .env.example .env
```
Fill in your database connection details and JWT secrets in the `.env` file. Example:
```env
PORT=3000
NODE_ENV=development

DB_HOST=localhost
DB_PORT=5432
DB_USER=root
DB_PASSWORD=root
DB_NAME=kanban_be_nestjs

JWT_ALGORITHM=HS256
JWT_ISSUER=kanban-be
JWT_AUDIENCE=kanban-be
JWT_SECRET=jwtsecret
JWT_EXPIRES_IN=12h
```

### 3. Run the Application

There are two ways to run the application in your local environment:

#### Option A: Hybrid Mode (Highly Recommended for Development)
Runs the database inside Docker while running NestJS directly on your local machine for rapid hot-reloading.

1. Start the PostgreSQL database container:
   ```bash
   docker compose up -d kanban_be_postgres
   ```
2. Run the NestJS application in watch/dev mode:
   ```bash
   npm run start:dev
   ```

#### Option B: Full Docker Compose
Runs both the database and the backend service inside the Docker network.
```bash
docker compose up --build
```

---

## 🗃️ Database Schema Migration (TypeORM Migrations)

To maintain database schema consistency and prevent data loss in production (Koyeb, AWS, etc.), this project has `synchronize: false` in production and relies on **TypeORM Migrations**.

### Migration Scripts:
* **Generate a New Migration (Auto-generate based on Entity changes):**
  ```bash
  npm run migration:generate src/migrations/InitialSchema
  ```
  *(Note: Ensure your local database is completely empty/fresh to generate a full initial migration).*
  
* **Run Pending Migrations:**
  ```bash
  npm run migration:run
  ```
  
* **Revert the Last Migration:**
  ```bash
  npm run migration:revert
  ```

---

## 📝 Main Folder Structure

```text
src/
├── auth/            # Authentication and Token generation logic
├── config/          # Application configuration & TypeORM DataSource for CLI
├── core/            # Global guards, custom decorators (e.g., SkipAuth), interceptors
├── migrations/      # Database SQL migration files
├── tasks/           # Tasks module
└── users/           # Users module
```

---

## 🧪 Testing APIs (REST Client)

API endpoints can be tested directly using the **REST Client** extension in VS Code. Test requests are preconfigured in the `request/` folder:
- `request/users.http` - User registration & login endpoints.
- `request/tasks.http` - Task management endpoints (requires Auth Token).
