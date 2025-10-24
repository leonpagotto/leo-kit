# Dashboard API & WebSocket Quick Reference

> **Quick Start Guide** for using the LEO Web Dashboard API and real-time WebSocket events

## 🚀 Starting the Dashboard Server

```javascript
const APIServer = require("./lib/team/api-server");

// Initialize server
const server = new APIServer({ port: 3000, workdir: "." });

// Setup middleware and routes
server._setupMiddleware();
server._setupRoutes();
server._setupWebSocket();

// Start server
await server.start();
console.log("Dashboard running on http://localhost:3000");
```

---

## 📡 REST API Endpoints

### Team Management

#### GET /api/team

Get team information

```bash
curl http://localhost:3000/api/team
```

**Response (200 OK):**

```json
{
  "name": "Team A",
  "size": 5,
  "members": [
    { "id": "1", "name": "Alice", "role": "Developer" },
    { "id": "2", "name": "Bob", "role": "Designer" }
  ],
  "createdAt": "2024-01-15T10:00:00Z",
  "mode": "collaborative"
}
```

#### GET /api/team/members

Get all team members with hunt counts

```bash
curl http://localhost:3000/api/team/members
```

**Response (200 OK):**

```json
[
  {
    "id": "1",
    "name": "Alice",
    "role": "Developer",
    "activeHunts": 3,
    "completedHunts": 12
  },
  {
    "id": "2",
    "name": "Bob",
    "role": "Designer",
    "activeHunts": 1,
    "completedHunts": 8
  }
]
```

---

### Hunt Management

#### GET /api/hunts

List all hunts with optional filtering and pagination

```bash
# Get all hunts
curl http://localhost:3000/api/hunts

# With pagination
curl 'http://localhost:3000/api/hunts?limit=10&offset=20'

# Filter by owner
curl 'http://localhost:3000/api/hunts?owner=Alice'

# Filter by status
curl 'http://localhost:3000/api/hunts?status=active'
```

**Response (200 OK):**

```json
[
  {
    "id": "1",
    "title": "User Authentication Feature",
    "featureName": "Auth System",
    "description": "Implement OAuth2 and JWT",
    "owner": "Alice",
    "priority": "High",
    "currentPhase": "Analysis",
    "progress": 33,
    "phases": [
      { "name": "Discovery", "completed": true },
      { "name": "Analysis", "completed": true },
      { "name": "Implementation", "completed": false }
    ],
    "createdAt": "2024-10-15T10:00:00Z",
    "completedAt": null,
    "duration": 120
  }
]
```

#### GET /api/hunts/:id

Get hunt details with all phases

```bash
curl http://localhost:3000/api/hunts/1
```

**Response (200 OK):**

```json
{
  "id": "1",
  "title": "User Authentication Feature",
  "featureName": "Auth System",
  "description": "Implement OAuth2 and JWT",
  "owner": "Alice",
  "priority": "High",
  "currentPhase": "Analysis",
  "phases": [
    { "name": "Discovery", "completed": true, "durationMin": 15 },
    { "name": "Analysis", "completed": true, "durationMin": 30 },
    { "name": "Implementation", "completed": false, "durationMin": 120 }
  ],
  "createdAt": "2024-10-15T10:00:00Z",
  "completedAt": null,
  "githubIssue": { "number": 42, "url": "https://github.com/..." },
  "slackChannel": "C123456"
}
```

#### GET /api/hunts/:id/phases

Get phase breakdown for a hunt

```bash
curl http://localhost:3000/api/hunts/1/phases
```

**Response (200 OK):**

```json
[
  {
    "name": "Discovery",
    "completed": true,
    "completedAt": "2024-10-15T11:00:00Z"
  },
  {
    "name": "Analysis",
    "completed": true,
    "completedAt": "2024-10-15T12:00:00Z"
  },
  { "name": "Implementation", "completed": false, "completedAt": null }
]
```

#### POST /api/hunts

Create a new hunt

