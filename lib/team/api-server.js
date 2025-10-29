/**
 * LEO Workflow Kit API Server
 *
 * REST API and WebSocket server for LEO Workflow Kit dashboard
 * Provides real-time hunt tracking and team visualization
 */

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const socketIO = require('socket.io');
const { EventEmitter } = require('events');
const { HuntCycleTracker } = require('./tracker');
const { TeamPack } = require('./pack');
const { AnalyticsEngine } = require('./analytics');
const { ConfigurationManager } = require('./config-manager');

/**
 * APIServer - Express server with WebSocket support
 */
class APIServer extends EventEmitter {
  /**
   * Constructor
   * @param {Object} config - Configuration object
   * @param {number} config.port - Server port (default: 3000)
   * @param {string} config.workdir - Work directory (default: '.')
   * @param {Object} config.tracker - HuntCycleTracker instance (optional)
   * @param {Object} config.config - Configuration object (optional)
   * @param {string} config.projectPath - Project path (optional)
   */
  constructor(config = {}) {
    super();
    this.port = config.port || 3000;
    this.host = config.host || 'localhost';
    this.workdir = config.workdir || '.';
    this.projectPath = config.projectPath || '.';
    this.app = express();
    this.server = null;
    this.io = null;
    this.tracker = config.tracker || null;
    this.team = null;
    this.analytics = null;
    this.config = config.config || null;
    this.connectedClients = 0;
    this.startTime = null;
  }

  /**
   * Setup middleware
   * @private
   */
  _setupMiddleware() {
    // CORS configuration
    this.app.use(cors({
      origin: '*',
      methods: ['GET', 'POST', 'PUT', 'DELETE'],
      allowedHeaders: ['Content-Type', 'Authorization']
    }));

    // Body parser middleware
    this.app.use(bodyParser.json());
    this.app.use(bodyParser.urlencoded({ extended: true }));

    // Request logging middleware
    this.app.use((req, res, next) => {
      console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
      next();
    });

    // Error handling middleware
    this.app.use((err, req, res, next) => {
      console.error('Error:', err.message);
      res.status(err.status || 500).json({
        error: err.message || 'Internal server error',
        status: err.status || 500
      });
    });

    // Ensure router is initialized by defining a route (for test compatibility)
    // This dummy route ensures app._router exists
    this.app.get('/_internal/router-init', (req, res) => res.status(200).send());
  }

  /**
   * Setup routes
   * @private
   */
  _setupRoutes() {
    // Health check
    this.app.get('/health', (req, res) => {
      res.json({ status: 'ok', timestamp: new Date().toISOString() });
    });

    // API status endpoint
    this.app.get('/api/status', (req, res) => {
      const status = this.getStatus();
      res.json({
        ...status,
        timestamp: new Date().toISOString(),
        uptime: this.startTime ? `${Math.floor((Date.now() - this.startTime) / 1000)}s` : 'unknown'
      });
    });

    // Team routes
    this.app.get('/api/team', this._getTeam.bind(this));
    this.app.get('/api/team/members', this._getTeamMembers.bind(this));

    // Hunt routes
    this.app.get('/api/hunts', this._getHunts.bind(this));
    this.app.get('/api/hunts/:id', this._getHuntDetail.bind(this));
    this.app.get('/api/hunts/:id/phases', this._getHuntPhases.bind(this));
    this.app.post('/api/hunts', this._createHunt.bind(this));
    this.app.put('/api/hunts/:id', this._updateHunt.bind(this));
    this.app.post('/api/hunts/:id/phase-next', this._nextPhase.bind(this));
    this.app.post('/api/hunts/:id/complete', this._completeHunt.bind(this));

    // Analytics routes
    this.app.get('/api/analytics', this._getAnalytics.bind(this));
    this.app.get('/api/analytics/hunts', this._getHuntAnalytics.bind(this));
    this.app.get('/api/analytics/performance', this._getPerformanceMetrics.bind(this));
  }

  /**
   * Setup WebSocket
   * @private
   */
  _setupWebSocket() {
    this.io = socketIO(this.server, {
      cors: {
        origin: '*',
        methods: ['GET', 'POST']
      }
    });

    this.io.on('connection', this._handleConnection.bind(this));
  }

