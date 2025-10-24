/**
 * APIServer Unit Tests
 * Tests for Express server, REST API endpoints, and WebSocket
 */

const APIServer = require('../../lib/team/api-server');
const request = require('supertest');
const path = require('path');
const fs = require('fs');

// Mock dependencies
jest.mock('../../lib/team/tracker');
jest.mock('../../lib/team/pack');
jest.mock('../../lib/team/analytics');
jest.mock('../../lib/team/config-manager');

describe('APIServer - Constructor', () => {
  test('should initialize with default config', () => {
    const server = new APIServer();

    expect(server.port).toBe(3000);
    expect(server.workdir).toBe('.');
    expect(server.app).toBeDefined();
    expect(server.server).toBeNull();
    expect(server.io).toBeNull();
  });

  test('should initialize with custom config', () => {
    const config = { port: 4000, workdir: '/tmp' };
    const server = new APIServer(config);

    expect(server.port).toBe(4000);
    expect(server.workdir).toBe('/tmp');
  });
});

describe('APIServer - Middleware Setup', () => {
  let server;

  beforeEach(() => {
    server = new APIServer();
    server._setupMiddleware();
  });

  test('should have CORS middleware', () => {
    expect(server.app._router).toBeDefined();
  });

  test('should parse JSON body', async () => {
    server.app.post('/test', (req, res) => {
      res.json(req.body);
    });

    const response = await request(server.app)
      .post('/test')
      .send({ test: 'data' });

    expect(response.body).toEqual({ test: 'data' });
  });

  test('should handle errors properly', async () => {
    server.app.get('/error', (req, res) => {
      const err = new Error('Test error');
      err.status = 400;
      throw err;
    });

    const response = await request(server.app).get('/error');
    expect(response.status).toBe(500); // Error handler converts to 500
  });
});

describe('APIServer - Health Check', () => {
  let server;

  beforeEach(() => {
    server = new APIServer();
    server._setupMiddleware();
    server._setupRoutes();
  });

  test('should respond to health check', async () => {
    const response = await request(server.app).get('/health');

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('status', 'ok');
    expect(response.body).toHaveProperty('timestamp');
  });
});

describe('APIServer - Team Endpoints', () => {
  let server;

  beforeEach(() => {
    server = new APIServer();
    server._setupMiddleware();
    server._setupRoutes();

    // Mock team data
    server.team = {
      name: 'Test Team',
      members: [
        { id: '1', name: 'Alice', role: 'Developer' },
        { id: '2', name: 'Bob', role: 'Designer' }
      ],
      roles: ['Developer', 'Designer'],
      createdAt: new Date().toISOString(),
      mode: 'collaborative'
    };

    // Mock tracker
    server.tracker = {
      hunts: [
        { id: '1', owner: 'Alice', completedAt: null },
        { id: '2', owner: 'Alice', completedAt: new Date().toISOString() },
        { id: '3', owner: 'Bob', completedAt: null }
      ],
      getHunt: jest.fn()
    };
  });

  describe('GET /api/team', () => {
    test('should return team information', async () => {
      const response = await request(server.app).get('/api/team');

      expect(response.status).toBe(200);
      expect(response.body.name).toBe('Test Team');
      expect(response.body.size).toBe(2);
      expect(response.body.members).toHaveLength(2);
    });

    test('should handle missing team', async () => {
      server.team = null;

      const response = await request(server.app).get('/api/team');

      expect(response.status).toBe(500);
      expect(response.body.error).toBeDefined();
    });
  });

  describe('GET /api/team/members', () => {
    test('should return team members with hunt counts', async () => {
      const response = await request(server.app).get('/api/team/members');

      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(2);
      expect(response.body[0].name).toBe('Alice');
      expect(response.body[0]).toHaveProperty('activeHunts');
    });

    test('should handle missing team', async () => {
      server.team = null;

      const response = await request(server.app).get('/api/team/members');

      expect(response.status).toBe(500);
    });
  });
});

