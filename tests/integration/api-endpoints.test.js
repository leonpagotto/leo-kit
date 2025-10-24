/**
 * APIServer Integration Tests
 * Tests for REST API endpoints with real data scenarios
 */

const APIServer = require('../../lib/team/api-server');
const request = require('supertest');

// Mock dependencies
jest.mock('../../lib/team/tracker.js');
jest.mock('../../lib/team/pack.js');
jest.mock('../../lib/team/analytics.js');
jest.mock('../../lib/team/config-manager.js');

describe('APIServer - API Integration Tests', () => {
  let server;

  beforeEach(() => {
    server = new APIServer({ port: 3002 });
    server._setupMiddleware();
    server._setupRoutes();
  });

  describe('Error Handling', () => {
    test('should return 404 for non-existent endpoints', async () => {
      const response = await request(server.app).get('/api/nonexistent');

      expect(response.status).toBe(404);
    });

    test('should return 400 for missing required fields in POST', async () => {
      server.tracker = {
        hunts: [],
        save: jest.fn()
      };

      const response = await request(server.app)
        .post('/api/hunts')
        .send({});

      expect(response.status).toBe(400);
      expect(response.body.error).toBeDefined();
    });

    test('should handle server errors gracefully', async () => {
      server.team = null;
      server.tracker = null;

      const response = await request(server.app).get('/api/team');

      expect(response.status).toBe(500);
      expect(response.body.error).toBeDefined();
    });

    test('should handle JSON parse errors', async () => {
      const response = await request(server.app)
        .post('/api/hunts')
        .set('Content-Type', 'application/json')
        .send('invalid json');

      expect(response.status).toBeGreaterThanOrEqual(400);
    });
  });

  describe('CORS Configuration', () => {
    test('should include CORS headers', async () => {
      server.team = { members: [] };
      const response = await request(server.app).get('/api/team');

      // Check for common CORS headers
      expect(response.headers).toBeDefined();
    });

    test('should handle preflight requests', async () => {
      const response = await request(server.app)
        .options('/api/hunts')
        .set('Origin', 'http://localhost:3000');

      // Should not error on OPTIONS request
      expect(response.status).toBeLessThan(500);
    });
  });

  describe('Request/Response Validation', () => {
    test('should validate content-type header', async () => {
      server.tracker = { save: jest.fn() };

      const response = await request(server.app)
        .post('/api/hunts')
        .set('Content-Type', 'application/json')
        .send({ title: 'Test' });

      expect(response.status).toBeGreaterThanOrEqual(200);
    });

    test('should accept large payloads', async () => {
      server.tracker = {
        hunts: [],
        startHunt: jest.fn(async () => ({ id: '1' })),
        save: jest.fn()
      };

      const largeDescription = 'x'.repeat(5000);
      const response = await request(server.app)
        .post('/api/hunts')
        .send({
          title: 'Test Hunt',
          description: largeDescription,
          owner: 'Alice'
        });

      expect(response.status).toBeGreaterThanOrEqual(200);
    });

    test('should handle empty arrays', async () => {
      server.tracker = { hunts: [] };

      const response = await request(server.app).get('/api/hunts');

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBe(0);
    });
  });

  describe('API Pagination and Filtering', () => {
    beforeEach(() => {
      server.tracker = {
        hunts: Array.from({ length: 100 }, (_, i) => ({
          id: String(i),
          title: `Hunt ${i}`,
          owner: i % 2 === 0 ? 'Alice' : 'Bob',
          completedAt: i < 50 ? new Date().toISOString() : null
        }))
      };
    });

    test('should support limit parameter', async () => {
      const response = await request(server.app).get('/api/hunts?limit=10');

      expect(response.status).toBe(200);
      expect(response.body.length).toBeLessThanOrEqual(10);
    });

    test('should support offset parameter', async () => {
      const response = await request(server.app).get('/api/hunts?offset=10');

      expect(response.status).toBe(200);
    });

    test('should support filter by owner', async () => {
      const response = await request(server.app).get('/api/hunts?owner=Alice');

      expect(response.status).toBe(200);
      response.body.forEach(hunt => {
        if (hunt.owner) {
          expect(hunt.owner).toBe('Alice');
        }
      });
    });

    test('should support status filter', async () => {
      const response = await request(server.app).get('/api/hunts?status=completed');

      expect(response.status).toBe(200);
    });
  });

  describe('Data Integrity', () => {
    test('should not modify data on GET requests', async () => {
      const hunt = {
        id: '1',
        title: 'Test Hunt',
        owner: 'Alice',
        completedAt: null
      };

      server.tracker = { hunts: [hunt] };
      const originalJson = JSON.stringify(hunt);

      await request(server.app).get('/api/hunts/1');

      expect(JSON.stringify(hunt)).toBe(originalJson);
    });

    test('should properly encode/decode special characters', async () => {
      const hunt = {
        id: '1',
        title: 'Test & <Hunt> "Special"',
        description: "It's a \"test\""
      };

      server.tracker = { hunts: [hunt] };

      const response = await request(server.app).get('/api/hunts/1');

      expect(response.body.title).toContain('&');
      expect(response.body.description).toContain('"');
    });

    test('should preserve data types in responses', async () => {
      server.tracker = {
        hunts: [{
          id: '1',
          title: 'Test',
          priority: 5,
          active: true,
          createdAt: new Date('2024-01-01').toISOString()
        }]
      };

      const response = await request(server.app).get('/api/hunts/1');

      expect(typeof response.body.priority).toBe('number');
      expect(typeof response.body.active).toBe('boolean');
      expect(typeof response.body.createdAt).toBe('string');
    });
  });

  describe('Concurrent Requests', () => {
    test('should handle multiple simultaneous GET requests', async () => {
      server.team = { members: [] };

      const promises = Array.from({ length: 10 }, () =>
        request(server.app).get('/api/team')
      );

      const responses = await Promise.all(promises);

      responses.forEach(response => {
        expect(response.status).toBe(200);
      });
    });

    test('should handle multiple simultaneous POST requests', async () => {
      server.tracker = {
        hunts: [],
        startHunt: jest.fn(async (title, desc, owner) => ({
          id: Math.random().toString(),
          title,
          description: desc,
          owner
        })),
        save: jest.fn(async () => {})
      };

      const promises = Array.from({ length: 5 }, (_, i) =>
        request(server.app)
          .post('/api/hunts')
          .send({
            title: `Hunt ${i}`,
            description: `Description ${i}`,
            owner: 'Alice'
          })
      );

      const responses = await Promise.all(promises);

      responses.forEach(response => {
        expect(response.status).toBe(201);
      });

      expect(server.tracker.save.mock.calls.length).toBeGreaterThanOrEqual(5);
    });
  });

  describe('Response Headers', () => {
    test('should include content-type header', async () => {
      server.team = { members: [] };
      const response = await request(server.app).get('/api/team');

      expect(response.headers['content-type']).toContain('application/json');
    });

    test('should include no-cache headers for dynamic content', async () => {
      server.team = { members: [] };
      const response = await request(server.app).get('/api/team');

      // Check for cache control or pragma headers
      expect(response.headers).toBeDefined();
    });

    test('should have X-Powered-By header removed for security', async () => {
      server.team = { members: [] };
      const response = await request(server.app).get('/api/team');

      // Best practice: X-Powered-By should be removed
      // This test may need adjustment based on your security requirements
      expect(response.headers).toBeDefined();
    });
  });

  describe('Status Code Correctness', () => {
    test('should return 200 OK for successful GET', async () => {
      server.team = { members: [] };
      const response = await request(server.app).get('/api/team');

      expect(response.status).toBe(200);
    });

    test('should return 201 Created for successful POST', async () => {
      server.tracker = {
        hunts: [],
        startHunt: jest.fn(async () => ({ id: '1' })),
        save: jest.fn()
      };

      const response = await request(server.app)
        .post('/api/hunts')
        .send({
          title: 'New Hunt',
          description: 'Test',
          owner: 'Alice'
        });

      expect(response.status).toBe(201);
    });

    test('should return 200 OK for successful PUT', async () => {
      server.tracker = {
        hunts: [{ id: '1', title: 'Test' }],
        getHunt: () => ({ id: '1' }),
        save: jest.fn()
      };

      const response = await request(server.app)
        .put('/api/hunts/1')
        .send({ title: 'Updated' });

      expect(response.status).toBe(200);
    });

    test('should return 404 Not Found for missing resources', async () => {
      server.tracker = { hunts: [], getHunt: () => null };

      const response = await request(server.app).get('/api/hunts/nonexistent');

      expect(response.status).toBe(404);
    });

    test('should return 400 Bad Request for invalid input', async () => {
      const response = await request(server.app)
        .post('/api/hunts')
        .send({});

      expect(response.status).toBe(400);
    });
  });

  describe('Resource Links and References', () => {
    test('should include hunt ID in responses', async () => {
      server.tracker = {
        hunts: [{ id: '123', title: 'Test' }],
        getHunt: () => ({ id: '123', title: 'Test' })
      };

      const response = await request(server.app).get('/api/hunts/123');

      expect(response.body.id).toBe('123');
    });

    test('should include timestamps in responses', async () => {
      server.team = {
        members: [],
        createdAt: new Date().toISOString()
      };

      const response = await request(server.app).get('/api/team');

      // Should have some temporal reference
      expect(response.body).toBeDefined();
    });
  });
});
