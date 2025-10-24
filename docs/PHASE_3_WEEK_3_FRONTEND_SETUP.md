# Dashboard Frontend Setup Guide - Days 5-6

> **Phase 3 Week 3 Days 5-6:** Frontend HTML, CSS, and utilities setup

## 🎯 Objectives

- Create HTML shell structure
- Implement API client utility
- Implement WebSocket client utility
- Create base CSS framework
- Setup responsive design foundation

**Deliverables:** 500+ lines of HTML/CSS/JS utilities

---

## 📋 File Structure

```
web/
├── index.html          (80+ lines)   - HTML shell
├── js/
│   ├── app.js         (200+ lines)   - Main app logic
│   ├── api.js         (100+ lines)   - API client utility
│   └── websocket.js   (100+ lines)   - WebSocket client
└── css/
    ├── main.css       (300+ lines)   - Base styling
    ├── responsive.css (200+ lines)   - Responsive design
    └── dark-mode.css  (100+ lines)   - Dark mode support
```

**Total:** 1,080+ lines

---

## 📄 1. index.html - HTML Shell

Create `web/index.html`:

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta
      name="description"
      content="LEO Hunt Dashboard - Team Feature Hunting"
    />
    <title>LEO Dashboard</title>

    <!-- Stylesheets -->
    <link rel="stylesheet" href="css/main.css" />
    <link rel="stylesheet" href="css/responsive.css" />
    <link rel="stylesheet" href="css/dark-mode.css" />

    <!-- Favicon -->
    <link
      rel="icon"
      type="image/svg+xml"
      href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='75' font-size='75' fill='%23FF6B6B'>⚡</text></svg>"
    />
  </head>
  <body>
    <div id="root">
      <!-- Main App Container -->
      <div class="app">
        <!-- Navigation -->
        <nav class="navbar">
          <div class="navbar-container">
            <div class="logo">
              <span class="logo-icon">⚡</span>
              <span class="logo-text">LEO Dashboard</span>
            </div>

            <ul class="nav-menu">
              <li>
                <a href="#" data-page="overview" class="nav-link active"
                  >Overview</a
                >
              </li>
              <li><a href="#" data-page="team" class="nav-link">Team</a></li>
              <li><a href="#" data-page="hunts" class="nav-link">Hunts</a></li>
              <li>
                <a href="#" data-page="analytics" class="nav-link">Analytics</a>
              </li>
            </ul>

            <div class="nav-actions">
              <button
                id="theme-toggle"
                class="btn-icon"
                title="Toggle dark mode"
              >
                🌙
              </button>
              <button id="refresh-btn" class="btn-icon" title="Refresh data">
                🔄
              </button>
            </div>
          </div>
        </nav>

        <!-- Status Bar -->
        <div class="status-bar">
          <div class="status-item">
            <span class="status-label">Status:</span>
            <span id="connection-status" class="status-value">●</span>
          </div>
          <div class="status-item">
            <span class="status-label">Connected Clients:</span>
            <span id="client-count" class="status-value">0</span>
          </div>
          <div class="status-item">
            <span class="status-label">Last Update:</span>
            <span id="last-update" class="status-value">--:--</span>
          </div>
        </div>

        <!-- Main Content Area -->
        <main class="main-content">
          <!-- Page Placeholder -->
          <div id="page-container" class="page-container">
            <div class="loading">
              <div class="spinner"></div>
              <p>Loading dashboard...</p>
            </div>
          </div>
        </main>

        <!-- Footer -->
        <footer class="footer">
          <p>LEO Workflow Kit • Phase 3 Dashboard • v1.0.0</p>
        </footer>
      </div>

      <!-- Modal for Creating Hunts -->
      <div id="create-modal" class="modal">
        <div class="modal-content">
          <div class="modal-header">
            <h2>Create New Hunt</h2>
            <button class="btn-close">&times;</button>
          </div>
          <div class="modal-body">
            <form id="create-hunt-form">
              <div class="form-group">
                <label for="hunt-title">Title *</label>
                <input
                  type="text"
                  id="hunt-title"
                  placeholder="Hunt title"
                  required
                />
              </div>
              <div class="form-group">
                <label for="hunt-description">Description</label>
                <textarea
                  id="hunt-description"
                  placeholder="Hunt description"
                  rows="4"
                ></textarea>
              </div>
              <div class="form-group">
                <label for="hunt-owner">Owner *</label>
                <select id="hunt-owner" required>
                  <option value="">Select owner</option>
                </select>
              </div>
              <div class="form-group">
                <label for="hunt-priority">Priority</label>
                <select id="hunt-priority">
                  <option value="Low">Low</option>
                  <option value="Medium" selected>Medium</option>
                  <option value="High">High</option>
                  <option value="Critical">Critical</option>
                </select>
              </div>
            </form>
          </div>
          <div class="modal-footer">
            <button class="btn btn-secondary" id="modal-cancel">Cancel</button>
            <button class="btn btn-primary" id="modal-create">
              Create Hunt
            </button>
          </div>
        </div>
      </div>

      <!-- Notification Container -->
      <div id="notifications" class="notifications"></div>
    </div>

    <!-- Socket.IO Client -->
    <script src="https://cdn.socket.io/4.5.4/socket.io.min.js"></script>

    <!-- App Scripts -->
    <script src="js/api.js"></script>
    <script src="js/websocket.js"></script>
    <script src="js/app.js"></script>
  </body>