describe('APIServer - Hunt Endpoints', () => {
  let server;

  beforeEach(() => {
    server = new APIServer();
    server._setupMiddleware();
    server._setupRoutes();

    // Mock team and tracker
    server.team = { members: [] };
    server.tracker = {
      hunts: [
        {
          id: '1',
          title: 'Test Hunt',
          featureName: 'Test Feature',
          description: 'Test Description',
          currentPhase: 'Discovery',
          owner: 'Alice',
          priority: 'High',
          createdAt: new Date().toISOString(),
          completedAt: null,
          phases: [
            { completed: true, name: 'Discovery' },
            { completed: false, name: 'Analysis' }
          ],
          getTotalDuration: () => 120,
          githubIssue: { number: 42 }
        }
      ],
      getHunt: jest.fn(id => server.tracker.hunts.find(h => h.id === id)),
      startHunt: jest.fn(async (title, desc, owner) => ({
        id: '2',
        title,
        description: desc,
        owner,
        createdAt: new Date().toISOString()
      })),
      transitionHunt: jest.fn(),
      completeHunt: jest.fn(),
      save: jest.fn(async () => {})
    };
  });

  describe('GET /api/hunts', () => {
    test('should return all hunts', async () => {
      const response = await request(server.app).get('/api/hunts');

      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(1);
      expect(response.body[0].title).toBe('Test Hunt');
    });

    test('should include progress calculation', async () => {
      const response = await request(server.app).get('/api/hunts');

      expect(response.body[0]).toHaveProperty('progress');
      expect(response.body[0].progress).toBe(50); // 1 of 2 phases completed
    });

    test('should handle missing tracker', async () => {
      server.tracker = null;

      const response = await request(server.app).get('/api/hunts');

      expect(response.status).toBe(500);
    });
  });

  describe('GET /api/hunts/:id', () => {
    test('should return hunt details', async () => {
      const response = await request(server.app).get('/api/hunts/1');

      expect(response.status).toBe(200);
      expect(response.body.id).toBe('1');
      expect(response.body.title).toBe('Test Hunt');
      expect(response.body.phases).toHaveLength(2);
    });

    test('should return 404 for missing hunt', async () => {
      const response = await request(server.app).get('/api/hunts/nonexistent');

      expect(response.status).toBe(404);
      expect(response.body.error).toBe('Hunt not found');
    });
  });

  describe('GET /api/hunts/:id/phases', () => {
    test('should return hunt phases', async () => {
      const response = await request(server.app).get('/api/hunts/1/phases');

      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(2);
      expect(response.body[0].name).toBe('Discovery');
      expect(response.body[0].completed).toBe(true);
    });

    test('should return 404 for missing hunt', async () => {
      const response = await request(server.app).get('/api/hunts/nonexistent/phases');

      expect(response.status).toBe(404);
    });
  });

  describe('POST /api/hunts', () => {
    test('should create new hunt', async () => {
      const response = await request(server.app)
        .post('/api/hunts')
        .send({
          title: 'New Hunt',
          description: 'New Description',
          owner: 'Alice'
        });

      expect(response.status).toBe(201);
      expect(response.body.title).toBe('New Hunt');
      expect(server.tracker.save).toHaveBeenCalled();
    });

    test('should require title', async () => {
      const response = await request(server.app)
        .post('/api/hunts')
        .send({ description: 'No title' });

      expect(response.status).toBe(400);
      expect(response.body.error).toContain('Title');
    });
  });

  describe('PUT /api/hunts/:id', () => {
    test('should update hunt', async () => {
      const response = await request(server.app)
        .put('/api/hunts/1')
        .send({
          title: 'Updated Hunt',
          description: 'Updated Description'
        });

      expect(response.status).toBe(200);
      expect(server.tracker.save).toHaveBeenCalled();
    });

    test('should return 404 for missing hunt', async () => {
      const response = await request(server.app)
        .put('/api/hunts/nonexistent')
        .send({ title: 'Updated' });

      expect(response.status).toBe(404);
    });
  });

  describe('POST /api/hunts/:id/phase-next', () => {
    test('should move to next phase', async () => {
      server.tracker.hunts[0].currentPhase = 'Analysis';

      const response = await request(server.app)
        .post('/api/hunts/1/phase-next');

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('currentPhase');
      expect(server.tracker.transitionHunt).toHaveBeenCalledWith('1');
    });

    test('should return 404 for missing hunt', async () => {
      const response = await request(server.app)
        .post('/api/hunts/nonexistent/phase-next');

      expect(response.status).toBe(404);
    });
  });

  describe('POST /api/hunts/:id/complete', () => {
    test('should complete hunt', async () => {
      const response = await request(server.app)
        .post('/api/hunts/1/complete');

      expect(response.status).toBe(200);
      expect(response.body.completed).toBe(true);
      expect(server.tracker.completeHunt).toHaveBeenCalledWith('1');
    });

    test('should return 404 for missing hunt', async () => {
      const response = await request(server.app)
        .post('/api/hunts/nonexistent/complete');

      expect(response.status).toBe(404);
    });
  });
});

