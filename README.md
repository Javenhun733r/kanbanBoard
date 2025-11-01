# 📋 Full-Stack Kanban Board Application

This project is a fully functional Kanban Board application designed for efficient visual task and project management. It is structured as a monorepository containing a separate client (frontend) and API server (backend), all containerized using **Docker Compose** for quick and reliable setup.

---

## 🌟 Key Features

- **Task Management (Cards):** Full CRUD (Create, Read, Update, Delete) operations for cards, allowing users to manage titles and descriptions.
- **Intuitive Drag-and-Drop:** Seamlessly move cards between columns using the robust `@hello-pangea/dnd` library.
- **Board Organization:** Tasks are automatically organized into three standard Kanban columns: **ToDo**, **InProgress**, and **Done**.
- **State Persistence:** Card positions and board status are persisted in the PostgreSQL database.

---

## 💻 Tech Stack

| Category              | Technology                  | Description                                                 |
| :-------------------- | :-------------------------- | :---------------------------------------------------------- |
| **Client (Frontend)** | **React (v19), TypeScript** | UI framework and static typing.                             |
| **State Management**  | **Redux Toolkit**           | Library for efficient global state management.              |
| **Styling/Build**     | **Tailwind CSS, Vite**      | Utility-first CSS framework and fast build tool.            |
| **API (Backend)**     | **NestJS, TypeScript**      | Scalable Node.js framework.                                 |
| **ORM/Database**      | **Prisma, PostgreSQL**      | ORM for type-safe interaction with the relational database. |

---

## ⚙️ Local Development Setup (Docker Compose)

The easiest way to run the entire stack (Database, API, Client) is using Docker Compose.

### 1. Prerequisites

- **Docker** and **Docker Compose** must be installed on your system.

### 2. Environment Variables Configuration

The project relies on a root-level `.env` file for configuration.

**You must create your local configuration file from the example:**

1.  Copy the example file to create your own local configuration file named `.env`:

    ```bash
    cp .env.example .env
    ```

2.  The generated `.env` file should contain the following variables. The default values are suitable for a local Docker setup.

**Default `.env` Content (from example):**

```env
DB_USER=db_user
DB_PASSWORD=db_password
DB_NAME=kanban
DB_PORT=5432
VITE_SERVER_URL=http://localhost:3000
DATABASE_URL=postgres://${DB_USER}:${DB_PASSWORD}@db:${DB_PORT}/${DB_NAME}?schema=public
```

---

3. Run the Project

With your .env file ready, run the following command from the project root:

```bash
docker compose up --build
```

This will:

1. Start the db service (PostgreSQL)
2. Build and start the api service (NestJS)

- The API container automatically runs Prisma migrations and the seed script

3. Build and start the client service (React + Nginx)

Once all containers are running, open your browser at:
http://localhost:8080

---

## 📚 Useful Scripts (Server)

These scripts are defined in the server/package.json and are helpful for backend development:

Command Description
| Command | Description |
| :------ | :----------- |
| `npm run start:dev` | Runs the NestJS application in watch mode (hot reload). |
| `npm run prisma:migrate` | Creates and applies new database migrations. |
| `npm run prisma:seed` | Populates the database with initial data. |
| `npm run test:e2e` | Runs end-to-end tests. |
