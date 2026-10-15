# Project Context - Home Management App

> **IMPORTANT:** User communication language is **Ukrainian**. Always speak with the user in Ukrainian.

## Project Concept

This is a **home management web application** for organizing household tasks and activities. The application helps families and individuals manage their daily life through structured lists, tasks, and planning.

### Core Purpose

Help users organize and coordinate household activities, shopping, tasks, and events in one place with the ability to share with family members or friends.

## Main Features

### MVP (Minimum Viable Product)

1. **Shopping Lists** - Create and manage shopping lists with items
2. **Task Lists** - Organize to-do items with priorities and due dates
3. **Event Calendar** - Plan and track events and important dates
4. **Categories** - Organize lists by categories with custom colors/icons
5. **Multi-user Access** - Share lists with family members or friends with read/write permissions

### Future Enhancements

- Budget tracking and expenses
- Statistics and analytics
- Notifications and reminders
- Photo attachments for lists
- Device synchronization
- Offline mode

## Project Structure

### Repository Structure

```
ToDoProject/
├── Client/    # Frontend application (React/Next.js - planned)
└── Server/    # Backend API (Express + TypeScript + Prisma)
```

### Backend Code Structure (Conceptual)

```
Server/
├── src/
│   ├── index.ts              # Application entry point
│   ├── config/               # Configuration files
│   ├── controllers/          # Request handlers
│   ├── cron/                 # Scheduled tasks (optional)
│   ├── middleware/          # Custom middleware (auth, validation)
│   ├── models/               # Data models
│   ├── routes/               # API route definitions
│   ├── services/             # Business logic
│   ├── schemas/              # Validation schemas (Zod)
│   ├── types/                # TypeScript type definitions
│   └── utils/                # Extra functions
├── prisma/
│   ├── schema.prisma         # Database schema
│   └── migrations/           # Database migrations
└── .env                      # Environment variables
```

## Technology Stack (Planned)

### Backend

- **Runtime:** Node.js
- **Framework:** Express
- **Language:** TypeScript
- **Database:** SQLite (development) / PostgreSQL (production ready)
- **ORM:** Prisma
- **Authentication:** JWT tokens (jsonwebtoken)
- **Password Hashing:** bcrypt / bcryptjs
- **Validation:** Zod / express-validator
- **API Documentation:** Swagger (swagger-jsdoc, swagger-ui-express)
- **Cookie Handling:** cookie-parser
- **Path Aliases:** tsc-alias, tsconfig-paths
- **Development:** nodemon, ts-node, ts-node-dev

### Frontend (Future)

- React or Next.js
- TypeScript
- Material-UI or Tailwind CSS
- React Query or SWR for API calls

## Data Model Concept

### Database Schema

**User**

- `id` (UUID) - Primary key
- `email` (String, unique) - User email for login
- `password` (String, hashed) - Hashed password
- `name` (String, optional) - User display name
- `avatar` (String, optional) - Avatar image URL
- `createdAt`, `updatedAt` - Timestamps
- **Relations:** owns lists, categories, has shared list access

**RefreshToken**

- `id` (UUID) - Primary key
- `token` (String, hashed) - Hashed user token
- `userId` (UUID) - Foreign key to User
- `deviceId` (String, optional)
- `ipAddress` (String, optional) - Device IP address
- `expiresAt`, `createdAt`, `updatedAt` - Timestamps

**List**

- `id` (UUID) - Primary key
- `userId` (UUID) - Foreign key to User
- `title` (String) - List name
- `type` (String) - List type: "shopping", "tasks", "events"
- `color` (String, optional) - Custom color
- `icon` (String, optional) - Custom icon
- `createdAt`, `updatedAt` - Timestamps
- **Relations:** belongs to user, contains items, can be shared

**Item**

- `id` (UUID) - Primary key
- `listId` (UUID) - Foreign key to List
- `title` (String) - Item name
- `description` (String, optional) - Item description
- `completed` (Boolean) - Completion status (default: false)
- `priority` (Int, optional) - Priority level: 0=low, 1=medium, 2=high (default: 0)
- `dueDate` (DateTime, optional) - Due date
- `position` (Int) - Ordering position (default: 0)
- `createdAt`, `updatedAt` - Timestamps
- **Relations:** belongs to list

**Category**

- `id` (UUID) - Primary key
- `userId` (UUID) - Foreign key to User
- `name` (String) - Category name
- `color` (String, optional) - Category color
- `icon` (String, optional) - Category icon
- `createdAt`, `updatedAt` - Timestamps
- **Relations:** belongs to user

**SharedList**

- `id` (UUID) - Primary key
- `listId` (UUID) - Foreign key to List
- `userId` (UUID) - Foreign key to User (shared with)
- `permission` (String) - Access level: "read" or "write" (default: "read")
- `createdAt` - Timestamp
- **Unique constraint:** [listId, userId] - User can have only one permission per list
- **Relations:** links user to shared list

## API Concept

### Authentication Endpoints

- User registration
- User login
- Get current user info
- JWT token-based authentication

### Lists Endpoints

- Get all user's lists (with filtering)
- Create new list
- Get single list with items
- Update list details
- Delete list

### Items Endpoints

- Get items in a list
- Add item to list
- Update item (mark complete, change priority, etc.)
- Delete item
- Reorder items

### Categories Endpoints

- Manage categories
- Assign categories to lists

### Sharing Endpoints

- Share list with user
- Update sharing permissions
- Remove sharing access

## User Preferences

- **User:** Alex Lev
- **Communication:** Always in **Ukrainian**
- **Approach:** User is learning/refreshing programming skills
- **Style:** Prefer guidance over automatic implementation
- **Don't create:** Unnecessary .md documentation files (unless specifically asked)

## Architecture Principles

1. **RESTful API** - Standard REST endpoints
2. **Type Safety** - TypeScript throughout
3. **Database First** - Prisma schema defines data structure
4. **Authentication First** - Protected routes with JWT
5. **Scalability** - Can migrate from SQLite to PostgreSQL easily
6. **MVP Approach** - Start simple, add features gradually
7. **API Documentation** - Swagger/OpenAPI documentation for all endpoints
8. **Clean Imports** - Module aliases for better code organization

## Key Decisions

- **SQLite for start** - Easy setup, can migrate to PostgreSQL later
- **Prisma ORM** - Type-safe database access, easy migrations
- **JWT authentication** - Stateless, scalable
- **Express framework** - Simple and flexible
- **TypeScript** - Type safety and better developer experience
- **Swagger for API docs** - Auto-generated API documentation with swagger-jsdoc and swagger-ui-express
- **Module aliases** - Clean imports using @config, @controllers, etc. via module-alias
- **Path-based structure** - Organized code structure with dedicated folders for schemas, types, middleware
- **Dual bcrypt support** - Both bcrypt and bcryptjs installed for flexibility

---

This file describes the **concept and vision** of the project. It should remain stable regardless of development progress.