</html>
```

**Key Features:**

- Responsive navigation bar
- Status connection indicator
- Main content area (pages)
- Modal for creating hunts
- Notification container
- Dark mode toggle
- SEO-friendly structure

---

## 🔌 2. api.js - API Client Utility

Create `web/js/api.js`:

```javascript
/**
 * Dashboard API Client
 * Wrapper around REST API endpoints
 */
class DashboardAPI {
  constructor(baseURL = "") {
    this.baseURL = baseURL || "";
    this.timeout = 10000; // 10 seconds
  }

  /**
   * Make HTTP request
   */
  async request(method, endpoint, data = null) {
    const url = `${this.baseURL}/api${endpoint}`;

    const options = {
      method,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    };

    if (data) {
      options.body = JSON.stringify(data);
    }

    try {
      const response = await Promise.race([
        fetch(url, options),
        new Promise((_, reject) =>
          setTimeout(() => reject(new Error("Request timeout")), this.timeout)
        ),
      ]);

      if (!response.ok) {
        throw new Error(`API Error: ${response.status} ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error("API request failed:", error);
      throw error;
    }
  }

  // Team Endpoints

  async getTeam() {
    return this.request("GET", "/team");
  }

  async getTeamMembers() {
    return this.request("GET", "/team/members");
  }

  // Hunt Endpoints

  async getHunts(options = {}) {
    const params = new URLSearchParams();
    if (options.limit) params.append("limit", options.limit);
    if (options.offset) params.append("offset", options.offset);
    if (options.owner) params.append("owner", options.owner);
    if (options.status) params.append("status", options.status);

    const query = params.toString() ? `?${params.toString()}` : "";
    return this.request("GET", `/hunts${query}`);
  }

  async getHuntDetail(huntId) {
    return this.request("GET", `/hunts/${huntId}`);
  }

  async getHuntPhases(huntId) {
    return this.request("GET", `/hunts/${huntId}/phases`);
  }

  async createHunt(data) {
    return this.request("POST", "/hunts", data);
  }

  async updateHunt(huntId, data) {
    return this.request("PUT", `/hunts/${huntId}`, data);
  }

  async nextPhase(huntId) {
    return this.request("POST", `/hunts/${huntId}/phase-next`);
  }

  async completeHunt(huntId) {
    return this.request("POST", `/hunts/${huntId}/complete`);
  }

  // Analytics Endpoints

  async getAnalytics() {
    return this.request("GET", "/analytics");
  }

  async getHuntAnalytics() {
    return this.request("GET", "/analytics/hunts");
  }

  async getPerformanceMetrics() {
    return this.request("GET", "/analytics/performance");
  }
}

// Export for use in other modules
if (typeof module !== "undefined" && module.exports) {
  module.exports = DashboardAPI;
}
```

**Key Features:**

- All 12 REST endpoints wrapped
- Error handling and timeouts
- Parameter serialization
- Consistent request/response handling
- Extensible design

---

## 📡 3. websocket.js - WebSocket Client Utility

Create `web/js/websocket.js`:

```javascript
/**
 * WebSocket Client for Real-time Dashboard Updates
 * Handles Socket.IO connections and event subscriptions
 */
class DashboardWebSocket {
  constructor(options = {}) {
    this.url = options.url || "";
    this.socket = null;
    this.connected = false;
    this.listeners = new Map();
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 5;
    this.reconnectDelay = 1000;
  }

  /**
   * Connect to WebSocket
   */
  connect() {
    return new Promise((resolve, reject) => {
      try {
        this.socket = io(this.url, {
          reconnection: true,
          reconnectionDelay: this.reconnectDelay,
          reconnectionDelayMax: 5000,
          reconnectionAttempts: this.maxReconnectAttempts,
        });

        this.socket.on("connect", () => {
          console.log("WebSocket connected:", this.socket.id);
          this.connected = true;
          this.reconnectAttempts = 0;
          this.emit("connected", { socketId: this.socket.id });
          resolve();
        });

        this.socket.on("disconnect", (reason) => {
          console.log("WebSocket disconnected:", reason);
          this.connected = false;
          this.emit("disconnected", { reason });
        });

        this.socket.on("connect_error", (error) => {
          console.error("WebSocket connection error:", error);
          this.emit("error", { type: "connection", error });
          reject(error);
        });

        this.socket.on("error", (error) => {
          console.error("WebSocket error:", error);
          this.emit("error", { type: "server", error });
        });

        // Setup event forwarding
        this.setupEventForwarding();
      } catch (error) {
        reject(error);
      }
    });
  }

  /**
   * Disconnect WebSocket
   */
  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.connected = false;
    }
  }

  /**
   * Setup automatic event forwarding
   */
  setupEventForwarding() {
    const events = [
      "initial:state",
      "hunt:created",
      "hunt:updated",
      "hunt:phase-changed",
      "hunt:completed",
      "error",
    ];

    events.forEach((event) => {
      this.socket.on(event, (data) => {
        this.emit(event, data);
      });
    });
  }

  /**
   * Subscribe to event
   */
  on(event, callback) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event).push(callback);
  }

  /**
   * Unsubscribe from event
   */
  off(event, callback) {
    if (this.listeners.has(event)) {
      const callbacks = this.listeners.get(event);
      const index = callbacks.indexOf(callback);
      if (index > -1) {
        callbacks.splice(index, 1);
      }
    }
  }

  /**
   * Emit event to local listeners
   */
  emit(event, data) {
    if (this.listeners.has(event)) {
      this.listeners.get(event).forEach((callback) => {
        try {
          callback(data);
        } catch (error) {
          console.error(`Error in event listener for ${event}:`, error);
        }
      });
    }
  }

  /**
   * Send event to server
   */
  send(event, data) {
    if (this.socket && this.connected) {
      this.socket.emit(event, data);
    } else {
      console.warn("WebSocket not connected, cannot send:", event);
    }
  }

  /**
   * Check connection status
   */
  isConnected() {
    return this.connected && this.socket?.connected;
  }

  /**
   * Get socket ID
   */
  getSocketId() {
    return this.socket?.id || null;
  }
}

// Export for use in other modules
if (typeof module !== "undefined" && module.exports) {
  module.exports = DashboardWebSocket;
}
```

**Key Features:**

- Automatic reconnection
- Event subscription system
- Error handling
- Connection status tracking
- Event forwarding
- Clean API

---

## 🎨 4. main.css - Base Styling

Create `web/css/main.css`:

```css
/* ========================================
   LEO Dashboard - Main Stylesheet
   ======================================== */

/* CSS Variables */
:root {
  /* Colors */
  --primary: #ff6b6b;
  --primary-dark: #e63946;
  --secondary: #457b9d;
  --success: #06a77d;
  --warning: #f4a460;
  --danger: #e63946;
  --info: #457b9d;

  --bg-primary: #ffffff;
  --bg-secondary: #f8f9fa;
  --text-primary: #2c3e50;
  --text-secondary: #7f8c8d;
  --border-color: #e8e8e8;

  /* Spacing */
  --spacing-xs: 4px;
  --spacing-sm: 8px;
  --spacing-md: 16px;
  --spacing-lg: 24px;
  --spacing-xl: 32px;
  --spacing-2xl: 48px;

  /* Typography */
  --font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen,
    Ubuntu, Cantarell, sans-serif;
  --font-mono: "Monaco", "Menlo", "Courier New", monospace;
  --font-size-sm: 12px;
  --font-size-base: 14px;
  --font-size-md: 16px;
  --font-size-lg: 18px;
  --font-size-xl: 20px;
  --font-size-2xl: 24px;

  /* Shadows */
  --shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.05);
  --shadow-md: 0 4px 6px rgba(0, 0, 0, 0.1);
  --shadow-lg: 0 10px 15px rgba(0, 0, 0, 0.1);
  --shadow-xl: 0 20px 25px rgba(0, 0, 0, 0.1);

  /* Borders */
  --border-radius: 8px;
  --border-width: 1px;
}

/* Reset and Base Styles */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html,
body {
  height: 100%;
}

body {
  font-family: var(--font-family);
  font-size: var(--font-size-base);
  line-height: 1.6;
  color: var(--text-primary);
  background-color: var(--bg-primary);
}

/* App Layout */
.app {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

/* Navbar */
.navbar {
  background-color: var(--bg-primary);
  border-bottom: var(--border-width) solid var(--border-color);
  box-shadow: var(--shadow-sm);
  position: sticky;
  top: 0;
  z-index: 100;
}

.navbar-container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--spacing-md) var(--spacing-lg);
  max-width: 1400px;
  margin: 0 auto;
  width: 100%;
}

.logo {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  font-weight: 700;
  font-size: var(--font-size-xl);
  color: var(--primary);
  text-decoration: none;
}

.logo-icon {
  font-size: var(--font-size-2xl);
}

.nav-menu {
  display: flex;
  list-style: none;
  gap: var(--spacing-lg);
  margin: 0;
  padding: 0;
}

.nav-link {
  text-decoration: none;
  color: var(--text-primary);
  font-weight: 500;
  padding: var(--spacing-sm) var(--spacing-md);
  border-radius: var(--border-radius);
  transition: all 0.2s ease;
  cursor: pointer;
}

.nav-link:hover,
.nav-link.active {
  background-color: var(--bg-secondary);
  color: var(--primary);
}

.nav-actions {
  display: flex;
  gap: var(--spacing-md);
}

.btn-icon {
  background: none;
  border: none;
  font-size: var(--font-size-lg);
  cursor: pointer;
  padding: var(--spacing-sm);
  border-radius: var(--border-radius);
  transition: all 0.2s ease;
}

.btn-icon:hover {
  background-color: var(--bg-secondary);
  transform: scale(1.05);
}

/* Status Bar */
.status-bar {
  display: flex;
  gap: var(--spacing-xl);
  padding: var(--spacing-sm) var(--spacing-lg);
  background-color: var(--bg-secondary);
  border-bottom: var(--border-width) solid var(--border-color);
  font-size: var(--font-size-sm);
}

.status-item {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
}

.status-label {
  color: var(--text-secondary);
  font-weight: 500;
}

.status-value {
  color: var(--text-primary);
  font-weight: 600;
}

#connection-status {
  display: inline-block;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: var(--success);
  animation: pulse 2s infinite;
}

#connection-status.disconnected {
  background-color: var(--danger);
  animation: none;
}

@keyframes pulse {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

/* Main Content */
.main-content {
  flex: 1;
  padding: var(--spacing-xl);
  max-width: 1400px;
  width: 100%;
  margin: 0 auto;
}

.page-container {
  width: 100%;
}

/* Loading State */
.loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-lg);
  padding: var(--spacing-2xl);
  text-align: center;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 3px solid var(--border-color);
  border-top-color: var(--primary);
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

/* Buttons */
.btn {
  padding: var(--spacing-sm) var(--spacing-md);
  border: none;
  border-radius: var(--border-radius);
  font-family: var(--font-family);
  font-size: var(--font-size-base);
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  display: inline-flex;
  align-items: center;
  gap: var(--spacing-sm);
}

.btn-primary {
  background-color: var(--primary);
  color: white;
}

.btn-primary:hover {
  background-color: var(--primary-dark);
  box-shadow: var(--shadow-md);
}

.btn-secondary {
  background-color: var(--bg-secondary);
  color: var(--text-primary);
  border: var(--border-width) solid var(--border-color);
}

.btn-secondary:hover {
  background-color: var(--border-color);
}

/* Forms */
.form-group {
  margin-bottom: var(--spacing-md);
  display: flex;
  flex-direction: column;
}

.form-group label {
  margin-bottom: var(--spacing-sm);
  font-weight: 500;
  color: var(--text-primary);
}

.form-group input,
.form-group textarea,
.form-group select {
  padding: var(--spacing-sm) var(--spacing-md);
  border: var(--border-width) solid var(--border-color);
  border-radius: var(--border-radius);
  font-family: var(--font-family);
  font-size: var(--font-size-base);
  color: var(--text-primary);
  background-color: var(--bg-primary);
}

.form-group input:focus,
.form-group textarea:focus,
.form-group select:focus {
  outline: none;
  border-color: var(--primary);
  box-shadow: 0 0 0 3px rgba(255, 107, 107, 0.1);
}

/* Modal */
.modal {
  display: none;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 1000;
  align-items: center;
  justify-content: center;
}

.modal.active {
  display: flex;
}

.modal-content {
  background-color: var(--bg-primary);
  border-radius: var(--border-radius);
  box-shadow: var(--shadow-xl);
  width: 90%;
  max-width: 500px;
  max-height: 90vh;
  overflow-y: auto;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--spacing-lg);
  border-bottom: var(--border-width) solid var(--border-color);
}

.modal-header h2 {
  font-size: var(--font-size-lg);
  margin: 0;
}

.btn-close {
  background: none;
  border: none;
  font-size: var(--font-size-xl);
  cursor: pointer;
  color: var(--text-secondary);
}

.modal-body {
  padding: var(--spacing-lg);
}

.modal-footer {
  display: flex;
  gap: var(--spacing-md);
  justify-content: flex-end;
  padding: var(--spacing-lg);
  border-top: var(--border-width) solid var(--border-color);
}

/* Notifications */
.notifications {
  position: fixed;
  top: var(--spacing-lg);
  right: var(--spacing-lg);
  z-index: 1001;
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}

.notification {
  padding: var(--spacing-md) var(--spacing-lg);
  border-radius: var(--border-radius);
  box-shadow: var(--shadow-lg);
  color: white;
  max-width: 400px;
  animation: slideIn 0.3s ease;
}

.notification.success {
  background-color: var(--success);
}

.notification.error {
  background-color: var(--danger);
}

.notification.warning {
  background-color: var(--warning);
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateX(100px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

/* Footer */
.footer {
  text-align: center;
  padding: var(--spacing-lg);
  border-top: var(--border-width) solid var(--border-color);
  color: var(--text-secondary);
  font-size: var(--font-size-sm);
}

/* Utility Classes */
.hidden {
  display: none !important;
}

.text-center {
  text-align: center;
}

.mt-lg {
  margin-top: var(--spacing-lg);
}

.mb-lg {
  margin-bottom: var(--spacing-lg);
}

.p-lg {
  padding: var(--spacing-lg);
}
```

**Key Features:**

- CSS variables for theming
- Professional color scheme
- Responsive component styling
- Accessibility considerations
- Smooth animations
- Dark mode ready
- Utility classes

---

## 📱 5. responsive.css - Responsive Design

Create `web/css/responsive.css`:

```css
/* ========================================
   Responsive Design
   ======================================== */

/* Tablet (768px and up) */
@media (max-width: 768px) {
  .navbar-container {
    flex-wrap: wrap;
    gap: var(--spacing-md);
    padding: var(--spacing-md);
  }

  .nav-menu {
    order: 3;
    width: 100%;
    flex-wrap: wrap;
    gap: var(--spacing-sm);
    margin-top: var(--spacing-sm);
  }

  .nav-actions {
    order: 2;
  }

  .status-bar {
    flex-direction: column;
    gap: var(--spacing-md);
  }

  .main-content {
    padding: var(--spacing-md);
  }

  .modal-content {
    width: 95%;
  }

  .notifications {
    right: var(--spacing-md);
    left: var(--spacing-md);
    width: calc(100% - 2 * var(--spacing-md));
  }

  .notification {
    max-width: none;
  }
}

/* Mobile (480px and up) */
@media (max-width: 480px) {
  .navbar-container {
    padding: var(--spacing-sm);
  }

  .logo-text {
    display: none;
  }

  .nav-menu {
    gap: var(--spacing-sm);
  }

  .nav-link {
    padding: var(--spacing-xs) var(--spacing-sm);
    font-size: var(--font-size-sm);
  }

  .nav-item:nth-child(n + 4) {
    display: none; /* Hide less important nav items */
  }

  .status-bar {
    font-size: var(--font-size-xs);
    gap: var(--spacing-md);
  }

  .status-item {
    flex-direction: column;
    gap: var(--spacing-xs);
  }

  .main-content {
    padding: var(--spacing-md);
  }

  .modal-content {
    border-radius: 0;
    max-height: 100vh;
  }

  .notifications {
    right: 0;
    left: 0;
    width: 100%;
    border-radius: 0;
  }

  .notification {
    border-radius: 0;
    margin: 0;
  }

  .footer {
    padding: var(--spacing-md);
    font-size: var(--font-size-xs);
  }
}

/* Large screens (1400px and up) */
@media (min-width: 1400px) {
  .navbar-container,
  .main-content {
    max-width: 1600px;
  }

  .main-content {
    padding: var(--spacing-2xl);
  }
}

/* Print Styles */
@media print {
  .navbar,
  .status-bar,
  .nav-actions,
  .btn,
  .footer {
    display: none;
  }

  body {
    background-color: white;
  }

  .modal {
    position: static;
    background-color: transparent;
  }
}
```

**Key Features:**

- Mobile-first approach
- Tablet optimization
- Mobile optimization
- Large screen optimization
- Print styles
- Touch-friendly dimensions

---

## 🌙 6. dark-mode.css - Dark Mode Support

Create `web/css/dark-mode.css`:

```css
/* ========================================
   Dark Mode Styles
   ======================================== */

@media (prefers-color-scheme: dark) {
  :root {
    --bg-primary: #1a1a1a;
    --bg-secondary: #2d2d2d;
    --text-primary: #e8e8e8;
    --text-secondary: #a0a0a0;
    --border-color: #3d3d3d;
  }
}

/* User Preference Override */
body.dark-mode {
  --bg-primary: #1a1a1a;
  --bg-secondary: #2d2d2d;
  --text-primary: #e8e8e8;
  --text-secondary: #a0a0a0;
  --border-color: #3d3d3d;
}

body.light-mode {
  --bg-primary: #ffffff;
  --bg-secondary: #f8f9fa;
  --text-primary: #2c3e50;
  --text-secondary: #7f8c8d;
  --border-color: #e8e8e8;
}

/* Dark Mode Specific */
body.dark-mode {
  background-color: #000000;
  color: var(--text-primary);
}

body.dark-mode .navbar {
  background-color: #0d0d0d;
}

body.dark-mode .modal-content {
  background-color: #1a1a1a;
}

body.dark-mode .form-group input,
body.dark-mode .form-group textarea,
body.dark-mode .form-group select {
  background-color: #2d2d2d;
  color: var(--text-primary);
  border-color: var(--border-color);
}

body.dark-mode .form-group input::placeholder,
body.dark-mode .form-group textarea::placeholder {
  color: var(--text-secondary);
}

body.dark-mode .btn-secondary {
  background-color: #2d2d2d;
  color: var(--text-primary);
  border-color: var(--border-color);
}

body.dark-mode .btn-secondary:hover {
  background-color: #3d3d3d;
}

body.dark-mode ::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

body.dark-mode ::-webkit-scrollbar-track {
  background: #1a1a1a;
}

body.dark-mode ::-webkit-scrollbar-thumb {
  background: #3d3d3d;
  border-radius: 4px;
}

body.dark-mode ::-webkit-scrollbar-thumb:hover {
  background: #4d4d4d;
}
```

---

## ✅ Next Steps (Days 7-10)

After setting up frontend foundation:

1. **Day 7:** Implement 4 main pages (Overview, Team, Hunts, Analytics)
2. **Day 8:** Create 7 reusable components (HuntCard, TeamDisplay, etc.)
3. **Days 9-10:** Add responsive styling and animations

---

**Total Files:** 6
**Total Lines:** 1,080+
**Status:** Ready for implementation