```bash
curl -X POST http://localhost:3000/api/hunts \
  -H "Content-Type: application/json" \
  -d '{
    "title": "New Feature Hunt",
    "description": "Feature description here",
    "owner": "Alice",
    "priority": "High"
  }'
```

**Response (201 Created):**

```json
{
  "id": "123",
  "title": "New Feature Hunt",
  "description": "Feature description here",
  "owner": "Alice",
  "priority": "High",
  "currentPhase": "Discovery",
  "createdAt": "2024-10-24T15:30:00Z",
  "phases": []
}
```

**Validation Errors (400 Bad Request):**

```json
{
  "error": "Title is required"
}
```

#### PUT /api/hunts/:id

Update hunt metadata

```bash
curl -X PUT http://localhost:3000/api/hunts/1 \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Updated Title",
    "priority": "Critical"
  }'
```

**Response (200 OK):**

```json
{
  "id": "1",
  "title": "Updated Title",
  "priority": "Critical",
  "updatedAt": "2024-10-24T15:35:00Z"
}
```

#### POST /api/hunts/:id/phase-next

Move hunt to next phase

```bash
curl -X POST http://localhost:3000/api/hunts/1/phase-next
```

**Response (200 OK):**

```json
{
  "huntId": "1",
  "previousPhase": "Analysis",
  "currentPhase": "Implementation",
  "timestamp": "2024-10-24T15:40:00Z"
}
```

#### POST /api/hunts/:id/complete

Mark hunt as completed

```bash
curl -X POST http://localhost:3000/api/hunts/1/complete
```

**Response (200 OK):**

```json
{
  "huntId": "1",
  "completed": true,
  "completedAt": "2024-10-24T15:45:00Z",
  "duration": 240,
  "success": true
}
```

---

### Analytics

#### GET /api/analytics

Get overall team analytics

```bash
curl http://localhost:3000/api/analytics
```

**Response (200 OK):**

```json
{
  "activeHunts": 5,
  "completedHunts": 42,
  "totalHunts": 47,
  "teamSize": 3,
  "avgDuration": 145,
  "successRate": 94.1,
  "thisWeek": {
    "huntsCompleted": 8,
    "avgDuration": 120
  }
}
```

#### GET /api/analytics/hunts

Get per-hunt statistics

```bash
curl http://localhost:3000/api/analytics/hunts
```

**Response (200 OK):**

```json
[
  {
    "huntId": "1",
    "title": "Auth System",
    "owner": "Alice",
    "duration": 240,
    "completedAt": "2024-10-20T16:00:00Z",
    "phaseTiming": {
      "Discovery": 30,
      "Analysis": 45,
      "Implementation": 165
    }
  },
  {
    "huntId": "2",
    "title": "Dashboard UI",
    "owner": "Bob",
    "duration": 180,
    "completedAt": "2024-10-22T14:30:00Z"
  }
]
```

#### GET /api/analytics/performance

Get detailed performance metrics

```bash
curl http://localhost:3000/api/analytics/performance
```

**Response (200 OK):**

```json
{
  "throughput": 2.5,
  "avgDuration": 145,
  "efficiency": 0.85,
  "successRate": 94.1,
  "velocity": {
    "weekly": 8,
    "monthly": 32
  },
  "memberPerformance": [
    {
      "name": "Alice",
      "huntsCompleted": 15,
      "avgDuration": 130,
      "successRate": 100
    },
    {
      "name": "Bob",
      "huntsCompleted": 12,
      "avgDuration": 160,
      "successRate": 92
    }
  ]
}
```

---

## 🔄 WebSocket Events

### Client Connection

When a client connects, they automatically:

1. Join the `team` room
2. Receive `initial:state` with existing data

```javascript
// Frontend (JavaScript)
const socket = io("http://localhost:3000");

socket.on("connect", () => {
  console.log("Connected to dashboard");
});

socket.on("initial:state", (data) => {
  console.log("Team data:", data.team);
  console.log("Hunts:", data.hunts);
  console.log("Connected clients:", data.connectedClients);
});
```

