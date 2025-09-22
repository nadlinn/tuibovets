# TurboVets API Documentation

## 🔐 Authentication

### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securePassword123",
  "firstName": "John",
  "lastName": "Doe"
}
```

Response:
```json
{
  "id": "123e4567-e89b-12d3-a456-426614174000",
  "email": "user@example.com",
  "firstName": "John",
  "lastName": "Doe",
  "roles": [],
  "createdAt": "2025-09-22T03:47:11.372Z",
  "updatedAt": "2025-09-22T03:47:11.372Z"
}
```

### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securePassword123"
}
```

Response:
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "roles": [
      {
        "id": "789e4567-e89b-12d3-a456-426614174000",
        "name": "User",
        "permissions": ["read_task", "create_task"]
      }
    ]
  }
}
```

## 📋 Tasks

### Get All Tasks
```http
GET /api/tasks
Authorization: Bearer <access_token>
```

Response:
```json
[
  {
    "id": "456e4567-e89b-12d3-a456-426614174000",
    "title": "Implement Feature",
    "description": "Implement new feature X",
    "status": "todo",
    "priority": "high",
    "assigneeId": "123e4567-e89b-12d3-a456-426614174000",
    "creatorId": "789e4567-e89b-12d3-a456-426614174000",
    "dueDate": "2025-10-01T00:00:00.000Z",
    "createdAt": "2025-09-22T03:47:11.372Z",
    "updatedAt": "2025-09-22T03:47:11.372Z"
  }
]
```

### Get Task by ID
```http
GET /api/tasks/{taskId}
Authorization: Bearer <access_token>
```

Response:
```json
{
  "id": "456e4567-e89b-12d3-a456-426614174000",
  "title": "Implement Feature",
  "description": "Implement new feature X",
  "status": "todo",
  "priority": "high",
  "assigneeId": "123e4567-e89b-12d3-a456-426614174000",
  "creatorId": "789e4567-e89b-12d3-a456-426614174000",
  "dueDate": "2025-10-01T00:00:00.000Z",
  "createdAt": "2025-09-22T03:47:11.372Z",
  "updatedAt": "2025-09-22T03:47:11.372Z"
}
```

### Create Task
```http
POST /api/tasks
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "title": "New Task",
  "description": "Task description",
  "priority": "medium",
  "assigneeId": "123e4567-e89b-12d3-a456-426614174000",
  "dueDate": "2025-10-01T00:00:00.000Z"
}
```

Response:
```json
{
  "id": "456e4567-e89b-12d3-a456-426614174000",
  "title": "New Task",
  "description": "Task description",
  "status": "todo",
  "priority": "medium",
  "assigneeId": "123e4567-e89b-12d3-a456-426614174000",
  "creatorId": "789e4567-e89b-12d3-a456-426614174000",
  "dueDate": "2025-10-01T00:00:00.000Z",
  "createdAt": "2025-09-22T03:47:11.372Z",
  "updatedAt": "2025-09-22T03:47:11.372Z"
}
```

### Update Task
```http
PUT /api/tasks/{taskId}
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "title": "Updated Task",
  "description": "Updated description",
  "status": "in_progress",
  "priority": "high"
}
```

Response:
```json
{
  "id": "456e4567-e89b-12d3-a456-426614174000",
  "title": "Updated Task",
  "description": "Updated description",
  "status": "in_progress",
  "priority": "high",
  "assigneeId": "123e4567-e89b-12d3-a456-426614174000",
  "creatorId": "789e4567-e89b-12d3-a456-426614174000",
  "dueDate": "2025-10-01T00:00:00.000Z",
  "createdAt": "2025-09-22T03:47:11.372Z",
  "updatedAt": "2025-09-22T03:47:11.372Z"
}
```

### Delete Task
```http
DELETE /api/tasks/{taskId}
Authorization: Bearer <access_token>
```

Response:
```
204 No Content
```

### Assign Task
```http
PUT /api/tasks/{taskId}/assign
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "assigneeId": "123e4567-e89b-12d3-a456-426614174000"
}
```

Response:
```json
{
  "id": "456e4567-e89b-12d3-a456-426614174000",
  "title": "Task Title",
  "description": "Task description",
  "status": "todo",
  "priority": "medium",
  "assigneeId": "123e4567-e89b-12d3-a456-426614174000",
  "creatorId": "789e4567-e89b-12d3-a456-426614174000",
  "dueDate": "2025-10-01T00:00:00.000Z",
  "createdAt": "2025-09-22T03:47:11.372Z",
  "updatedAt": "2025-09-22T03:47:11.372Z"
}
```

## 🔑 Error Responses

### 401 Unauthorized
```json
{
  "statusCode": 401,
  "message": "Unauthorized",
  "error": "Unauthorized"
}
```

### 403 Forbidden
```json
{
  "statusCode": 403,
  "message": "You do not have permission to perform this action",
  "error": "Forbidden"
}
```

### 404 Not Found
```json
{
  "statusCode": 404,
  "message": "Task not found",
  "error": "Not Found"
}
```

### 400 Bad Request
```json
{
  "statusCode": 400,
  "message": ["title must not be empty", "priority must be a valid value"],
  "error": "Bad Request"
}
```

## 📝 Notes

1. All requests (except login and register) require a valid JWT token in the Authorization header.
2. Dates are in ISO 8601 format.
3. Task priorities can be: "low", "medium", or "high".
4. Task statuses can be: "todo", "in_progress", "review", or "done".
5. All IDs are UUIDs.
6. The API follows REST principles and uses standard HTTP status codes.
7. Validation errors return a 400 status code with detailed error messages.
8. RBAC permissions are checked for each endpoint.
9. Pagination is available for list endpoints using `?page=1&limit=10` query parameters.
