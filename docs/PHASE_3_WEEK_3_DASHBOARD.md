# 🚀 Phase 3 Week 3 - Web Dashboard (REST API & WebSocket)

**Week**: Week 3-4 of Phase 3
**Duration**: 2 weeks (10 business days)
**Focus**: Real-time web dashboard with REST API and WebSocket
**Status**: 🎯 Ready to Begin

---

## 📋 Week 3-4 Overview

**Primary Objective**: Build interactive web dashboard for real-time hunt tracking and team visualization

**Deliverables**:

- ✅ `lib/team/api-server.js` - Express server with REST API (300-400 lines)
- ✅ `web/` - Dashboard frontend (HTML/CSS/JavaScript)
- ✅ Dashboard pages (overview, team, hunts, analytics)
- ✅ Real-time WebSocket updates
- ✅ Integration tests (10+ test cases)
- ✅ Complete documentation

---

## 🏗️ Architecture Design

### Backend Architecture

```
APIServer (lib/team/api-server.js)
├── Express Server
│   ├── Middleware
│   │   ├── CORS
│   │   ├── Body Parser
│   │   ├── Auth Middleware
│   │   └── Error Handler
│   │
│   ├── REST API Endpoints
│   │   ├── GET /api/team - Team information
│   │   ├── GET /api/team/members - Team members
│   │   ├── GET /api/hunts - All hunts
│   │   ├── GET /api/hunts/:id - Hunt details
│   │   ├── GET /api/hunts/:id/phases - Hunt phases
│   │   ├── POST /api/hunts - Create hunt
│   │   ├── PUT /api/hunts/:id - Update hunt
│   │   ├── POST /api/hunts/:id/phase-next - Next phase
│   │   ├── POST /api/hunts/:id/complete - Complete hunt
│   │   ├── GET /api/analytics - Team analytics
│   │   ├── GET /api/analytics/hunts - Hunt analytics
│   │   └── GET /api/analytics/performance - Performance metrics
│   │
│   ├── WebSocket Events
│   │   ├── connect - Client connects
│   │   ├── hunt:created - New hunt created
│   │   ├── hunt:phase-changed - Phase transitioned
│   │   ├── hunt:completed - Hunt finished
│   │   ├── team:updated - Team changed
│   │   └── disconnect - Client disconnects
│   │
│   └── Error Handling
│       ├── 400 Bad Request
│       ├── 401 Unauthorized
│       ├── 404 Not Found
│       ├── 500 Server Error
│       └── WebSocket errors
│
└── Data Layer
    ├── HuntCycleTracker
    ├── TeamPack
    ├── AnalyticsEngine
    └── File-based persistence
```

### Frontend Architecture

```
Dashboard (web/)
├── index.html - Main app shell
├── app.js - Core app logic
│   ├── Router
│   │   ├── / (home/overview)
│   │   ├── /team (team composition)
│   │   ├── /hunts (hunt tracking)
│   │   ├── /hunts/:id (hunt detail)
│   │   ├── /analytics (metrics)
│   │   └── /settings (configuration)
│   │
│   ├── State Management
│   │   ├── Team state
│   │   ├── Hunts state
│   │   ├── Analytics state
│   │   └── UI state
│   │
│   └── WebSocket Client
│       ├── Connection management
│       ├── Event listeners
│       ├── Reconnection logic
│       └── Data synchronization
│
├── components/
│   ├── HuntCard.js - Individual hunt display
│   ├── HuntBoard.js - All hunts grid
│   ├── TeamDisplay.js - Team members view
│   ├── PhaseBar.js - Phase progression
│   ├── MetricsChart.js - Analytics charts
│   ├── Timeline.js - Hunt timeline
│   └── StatusIndicator.js - Real-time status
│
├── styles/
│   ├── main.css - Base styles
│   ├── dashboard.css - Dashboard layout
│   ├── components.css - Component styles
│   ├── responsive.css - Mobile/tablet
│   └── dark-mode.css - Dark mode support
│
└── utils/
    ├── api.js - API client
    ├── websocket.js - WebSocket client
    ├── formatting.js - Data formatting
    ├── charts.js - Chart library
    └── storage.js - Local storage
```

---

## 📝 Implementation Details

### Week 3: API Server & Backend (Days 1-5)

#### Day 1-2: Express Server Setup

**File**: `lib/team/api-server.js`