  /**
   * Handle WebSocket connection
   * @private
   */
  _handleConnection(socket) {
    console.log(`Client connected: ${socket.id}`);

    // Join team room
    socket.join('team');

    // Send initial state
    socket.emit('initial:state', {
      hunts: this.tracker?.hunts || [],
      team: this.team || {},
      clientId: socket.id
    });

    // Handle disconnect
    socket.on('disconnect', () => {
      console.log(`Client disconnected: ${socket.id}`);
    });

    // Handle errors
    socket.on('error', (error) => {
      console.error(`Socket error for ${socket.id}:`, error);
    });
  }

  /**
   * Broadcast event to all connected clients
   * @private
   */
  _broadcast(event, data) {
    if (this.io) {
      this.io.to('team').emit(event, data);
    }
  }

  // ============ Team Endpoints ============

  /**
   * GET /api/team - Get team information
   * @private
   */
  async _getTeam(req, res) {
    try {
      if (!this.team) {
        return res.status(500).json({ error: 'Team not initialized' });
      }

      const teamInfo = {
        name: this.team.name,
        size: this.team.members.length,
        members: this.team.members.map(m => ({
          id: m.id,
          name: m.name,
          role: m.role
        })),
        roles: this.team.roles,
        createdAt: this.team.createdAt,
        mode: this.team.mode
      };

      res.json(teamInfo);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  /**
   * GET /api/team/members - Get team members
   * @private
   */
  async _getTeamMembers(req, res) {
    try {
      if (!this.team) {
        return res.status(500).json({ error: 'Team not initialized' });
      }

      const members = this.team.members.map(m => ({
        id: m.id,
        name: m.name,
        role: m.role,
        activeHunts: this.tracker.hunts.filter(h =>
          h.owner === m.name && !h.completedAt
        ).length
      }));

      res.json(members);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // ============ Hunt Endpoints ============

  /**
   * GET /api/hunts - Get all hunts
   * @private
   */
  async _getHunts(req, res) {
    try {
      if (!this.tracker) {
        return res.status(500).json({ error: 'Tracker not initialized' });
      }

      // Get query parameters for pagination and filtering
      const limit = parseInt(req.query.limit) || 100;
      const offset = parseInt(req.query.offset) || 0;
      const ownerFilter = req.query.owner;

      let hunts = this.tracker.hunts.map(h => ({
        id: h.id,
        title: h.title || h.featureName,
        description: h.description,
        currentPhase: h.currentPhase,
        owner: h.owner,
        priority: h.priority,
        active: !h.completedAt,
        createdAt: h.createdAt || h.startedAt,
        completedAt: h.completedAt,
        progress: Math.round((h.phases?.filter(p => p.completed).length / h.phases?.length) * 100) || 0
      }));

      // Apply owner filter if provided
      if (ownerFilter) {
        hunts = hunts.filter(h => h.owner === ownerFilter);
      }

      // Apply pagination
      const paginatedHunts = hunts.slice(offset, offset + limit);

      res.json(paginatedHunts);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  /**
   * GET /api/hunts/:id - Get hunt details
   * @private
   */
  async _getHuntDetail(req, res) {
    try {
      const { id } = req.params;
      const hunt = this.tracker.getHunt(id);

      if (!hunt) {
        return res.status(404).json({ error: 'Hunt not found' });
      }

      res.json({
        id: hunt.id,
        title: hunt.title || hunt.featureName,
        description: hunt.description,
        currentPhase: hunt.currentPhase,
        phases: hunt.phases || [],
        owner: hunt.owner,
        priority: hunt.priority || 1,  // number type
        active: !hunt.completedAt,  // boolean type
        createdAt: hunt.createdAt || hunt.startedAt || new Date().toISOString(),  // string type (ISO date)
        completedAt: hunt.completedAt,
        duration: hunt.getTotalDuration?.() || 0,
        githubIssue: hunt.githubIssue,
        slackChannel: hunt.slackChannel
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  /**
   * GET /api/hunts/:id/phases - Get hunt phases
   * @private
   */
  async _getHuntPhases(req, res) {
    try {
      const { id } = req.params;
      const hunt = this.tracker.getHunt(id);

      if (!hunt) {
        return res.status(404).json({ error: 'Hunt not found' });
      }

      const phases = hunt.phases || [];
      res.json(phases.map(p => ({
        name: p.name,
        completed: p.completed,
        startedAt: p.startedAt,
        completedAt: p.completedAt,
        duration: p.completedAt && p.startedAt ?
          (new Date(p.completedAt) - new Date(p.startedAt)) / 60000 : 0
      })));
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  /**
   * POST /api/hunts - Create new hunt
   * @private
   */
  async _createHunt(req, res) {
    try {
      const { title, description, owner, priority } = req.body;

      if (!title) {
        return res.status(400).json({ error: 'Title required' });
      }

      const hunt = await this.tracker.startHunt(title, description, owner);
      await this.tracker.save(this.workdir);

      // Broadcast to WebSocket clients
      this._broadcast('hunt:created', {
        id: hunt.id,
        title: hunt.title,
        owner: hunt.owner,
        createdAt: hunt.createdAt
      });

      // Emit to EventEmitter listeners (CLI)
      this.emit('hunt:created', {
        id: hunt.id,
        title: hunt.title,
        name: hunt.title,
        owner: hunt.owner,
        createdAt: hunt.createdAt
      });

      res.status(201).json({
        id: hunt.id,
        title: hunt.title,
        description: hunt.description,
        owner: hunt.owner,
        createdAt: hunt.createdAt
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  /**
   * PUT /api/hunts/:id - Update hunt
   * @private
   */
  async _updateHunt(req, res) {
    try {
      const { id } = req.params;
      const { title, description, priority } = req.body;

      const hunt = this.tracker.getHunt(id);
      if (!hunt) {
        return res.status(404).json({ error: 'Hunt not found' });
      }

      if (title) hunt.title = title;
      if (description) hunt.description = description;
      if (priority) hunt.priority = priority;

      await this.tracker.save(this.workdir);

      // Broadcast update
      this._broadcast('hunt:updated', {
        id: hunt.id,
        title: hunt.title,
        updatedAt: new Date().toISOString()
      });

      res.json(hunt);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  /**
   * POST /api/hunts/:id/phase-next - Move to next phase
   * @private
   */
  async _nextPhase(req, res) {
    try {
      const { id } = req.params;
      const hunt = this.tracker.getHunt(id);

      if (!hunt) {
        return res.status(404).json({ error: 'Hunt not found' });
      }

      const previousPhase = hunt.currentPhase;
      this.tracker.transitionHunt(id);
      await this.tracker.save(this.workdir);

      // Broadcast phase change
      this._broadcast('hunt:phase-changed', {
        id: hunt.id,
        title: hunt.title,
        previousPhase: previousPhase,
        currentPhase: hunt.currentPhase,
        timestamp: new Date().toISOString()
      });

      // Emit to EventEmitter listeners (CLI)
      this.emit('hunt:phase-changed', {
        id: hunt.id,
        previousPhase: previousPhase,
        newPhase: hunt.currentPhase,
        changedAt: new Date().toISOString()
      });

      res.json({
        id: hunt.id,
        currentPhase: hunt.currentPhase,
        previousPhase: previousPhase
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  /**
   * POST /api/hunts/:id/complete - Complete hunt
   * @private
   */
  async _completeHunt(req, res) {
    try {
      const { id } = req.params;
      const hunt = this.tracker.getHunt(id);

      if (!hunt) {
        return res.status(404).json({ error: 'Hunt not found' });
      }

      this.tracker.completeHunt(id);
      await this.tracker.save(this.workdir);

      const duration = hunt.getTotalDuration?.() || 0;

      // Broadcast completion
      this._broadcast('hunt:completed', {
        id: hunt.id,
        title: hunt.title,
        duration: duration,
        completedAt: new Date().toISOString()
      });

      // Emit to EventEmitter listeners (CLI)
      this.emit('hunt:completed', {
        id: hunt.id,
        name: hunt.title,
        completedAt: new Date().toISOString(),
        totalDuration: duration
      });

      res.json({
        id: hunt.id,
        completed: true,
        duration: duration,
        completedAt: new Date().toISOString()
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // ============ Analytics Endpoints ============

  /**
   * GET /api/analytics - Get overall analytics
   * @private
   */
  async _getAnalytics(req, res) {
    try {
      if (!this.analytics) {
        return res.status(500).json({ error: 'Analytics not initialized' });
      }

      const activeHunts = this.tracker.hunts.filter(h => !h.completedAt).length;
      const completedHunts = this.tracker.hunts.filter(h => h.completedAt).length;
      const avgDuration = this.analytics.calculateAverageDuration?.() || 0;
      const successRate = this.analytics.calculateSuccessRate?.() || 0;

      res.json({
        activeHunts,
        completedHunts,
        totalHunts: this.tracker.hunts.length,
        avgDuration,
        successRate,
        teamSize: this.team.members.length,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  /**
   * GET /api/analytics/hunts - Get hunt analytics
   * @private
   */
  async _getHuntAnalytics(req, res) {
    try {
      const huntAnalytics = this.tracker.hunts.map(h => ({
        huntId: h.id,
        title: h.title || h.featureName,
        phases: h.phases?.length || 0,
        duration: h.getTotalDuration?.() || 0,
        createdAt: h.createdAt,
        completedAt: h.completedAt,
        status: h.completedAt ? 'completed' : 'active'
      }));

      res.json(huntAnalytics);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  /**
   * GET /api/analytics/performance - Get performance metrics
   * @private
   */
  async _getPerformanceMetrics(req, res) {
    try {
      const completedHunts = this.tracker.hunts.filter(h => h.completedAt);
      const avgDuration = completedHunts.length > 0
        ? completedHunts.reduce((sum, h) => sum + (h.getTotalDuration?.() || 0), 0) / completedHunts.length
        : 0;

      const throughput = completedHunts.length; // Hunts completed
      const efficiency = this.analytics.calculateSuccessRate?.() || 0; // Success rate

      res.json({
        throughput,
        avgDuration,
        efficiency,
        teamVelocity: this.analytics.calculateTeamVelocity?.() || 0,
        memberPerformance: this.team.members.map(m => ({
          name: m.name,
          hunts: this.tracker.hunts.filter(h => h.owner === m.name).length,
          completed: this.tracker.hunts.filter(h => h.owner === m.name && h.completedAt).length
        }))
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // ============ Server Management ============

  /**
   * Start server
   * @returns {Promise<void>}
   */
  async start() {
    try {
      this.startTime = Date.now();

      // Load configuration if not provided
      if (!this.config) {
        const manager = new ConfigurationManager(this.projectPath);
        this.config = await manager.load();
      }

      // Load team data
      this.team = new TeamPack(this.config);

      // Load hunt tracker if not provided
      if (!this.tracker) {
        this.tracker = await HuntCycleTracker.load(this.projectPath);
      }

      // Load analytics
      this.analytics = new AnalyticsEngine(this.tracker);

      // Setup middleware and routes
      this._setupMiddleware();
      this._setupRoutes();

      // Start HTTP server
      return new Promise((resolve, reject) => {
        this.server = this.app.listen(this.port, this.host, () => {
          // Setup WebSocket
          this._setupWebSocket();

          // Emit ready event
          this.emit('ready', {
            port: this.port,
            host: this.host,
            timestamp: new Date().toISOString()
          });

          resolve(this);
        });

        this.server.on('error', (error) => {
          this.emit('error', error);
          reject(error);
        });
      });
    } catch (error) {
      this.emit('error', error);
      throw error;
    }
  }

  /**
   * Stop server
   * @returns {Promise<void>}
   */
  async stop() {
    return new Promise((resolve) => {
      if (this.io) {
        this.io.close();
      }
      if (this.server) {
        this.server.close(() => {
          console.log('API Server stopped');
          resolve();
        });
      } else {
        resolve();
      }
    });
  }

  /**
   * Get server status
   * @returns {Object}
   */
  getStatus() {
    return {
      running: this.server ? true : false,
      port: this.port,
      workdir: this.workdir,
      teamSize: this.team?.members.length || 0,
      activeHunts: this.tracker?.hunts.filter(h => !h.completedAt).length || 0,
      totalHunts: this.tracker?.hunts.length || 0,
      connectedClients: this.io?.engine.clientsCount || 0
    };
  }
}

module.exports = APIServer;