### Hunt Events

#### hunt:created

Fired when a new hunt is created

```javascript
socket.on("hunt:created", (hunt) => {
  console.log("New hunt:", hunt);
  // {
  //   id: '1',
  //   title: 'New Hunt',
  //   owner: 'Alice',
  //   createdAt: '2024-10-24T15:30:00Z'
  // }
});
```

#### hunt:updated

Fired when hunt metadata is updated

```javascript
socket.on("hunt:updated", (hunt) => {
  console.log("Hunt updated:", hunt);
  // {
  //   id: '1',
  //   title: 'Updated Title',
  //   priority: 'Critical',
  //   updatedAt: '2024-10-24T15:35:00Z'
  // }
});
```

#### hunt:phase-changed

Fired when hunt moves to next phase

```javascript
socket.on("hunt:phase-changed", (data) => {
  console.log("Phase changed:", data);
  // {
  //   huntId: '1',
  //   previousPhase: 'Analysis',
  //   newPhase: 'Implementation',
  //   timestamp: '2024-10-24T15:40:00Z'
  // }
});
```

#### hunt:completed

Fired when hunt is completed

```javascript
socket.on("hunt:completed", (data) => {
  console.log("Hunt completed:", data);
  // {
  //   huntId: '1',
  //   completedAt: '2024-10-24T15:45:00Z',
  //   duration: 240,
  //   success: true
  // }
});
```

### Error Events

```javascript
socket.on("error", (error) => {
  console.error("Dashboard error:", error);
  // {
  //   code: 'HUNT_CREATE_ERROR',
  //   message: 'Failed to create hunt',
  //   details: { ... }
  // }
});
```

### Broadcasting

Send event to all connected team members (backend):

```javascript
// Backend (Node.js)
server._broadcast("hunt:created", {
  id: "1",
  title: "New Hunt",
  owner: "Alice",
});
```

---

## 🛠️ API Client Utility (Frontend)

### Basic Usage

```javascript
// Create API client
const client = new DashboardAPI("http://localhost:3000");

// Fetch team
const team = await client.getTeam();

// Fetch all hunts
const hunts = await client.getHunts();

// Get hunt details
const hunt = await client.getHuntDetail("1");

// Create new hunt
const newHunt = await client.createHunt({
  title: "Feature Hunt",
  description: "Description here",
  owner: "Alice",
});

// Update hunt
await client.updateHunt("1", { title: "Updated" });

// Move to next phase
await client.nextPhase("1");

// Complete hunt
await client.completeHunt("1");

// Get analytics
const stats = await client.getAnalytics();
```

---

## 📊 Response Status Codes

| Code | Meaning      | Example                |
| ---- | ------------ | ---------------------- |
| 200  | OK           | Successful GET/PUT     |
| 201  | Created      | Successful POST        |
| 400  | Bad Request  | Missing required field |
| 404  | Not Found    | Hunt doesn't exist     |
| 500  | Server Error | Unexpected error       |

---

## 🔐 Security Considerations

- ✅ CORS enabled for authorized origins
- ✅ Input validation on all endpoints
- ✅ Error messages don't leak internal details
- ✅ Request rate limiting (recommended in production)
- ✅ HTTPS only (recommended in production)

---

## 🚀 Performance Tips

1. **Pagination:** Always use `limit` and `offset` for large datasets
2. **Filtering:** Use `owner` and `status` filters to reduce data transfer
3. **WebSocket:** Subscribe to specific events, don't fetch constantly
4. **Caching:** Cache hunt data locally, update on WebSocket events
5. **Batching:** Group multiple updates into single WebSocket events

---

## 📚 Related Documentation

- [Phase 3 Specification](./PHASE_3_WEEK_3_DASHBOARD.md)
- [API Server Code](../lib/team/api-server.js)
- [Test Documentation](../tests/api-server.test.js)