```javascript
class APIServer {
  constructor(config = {}) {
    this.app = express();
    this.server = null;
    this.io = null;
    this.port = config.port || 3000;
    this.config = config;
  }

  // Middleware setup
  setupMiddleware() {
    this.app.use(cors());
    this.app.use(bodyParser.json());
    this.app.use(errorHandler);
  }

  // Route setup
  setupRoutes() {
    // Team routes
    this.app.get("/api/team", this.getTeam);
    this.app.get("/api/team/members", this.getTeamMembers);

    // Hunt routes
    this.app.get("/api/hunts", this.getHunts);
    this.app.get("/api/hunts/:id", this.getHuntDetail);
    this.app.post("/api/hunts", this.createHunt);
    this.app.put("/api/hunts/:id", this.updateHunt);
    this.app.post("/api/hunts/:id/phase-next", this.nextPhase);
    this.app.post("/api/hunts/:id/complete", this.completeHunt);

    // Analytics routes
    this.app.get("/api/analytics", this.getAnalytics);
    this.app.get("/api/analytics/hunts", this.getHuntAnalytics);
    this.app.get("/api/analytics/performance", this.getPerformanceMetrics);
  }

  // WebSocket setup
  setupWebSocket() {
    this.io = socketIO(this.server);
    this.io.on("connection", this.handleConnection);
  }

  // Start server
  start() {
    this.server = this.app.listen(this.port);
    this.setupWebSocket();
    console.log(`API server running on port ${this.port}`);
  }

  // Stop server
  stop() {
    this.server.close();
    this.io.close();
  }
}

module.exports = APIServer;
```

**Tests** (5-10 tests):

- Server starts/stops
- Middleware configured
- Routes registered
- Error handling

#### Day 3-4: REST API Implementation

**Endpoints** (12 total):

```javascript
// Team endpoints
GET /api/team
// Response: { name, size, members: [...], roles: [...] }

GET /api/team/members
// Response: [{ id, name, role, hunts: [...] }, ...]

// Hunt endpoints
GET /api/hunts
// Response: [{ id, title, phase, progress, owner }, ...]

GET /api/hunts/:id
// Response: { id, title, description, phases: [...], owner, created, updated }

POST /api/hunts
// Payload: { title, description, owner }
// Response: { id, title, ... }

PUT /api/hunts/:id
// Payload: { title, description, ... }
// Response: updated hunt

POST /api/hunts/:id/phase-next
// Response: { phase, updatedAt }

POST /api/hunts/:id/complete
// Response: { completed, metrics }

// Analytics endpoints
GET /api/analytics
// Response: { activeHunts, completedHunts, avgDuration, ... }

GET /api/analytics/hunts
// Response: [{ huntId, phases, duration, completedAt }, ...]

GET /api/analytics/performance
// Response: { throughput, velocity, efficiency, ... }
```

**Tests** (15+ tests):

- Each endpoint returns correct data
- Error handling (404, 400, 500)
- Input validation
- Response format

#### Day 5: WebSocket Implementation

**WebSocket Events**:

```javascript
// Connection
socket.on("connect", () => {
  // Join room for team
  socket.join("team");
  socket.emit("connected", { message: "Connected to server" });
});

// Hunt events
socket.on("hunt:created", (data) => {
  // { huntId, title, owner, createdAt }
  io.to("team").emit("hunt:created", data);
});

socket.on("hunt:phase-changed", (data) => {
  // { huntId, phase, duration }
  io.to("team").emit("hunt:phase-changed", data);
});

socket.on("hunt:completed", (data) => {
  // { huntId, metrics, completedAt }
  io.to("team").emit("hunt:completed", data);
});

// Disconnect
socket.on("disconnect", () => {
  console.log("Client disconnected");
});
```

**Tests** (10+ tests):

- WebSocket connects
- Events broadcast correctly
- Reconnection logic
- Error recovery

### Week 4: Frontend Dashboard (Days 6-10)

#### Day 6-7: Frontend Setup & Layout

**Files**:

- `web/index.html` - App shell (80 lines)
- `web/app.js` - Core logic (200+ lines)
- `web/styles/main.css` - Base styles (300+ lines)
- `web/utils/api.js` - API client (100 lines)
- `web/utils/websocket.js` - WebSocket client (100 lines)

**Index Layout**:

```html
<div id="app">
  <nav class="header">
    <h1>LionPack Dashboard</h1>
    <ul class="nav-links">
      <li><a href="/">Overview</a></li>
      <li><a href="/team">Team</a></li>
      <li><a href="/hunts">Hunts</a></li>
      <li><a href="/analytics">Analytics</a></li>
    </ul>
  </nav>

  <main class="container">
    <div id="router-outlet"></div>
  </main>

  <footer class="status-bar">
    <span class="connection-status">●</span>
    <span class="update-time">Last updated: ...</span>
  </footer>
</div>
```

**Tests** (5+ tests):

- DOM renders
- Navigation works
- WebSocket connects
- API calls made

#### Day 8: Dashboard Pages

**Pages** (4 main pages):

1. **Overview Page** (`/`)

   - Active hunts count
   - Recent activity
   - Key metrics
   - Quick actions

2. **Team Page** (`/team`)

   - Team members
   - Roles
   - Current hunts
   - Performance

3. **Hunts Page** (`/hunts`)

   - Hunt list/grid
   - Filter options
   - Sort options
   - Create new hunt

4. **Analytics Page** (`/analytics`)
   - Charts (velocity, duration, success rate)
   - Trends
   - Performance metrics
   - Export options

