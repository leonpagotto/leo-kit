# 📚 LEO Dashboard API Reference (Phase 3 Week 3 - Day 7)

**Phase 3 Week 3 - Day 7: API Documentation & OpenAPI**

> Complete REST API and WebSocket documentation for the LEO Dashboard API Server

---

## 📋 Table of Contents

1. [Overview](#overview)
2. [Quick Start](#quick-start)
3. [Authentication](#authentication)
4. [REST API Endpoints](#rest-api-endpoints)
5. [WebSocket Events](#websocket-events)
6. [Error Handling](#error-handling)
7. [Examples](#examples)
8. [OpenAPI Specification](#openapi-specification)

---

## 🎯 Overview

The LEO Dashboard API Server provides real-time access to hunt data, team information, and analytics through:

- **12 REST Endpoints** for CRUD operations
- **4 WebSocket Events** for real-time updates
- **Comprehensive Status Endpoint** for health checks
- **Full Error Handling** with meaningful error codes

### Key Features

✅ Real-time WebSocket broadcasts
✅ Team and hunt management
✅ Advanced analytics and metrics
✅ CORS-enabled for frontend integration
✅ Full event tracking and logging

---

## 🚀 Quick Start

### Start the API Server

```bash
leo dashboard start
```

### Expected Output

```
🚀 LEO Dashboard API Server

✅ Dashboard API Server Started!

📊 API Information:
   URL: http://localhost:3000
   WebSocket: ws://localhost:3000
   Docs: http://localhost:3000/api/docs

📚 Available Endpoints:
   Team:
     GET  http://localhost:3000/api/team
     GET  http://localhost:3000/api/team/members
   Hunts:
     GET  http://localhost:3000/api/hunts
     GET  http://localhost:3000/api/hunts/:id
     POST http://localhost:3000/api/hunts
   Analytics:
     GET  http://localhost:3000/api/analytics
     GET  http://localhost:3000/api/analytics/hunts
     GET  http://localhost:3000/api/analytics/performance

🔌 WebSocket Events:
   hunt:created - New hunt created
   hunt:updated - Hunt updated
   hunt:phase-changed - Hunt phase transitioned
   hunt:completed - Hunt completed

Press Ctrl+C to stop the server
```

### Check Server Status

```bash
leo dashboard status
```

### Open in Browser

```bash
leo dashboard open
```

---

## 🔐 Authentication

Currently, the API Server uses **no authentication** (suitable for local/development use).

For production deployment, add authentication middleware:

```javascript
// lib/team/api-server.js
_setupMiddleware() {
  // Add authentication middleware
  this.app.use((req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    // Validate token...
    next();
  });
}
```

---

## 📡 REST API Endpoints

### Base URL

```
http://localhost:3000/api
```

### Health Check

#### GET /health

Check if server is running.

**Response (200 OK):**

```json
{
  "status": "ok",
  "timestamp": "2025-10-24T15:30:00.000Z"
}
```

### API Status

#### GET /api/status

Get comprehensive API server status.

**Response (200 OK):**

```json
{
  "running": true,
  "port": 3000,
  "workdir": ".",
  "teamSize": 5,
  "activeHunts": 3,
  "totalHunts": 10,
  "connectedClients": 2,
  "uptime": "2345s",
  "timestamp": "2025-10-24T15:30:00.000Z"
}
```

---

## 👥 Team Endpoints

### GET /api/team

Get team information.

**Response (200 OK):**

```json
{
  "name": "Engineering Team",
  "size": 5,
  "members": [
    {
      "id": "mem-001",
      "name": "Alice",
      "role": "Lead"
    },
    {
      "id": "mem-002",
      "name": "Bob",
      "role": "Developer"
    }
  ],
  "roles": ["Lead", "Developer", "Designer"],
  "createdAt": "2025-10-01T00:00:00Z",
  "mode": "team"
}
```

**cURL Example:**

```bash
curl http://localhost:3000/api/team
```

---

### GET /api/team/members

Get all team members.

**Query Parameters:**

- `role` (optional): Filter by role (e.g., "Developer", "Lead")
- `active` (optional): Filter by active status (true/false)

**Response (200 OK):**

```json
[
  {
    "id": "mem-001",
    "name": "Alice",
    "role": "Lead",
    "email": "alice@company.com",
    "joinedAt": "2025-10-01T00:00:00Z",
    "currentHunt": "hunt-005",
    "huntsCompleted": 12
  },
  {
    "id": "mem-002",
    "name": "Bob",
    "role": "Developer",
    "email": "bob@company.com",
    "joinedAt": "2025-10-05T00:00:00Z",
    "currentHunt": null,
    "huntsCompleted": 8
  }
]
```

**cURL Example:**

```bash
curl http://localhost:3000/api/team/members
curl "http://localhost:3000/api/team/members?role=Developer"
```

---

## 🎯 Hunt Endpoints

### GET /api/hunts

Get all hunts.

**Query Parameters:**

- `status` (optional): Filter by status (`active`, `completed`, `archived`)
- `owner` (optional): Filter by owner name
- `priority` (optional): Filter by priority (`Low`, `Medium`, `High`, `Critical`)
- `limit` (optional): Limit results (default: 100)
- `offset` (optional): Pagination offset (default: 0)

**Response (200 OK):**

```json
[
  {
    "id": "hunt-001",
    "title": "Add Dark Mode Support",
    "description": "Implement dark mode for the dashboard",
    "owner": "Alice",
    "status": "active",
    "currentPhase": "implementation",
    "priority": "High",
    "progress": 60,
    "createdAt": "2025-10-10T08:00:00Z",
    "updatedAt": "2025-10-24T12:00:00Z",
    "completedAt": null
  },
  {
    "id": "hunt-002",
    "title": "Fix API Bug",
    "description": "Fix authentication issue in REST endpoints",
    "owner": "Bob",
    "status": "completed",
    "currentPhase": "release",
    "priority": "Critical",
    "progress": 100,
    "createdAt": "2025-10-15T10:00:00Z",
    "updatedAt": "2025-10-24T14:00:00Z",
    "completedAt": "2025-10-24T14:00:00Z"
  }
]
```

**cURL Examples:**

```bash
# Get all hunts
curl http://localhost:3000/api/hunts

# Filter by status
curl "http://localhost:3000/api/hunts?status=active"

# Filter by owner
curl "http://localhost:3000/api/hunts?owner=Alice"

# Filter by priority
curl "http://localhost:3000/api/hunts?priority=High"

# Multiple filters
curl "http://localhost:3000/api/hunts?status=active&owner=Alice"
```

---

### GET /api/hunts/:id

Get hunt details.

**Path Parameters:**

- `id` (required): Hunt ID

**Response (200 OK):**

```json
{
  "id": "hunt-001",
  "title": "Add Dark Mode Support",
  "description": "Implement dark mode for the dashboard",
  "currentPhase": "implementation",
  "phases": [
    {
      "name": "ideation",
      "completed": true,
      "startedAt": "2025-10-10T08:00:00Z",
      "completedAt": "2025-10-10T16:00:00Z"
    },
    {
      "name": "validation",
      "completed": true,
      "startedAt": "2025-10-11T08:00:00Z",
      "completedAt": "2025-10-12T16:00:00Z"
    },
    {
      "name": "implementation",
      "completed": false,
      "startedAt": "2025-10-13T08:00:00Z",
      "completedAt": null
    },
    {
      "name": "release",
      "completed": false,
      "startedAt": null,
      "completedAt": null
    }
  ],
  "owner": "Alice",
  "priority": "High",
  "createdAt": "2025-10-10T08:00:00Z",
  "completedAt": null,
  "duration": 360000,
  "githubIssue": {
    "number": 42,
    "id": "123456",
    "url": "https://github.com/org/repo/issues/42"
  },
  "slackChannel": "#hunt-dark-mode"
}
```

**Response (404 Not Found):**

```json
{
  "error": "Hunt not found"
}
```

**cURL Example:**

```bash
curl http://localhost:3000/api/hunts/hunt-001
```

---

### GET /api/hunts/:id/phases

Get hunt phase information.

**Response (200 OK):**

```json
{
  "huntId": "hunt-001",
  "phases": [
    {
      "phase": "ideation",
      "startedAt": "2025-10-10T08:00:00Z",
      "completedAt": "2025-10-10T16:00:00Z",
      "durationMs": 28800000
    },
    {
      "phase": "validation",
      "startedAt": "2025-10-11T08:00:00Z",
      "completedAt": "2025-10-12T16:00:00Z",
      "durationMs": 172800000
    },
    {
      "phase": "implementation",
      "startedAt": "2025-10-13T08:00:00Z",
      "completedAt": null,
      "durationMs": 288000000
    }
  ]
}
```

**cURL Example:**

```bash
curl http://localhost:3000/api/hunts/hunt-001/phases
```

---

### POST /api/hunts

Create a new hunt.

**Request Body:**

```json
{
  "title": "Add Dark Mode Support",
  "description": "Implement dark mode for the dashboard",
  "owner": "Alice",
  "priority": "High"
}
```

**Response (201 Created):**

```json
{
  "id": "hunt-001",
  "title": "Add Dark Mode Support",
  "description": "Implement dark mode for the dashboard",
  "owner": "Alice",
  "createdAt": "2025-10-24T15:30:00.000Z"
}
```

**Response (400 Bad Request):**

```json
{
  "error": "Title required"
}
```

**cURL Example:**

```bash
curl -X POST http://localhost:3000/api/hunts \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Add Dark Mode Support",
    "description": "Implement dark mode",
    "owner": "Alice",
    "priority": "High"
  }'
```

---

### PUT /api/hunts/:id

Update a hunt.

**Request Body (all optional):**

```json
{
  "title": "Updated Title",
  "description": "Updated description",
  "status": "completed"
}
```

**Response (200 OK):**

```json
{
  "id": "hunt-001",
  "title": "Updated Title",
  "description": "Updated description",
  "status": "completed",
  "updatedAt": "2025-10-24T15:35:00.000Z"
}
```

**cURL Example:**

```bash
curl -X PUT http://localhost:3000/api/hunts/hunt-001 \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Updated Title",
    "description": "Updated description"
  }'
```

---

### POST /api/hunts/:id/phase-next

Advance hunt to the next phase.

**Response (200 OK):**

```json
{
  "id": "hunt-001",
  "currentPhase": "validation",
  "previousPhase": "ideation"
}
```

**Response (404 Not Found):**

```json
{
  "error": "Hunt not found"
}
```

**cURL Example:**

```bash
curl -X POST http://localhost:3000/api/hunts/hunt-001/phase-next
```

---

### POST /api/hunts/:id/complete

Mark a hunt as completed.

**Response (200 OK):**

```json
{
  "id": "hunt-001",
  "completed": true,
  "duration": 360000,
  "completedAt": "2025-10-24T15:40:00.000Z"
}
```

**cURL Example:**

```bash
curl -X POST http://localhost:3000/api/hunts/hunt-001/complete
```

---

## 📊 Analytics Endpoints

### GET /api/analytics

Get overall team analytics.

**Response (200 OK):**

```json
{
  "activeHunts": 3,
  "completedHunts": 7,
  "totalHunts": 10,
  "avgDuration": 360000,
  "successRate": 85,
  "teamSize": 5,
  "timestamp": "2025-10-24T15:30:00.000Z"
}
```

**cURL Example:**

```bash
curl http://localhost:3000/api/analytics
```

---

### GET /api/analytics/hunts

Get hunt-specific analytics.

**Response (200 OK):**

```json
{
  "byStatus": {
    "active": 3,
    "completed": 7,
    "archived": 0
  },
  "byPhase": {
    "ideation": 1,
    "validation": 1,
    "implementation": 1,
    "release": 0
  },
  "byPriority": {
    "Low": 2,
    "Medium": 5,
    "High": 2,
    "Critical": 1
  },
  "avgPhaseTime": {
    "ideation": 86400000,
    "validation": 172800000,
    "implementation": 604800000,
    "release": 86400000
  }
}
```

**cURL Example:**

```bash
curl http://localhost:3000/api/analytics/hunts
```

---

### GET /api/analytics/performance

Get team performance metrics.

**Response (200 OK):**

```json
{
  "throughput": 7,
  "avgDuration": 360000,
  "efficiency": 85,
  "teamVelocity": 1.4,
  "memberPerformance": [
    {
      "name": "Alice",
      "hunts": 5,
      "completed": 5
    },
    {
      "name": "Bob",
      "hunts": 3,
      "completed": 2
    }
  ]
}
```

**cURL Example:**

```bash
curl http://localhost:3000/api/analytics/performance
```

---

## 🔌 WebSocket Events

Connect to WebSocket at: `ws://localhost:3000`

### JavaScript Example

```javascript
const socket = io("http://localhost:3000");

// Connection event
socket.on("connected", (data) => {
  console.log("Connected:", data);
  // { message: 'Connected to LionPack server', clientId: '...', timestamp: '...' }
});

// Listen for hunt events
socket.on("hunt:created", (data) => {
  console.log("Hunt created:", data);
});

socket.on("hunt:updated", (data) => {
  console.log("Hunt updated:", data);
});

socket.on("hunt:phase-changed", (data) => {
  console.log("Hunt phase changed:", data);
});

socket.on("hunt:completed", (data) => {
  console.log("Hunt completed:", data);
});

// Disconnect event
socket.on("disconnect", () => {
  console.log("Disconnected from server");
});
```

### Incoming Events

#### hunt:created

Broadcast when a new hunt is created.

**Data:**

```json
{
  "event": "hunt:created",
  "data": {
    "id": "hunt-001",
    "title": "Add Dark Mode",
    "owner": "Alice",
    "createdAt": "2025-10-24T15:30:00.000Z"
  },
  "timestamp": "2025-10-24T15:30:00.000Z"
}
```

---

#### hunt:updated

Broadcast when a hunt is updated.

**Data:**

```json
{
  "event": "hunt:updated",
  "data": {
    "id": "hunt-001",
    "title": "Add Dark Mode",
    "updatedAt": "2025-10-24T15:35:00.000Z"
  },
  "timestamp": "2025-10-24T15:35:00.000Z"
}
```

---

#### hunt:phase-changed

Broadcast when hunt phase changes.

**Data:**

```json
{
  "event": "hunt:phase-changed",
  "data": {
    "id": "hunt-001",
    "title": "Add Dark Mode",
    "previousPhase": "ideation",
    "currentPhase": "validation",
    "timestamp": "2025-10-24T15:40:00.000Z"
  },
  "timestamp": "2025-10-24T15:40:00.000Z"
}
```

---

#### hunt:completed

Broadcast when hunt is completed.

**Data:**

```json
{
  "event": "hunt:completed",
  "data": {
    "id": "hunt-001",
    "title": "Add Dark Mode",
    "duration": 360000,
    "completedAt": "2025-10-24T16:00:00.000Z"
  },
  "timestamp": "2025-10-24T16:00:00.000Z"
}
```

---

## ❌ Error Handling

All API errors follow this format:

```json
{
  "error": "Error message",
  "code": "ERROR_CODE",
  "status": 400
}
```

### Common HTTP Status Codes

| Status | Code         | Meaning                    |
| ------ | ------------ | -------------------------- |
| 200    | OK           | Success                    |
| 201    | CREATED      | Resource created           |
| 400    | BAD_REQUEST  | Invalid request parameters |
| 401    | UNAUTHORIZED | Authentication required    |
| 404    | NOT_FOUND    | Resource not found         |
| 409    | CONFLICT     | Resource conflict          |
| 500    | SERVER_ERROR | Internal server error      |

### Error Examples

#### 404 Not Found

```json
{
  "error": "Hunt not found",
  "status": 404
}
```

#### 400 Bad Request

```json
{
  "error": "Title required",
  "status": 400
}
```

#### 500 Server Error

```json
{
  "error": "Internal server error",
  "status": 500
}
```

---

## 📝 Examples

### Complete Workflow Example

```bash
# 1. Check server status
curl http://localhost:3000/api/status

# 2. Get team info
curl http://localhost:3000/api/team

# 3. Get all hunts
curl http://localhost:3000/api/hunts

# 4. Create a new hunt
curl -X POST http://localhost:3000/api/hunts \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Implement Feature X",
    "description": "Add new feature",
    "owner": "Alice",
    "priority": "High"
  }'

# 5. Get hunt details (replace hunt-001 with actual ID)
curl http://localhost:3000/api/hunts/hunt-001

# 6. Advance to next phase
curl -X POST http://localhost:3000/api/hunts/hunt-001/phase-next

# 7. Get analytics
curl http://localhost:3000/api/analytics

# 8. Complete hunt
curl -X POST http://localhost:3000/api/hunts/hunt-001/complete
```

### WebSocket Real-time Monitoring

```javascript
const io = require("socket.io-client");

// Connect to API server
const socket = io("http://localhost:3000");

// Log all events
socket.on("hunt:created", (event) => {
  console.log("✨ Hunt created:", event.data.title);
});

socket.on("hunt:phase-changed", (event) => {
  console.log(
    `📍 Phase changed: ${event.data.previousPhase} → ${event.data.currentPhase}`
  );
});

socket.on("hunt:completed", (event) => {
  console.log(`✅ Hunt completed: ${event.data.title}`);
});
```

---

## 🔄 OpenAPI Specification

### OpenAPI 3.0 YAML

```yaml
openapi: 3.0.0
info:
  title: LEO Dashboard API
  version: 1.0.0
  description: Real-time API server for hunt tracking and team visualization

servers:
  - url: http://localhost:3000
    description: Local development server
  - url: https://dashboard.example.com
    description: Production server

paths:
  /api/status:
    get:
      summary: Get API server status
      tags:
        - Status
      responses:
        "200":
          description: Server status
          content:
            application/json:
              schema:
                type: object
                properties:
                  running:
                    type: boolean
                  port:
                    type: number
                  teamSize:
                    type: number
                  activeHunts:
                    type: number
                  totalHunts:
                    type: number
                  connectedClients:
                    type: number

  /api/team:
    get:
      summary: Get team information
      tags:
        - Team
      responses:
        "200":
          description: Team information
          content:
            application/json:
              schema:
                type: object

  /api/team/members:
    get:
      summary: Get all team members
      tags:
        - Team
      responses:
        "200":
          description: Array of team members
          content:
            application/json:
              schema:
                type: array
                items:
                  type: object

  /api/hunts:
    get:
      summary: Get all hunts
      tags:
        - Hunts
      parameters:
        - name: status
          in: query
          schema:
            type: string
            enum: [active, completed, archived]
        - name: owner
          in: query
          schema:
            type: string
      responses:
        "200":
          description: Array of hunts
          content:
            application/json:
              schema:
                type: array
                items:
                  type: object

    post:
      summary: Create a new hunt
      tags:
        - Hunts
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              required:
                - title
              properties:
                title:
                  type: string
                description:
                  type: string
                owner:
                  type: string
                priority:
                  type: string
      responses:
        "201":
          description: Hunt created
          content:
            application/json:
              schema:
                type: object

  /api/hunts/{id}:
    get:
      summary: Get hunt details
      tags:
        - Hunts
      parameters:
        - name: id
          in: path
          required: true
          schema:
            type: string
      responses:
        "200":
          description: Hunt details
          content:
            application/json:
              schema:
                type: object
        "404":
          description: Hunt not found

    put:
      summary: Update hunt
      tags:
        - Hunts
      parameters:
        - name: id
          in: path
          required: true
          schema:
            type: string
      requestBody:
        content:
          application/json:
            schema:
              type: object
              properties:
                title:
                  type: string
                description:
                  type: string
                status:
                  type: string
      responses:
        "200":
          description: Hunt updated
          content:
            application/json:
              schema:
                type: object

  /api/hunts/{id}/phase-next:
    post:
      summary: Advance hunt to next phase
      tags:
        - Hunts
      parameters:
        - name: id
          in: path
          required: true
          schema:
            type: string
      responses:
        "200":
          description: Phase advanced
          content:
            application/json:
              schema:
                type: object

  /api/hunts/{id}/complete:
    post:
      summary: Mark hunt as completed
      tags:
        - Hunts
      parameters:
        - name: id
          in: path
          required: true
          schema:
            type: string
      responses:
        "200":
          description: Hunt completed
          content:
            application/json:
              schema:
                type: object

  /api/analytics:
    get:
      summary: Get team analytics
      tags:
        - Analytics
      responses:
        "200":
          description: Team analytics
          content:
            application/json:
              schema:
                type: object

  /api/analytics/hunts:
    get:
      summary: Get hunt analytics
      tags:
        - Analytics
      responses:
        "200":
          description: Hunt analytics
          content:
            application/json:
              schema:
                type: object

  /api/analytics/performance:
    get:
      summary: Get performance metrics
      tags:
        - Analytics
      responses:
        "200":
          description: Performance metrics
          content:
            application/json:
              schema:
                type: object
```

---

## 📦 Integration Examples

### Frontend Integration

```javascript
// api-client.js - Simple API client wrapper
class APIClient {
  constructor(baseURL = "http://localhost:3000") {
    this.baseURL = baseURL;
  }

  async request(path, options = {}) {
    const response = await fetch(`${this.baseURL}${path}`, {
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      ...options,
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }

    return response.json();
  }

  // Team methods
  async getTeam() {
    return this.request("/api/team");
  }

  async getTeamMembers() {
    return this.request("/api/team/members");
  }

  // Hunt methods
  async getHunts(filters = {}) {
    const query = new URLSearchParams(filters).toString();
    return this.request(`/api/hunts${query ? "?" + query : ""}`);
  }

  async getHunt(id) {
    return this.request(`/api/hunts/${id}`);
  }

  async createHunt(data) {
    return this.request("/api/hunts", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async updateHunt(id, data) {
    return this.request(`/api/hunts/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  async nextPhase(id) {
    return this.request(`/api/hunts/${id}/phase-next`, {
      method: "POST",
    });
  }

  async completeHunt(id) {
    return this.request(`/api/hunts/${id}/complete`, {
      method: "POST",
    });
  }

  // Analytics methods
  async getAnalytics() {
    return this.request("/api/analytics");
  }

  async getHuntAnalytics() {
    return this.request("/api/analytics/hunts");
  }

  async getPerformance() {
    return this.request("/api/analytics/performance");
  }
}

// Usage
const api = new APIClient();
const hunts = await api.getHunts({ status: "active" });
```

---

## 🔧 Troubleshooting

### Server Won't Start

```bash
# Check if port 3000 is in use
lsof -i :3000

# Use different port
leo dashboard start --port 3001
```

### Connection Refused

```bash
# Verify server is running
curl http://localhost:3000/api/status

# Check network connectivity
ping localhost
```

### WebSocket Connection Failed

```javascript
// Increase reconnection attempts
const socket = io("http://localhost:3000", {
  reconnection: true,
  reconnectionDelay: 1000,
  reconnectionDelayMax: 5000,
  reconnectionAttempts: 5,
});
```

---

## 📞 Support

For issues, questions, or feature requests:

- **GitHub Issues**: https://github.com/osp-group/leo-workflow-kit/issues
- **Documentation**: https://github.com/osp-group/leo-workflow-kit/wiki
- **Email**: support@example.com

---

**Last Updated:** October 24, 2025
**Version:** 1.0.0
**Status:** Production Ready