describe('APIServer - Analytics Endpoints', () => {
  let server;

  beforeEach(() => {
    server = new APIServer();
    server._setupMiddleware();
    server._setupRoutes();

    // Mock data
    server.team = { members: [{ name: 'Alice' }, { name: 'Bob' }] };
    server.tracker = {
      hunts: [
        { id: '1', owner: 'Alice', completedAt: new Date().toISOString(), getTotalDuration: () => 100 },
        { id: '2', owner: 'Alice', completedAt: null, getTotalDuration: () => 0 },
        { id: '3', owner: 'Bob', completedAt: new Date().toISOString(), getTotalDuration: () => 150 }
      ]
    };
    server.analytics = {
      calculateAverageDuration: () => 125,
      calculateSuccessRate: () => 95,
      calculateTeamVelocity: () => 2.5
    };
  });

  describe('GET /api/analytics', () => {
    test('should return overall analytics', async () => {
      const response = await request(server.app).get('/api/analytics');

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('activeHunts');
      expect(response.body).toHaveProperty('completedHunts');
      expect(response.body).toHaveProperty('avgDuration');
      expect(response.body.teamSize).toBe(2);
    });
  });

  describe('GET /api/analytics/hunts', () => {
    test('should return hunt analytics', async () => {
      const response = await request(server.app).get('/api/analytics/hunts');

      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(3);
      expect(response.body[0]).toHaveProperty('huntId');
      expect(response.body[0]).toHaveProperty('duration');
    });
  });

  describe('GET /api/analytics/performance', () => {
    test('should return performance metrics', async () => {
      const response = await request(server.app).get('/api/analytics/performance');

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('throughput');
      expect(response.body).toHaveProperty('avgDuration');
      expect(response.body).toHaveProperty('efficiency');
      expect(response.body).toHaveProperty('memberPerformance');
    });
  });
});

describe('APIServer - Server Management', () => {
  let server;

  beforeEach(() => {
    server = new APIServer({ port: 3001 });
  });

  test('should have getStatus method', () => {
    server.team = { members: [] };
    server.tracker = { hunts: [] };
    server.io = { engine: { clientsCount: 0 } };

    const status = server.getStatus();

    expect(status).toHaveProperty('running');
    expect(status).toHaveProperty('port');
    expect(status).toHaveProperty('teamSize');
  });
});

describe('APIServer - Broadcast', () => {
  let server;

  beforeEach(() => {
    server = new APIServer();
    server.io = {
      to: jest.fn().mockReturnThis(),
      emit: jest.fn()
    };
  });

  test('should broadcast events to all clients', () => {
    server._broadcast('test:event', { data: 'test' });

    expect(server.io.to).toHaveBeenCalledWith('team');
    expect(server.io.emit).toHaveBeenCalled();
  });

  test('should handle null io', () => {
    server.io = null;

    expect(() => {
      server._broadcast('test:event', {});
    }).not.toThrow();
  });
});