**Tests** (10+ tests):

- Pages render
- Data displays
- User interactions work
- Responsive design

#### Day 9-10: Components & Styling

**Components** (7 main components):

1. **HuntCard** - Individual hunt display with status
2. **HuntBoard** - Grid/list view of hunts
3. **TeamDisplay** - Team members and roles
4. **PhaseBar** - Progress through phases
5. **MetricsChart** - Analytics visualization
6. **Timeline** - Hunt progression timeline
7. **StatusIndicator** - Real-time connection status

**Styling**:

- Responsive design (mobile, tablet, desktop)
- Light/dark mode support
- Color-coded statuses
- Smooth animations
- Loading states

**Tests** (10+ tests):

- Components render
- Props handled correctly
- User interactions
- Responsive layouts

---

## 📊 Quality Standards

### Testing

- Unit tests: 30+ tests
- Integration tests: 15+ tests
- E2E tests: 5+ scenarios
- Coverage: 75%+ (API + Frontend)
- Pass rate: 100%

### Code Quality

- Zero compiler errors
- Zero lint warnings
- Clear code comments
- Consistent formatting
- TypeScript ready (optional)

### Performance

- Dashboard loads: < 2 seconds
- API responses: < 500ms
- WebSocket updates: < 100ms
- No memory leaks
- Handles 10+ concurrent clients

### Security

- Input validation
- CORS properly configured
- No sensitive data in logs
- Rate limiting
- Error messages don't leak info

---

## 📁 File Structure

```
web/
├── index.html (80 lines)
├── app.js (200+ lines)
├── components/
│   ├── HuntCard.js (80 lines)
│   ├── HuntBoard.js (100 lines)
│   ├── TeamDisplay.js (80 lines)
│   ├── PhaseBar.js (60 lines)
│   ├── MetricsChart.js (100 lines)
│   ├── Timeline.js (80 lines)
│   └── StatusIndicator.js (40 lines)
├── styles/
│   ├── main.css (300+ lines)
│   ├── dashboard.css (200 lines)
│   ├── components.css (300 lines)
│   ├── responsive.css (200 lines)
│   └── dark-mode.css (100 lines)
└── utils/
    ├── api.js (100 lines)
    ├── websocket.js (100 lines)
    ├── formatting.js (80 lines)
    ├── charts.js (150 lines)
    └── storage.js (60 lines)

lib/team/
├── api-server.js (350-400 lines)
└── ... (existing files)

tests/
├── api-server.test.js (200+ lines)
├── integration/dashboard.e2e.test.js (300+ lines)
└── ... (existing tests)
```

---

## 🔄 Integration Points

### With Existing Code

- Uses `HuntCycleTracker` for hunt data
- Uses `TeamPack` for team information
- Uses `AnalyticsEngine` for metrics
- Uses configuration from `ConfigurationManager`
- Respects GitHub/Slack integrations

### With GitHub Integration

- Display GitHub issue links in dashboard
- Show GitHub sync status
- GitHub data in analytics

### With Slack Integration

- Slack notifications for dashboard events
- Sync dashboard updates to Slack
- Slack username display

---

## 📚 Documentation

### User Documentation

1. **Dashboard Getting Started** (500 lines)

   - How to access dashboard
   - Main dashboard features
   - Navigation guide
   - Keyboard shortcuts

2. **Hunt Tracking Guide** (400 lines)

   - View hunt status
   - Create hunts
   - Update phases
   - Complete hunts

3. **Analytics Guide** (300 lines)
   - Understanding charts
   - Metrics explained
   - Performance metrics
   - Exporting data

### Developer Documentation

1. **API Documentation** (500+ lines)

   - Endpoint reference
   - Request/response formats
   - Error codes
   - Examples

2. **WebSocket Documentation** (300 lines)

   - Event reference
   - Connection setup
   - Reconnection logic
   - Error handling

3. **Frontend Architecture** (400 lines)
   - Component structure
   - State management
   - API integration
   - WebSocket integration

---

## 🎯 Success Criteria

✅ API server starts and responds to requests
✅ All 12+ REST endpoints working
✅ WebSocket connects and updates real-time
✅ Dashboard pages load and display data
✅ All 7 components render correctly
✅ Responsive design works on mobile/tablet/desktop
✅ 30+ unit tests passing
✅ 15+ integration tests passing
✅ 5+ E2E scenarios passing
✅ 75%+ code coverage
✅ Zero compiler errors/warnings
✅ Performance targets met
✅ Documentation complete

---

## 🚀 Next Steps

1. **Week 3-4**: Complete web dashboard and REST API
2. **Week 5**: CLI integration and wiring
3. **Week 6**: End-to-end testing
4. **Week 7**: Documentation refinement
5. **Week 8**: Final release

---

**Start Date**: October 24, 2025
**Target Completion**: November 7, 2025
**Status**: 🎯 Ready to Begin
