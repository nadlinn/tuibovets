# TurboVets Task Management System

A secure task management system built with NX monorepo, Angular, and NestJS. The system features role-based access control (RBAC), real-time updates, and a modern, responsive UI.

## 🏗 Architecture Overview

### Monorepo Structure

```
turbovets/
├── apps/
│   ├── api/              # NestJS backend application
│   ├── api-e2e/         # Backend E2E tests
│   ├── web/             # Angular frontend application
│   └── web-e2e/         # Frontend E2E tests
├── libs/                # Shared libraries (if needed)
└── tools/              # Build and development tools
```

### Backend Architecture

- **Framework**: NestJS with TypeScript
- **Database**: PostgreSQL with TypeORM
- **Authentication**: JWT-based with role-based access control (RBAC)
- **API**: RESTful endpoints with proper validation and error handling
- **Testing**: Jest for unit tests

### Frontend Architecture

- **Framework**: Angular with TypeScript
- **State Management**: NgRx for predictable state container
- **UI Components**: Angular Material for consistent design
- **Features**:
  - Drag-and-drop task management
  - Dark mode support
  - Responsive design
  - Real-time updates
- **Testing**: Jasmine and Karma for unit tests

### Security Features

1. **Role-Based Access Control (RBAC)**
   - Granular permissions for different user roles
   - Secure API endpoints with role-based guards
   - Permission-based UI rendering

2. **Authentication**
   - JWT-based authentication
   - Secure password hashing with bcrypt
   - Token refresh mechanism

3. **Data Protection**
   - Input validation and sanitization
   - SQL injection protection with TypeORM
   - XSS protection
   - CORS configuration

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or later)
- PostgreSQL (v14 or later)
- npm (v8 or later)

### Backend Setup

1. Install dependencies:
   ```bash
   cd apps/api
   npm install
   ```

2. Create a `.env` file in the `apps/api` directory:
   ```env
   DB_HOST=localhost
   DB_PORT=5432
   DB_USERNAME=postgres
   DB_PASSWORD=postgres
   DB_DATABASE=turbovets
   JWT_SECRET=your-secret-key
   ```

3. Start the backend server:
   ```bash
   npx nx serve api
   ```

### Frontend Setup

1. Install dependencies:
   ```bash
   cd apps/web
   npm install
   ```

2. Configure environment variables in `apps/web/src/environments/environment.ts`:
   ```typescript
   export const environment = {
     production: false,
     apiUrl: 'http://localhost:3000/api',
   };
   ```

3. Start the frontend application:
   ```bash
   npx nx serve web
   ```

### Running Tests

- Backend tests:
  ```bash
  npx nx test api
  ```

- Frontend tests:
  ```bash
  npx nx test web
  ```

## 🔄 Development Workflow

1. **Database Migrations**
   - Create a new migration:
     ```bash
     npx nx run api:migration:create --name=migration-name
     ```
   - Run migrations:
     ```bash
     npx nx run api:migration:run
     ```

2. **Adding New Features**
   - Create a new library:
     ```bash
     npx nx g @nx/angular:lib my-feature
     ```
   - Generate components:
     ```bash
     npx nx g @nx/angular:component my-component --project=web
     ```

3. **Building for Production**
   ```bash
   npx nx build api --prod
   npx nx build web --prod
   ```

## 🌟 Future Enhancements

1. **Security**
   - Two-factor authentication
   - OAuth integration
   - Rate limiting
   - Audit logging

2. **Scalability**
   - Redis caching
   - Horizontal scaling
   - WebSocket support for real-time updates
   - Task attachments with cloud storage

3. **Features**
   - Task templates
   - Bulk actions
   - Advanced search and filtering
   - Task dependencies
   - Time tracking
   - Reporting and analytics

## 📝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.