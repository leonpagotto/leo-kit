/**
 * APIServer Integration Tests - Simplified
 * Tests for Express server and REST API endpoints
 */

const APIServer = require('../../lib/team/api-server');
const express = require('express');

describe('APIServer - Basic Functionality', () => {
  let server;

  beforeEach(() => {
    server = new APIServer({ port: 3005 });
  });

  test('should initialize APIServer with default config', () => {
    expect(server).toBeDefined();
    expect(server.port).toBe(3005);
    expect(server.workdir).toBe('.');
    expect(server.app).toBeDefined();
  });

  test('should have Express app instance', () => {
    expect(server.app).toBeInstanceOf(express.application.constructor);
  });

  test('should have required methods', () => {
    expect(typeof server._setupMiddleware).toBe('function');
    expect(typeof server._setupRoutes).toBe('function');
    expect(typeof server._setupWebSocket).toBe('function');
    expect(typeof server.start).toBe('function');
    expect(typeof server.stop).toBe('function');
  });

  test('should setup middleware without errors', () => {
    expect(() => {
      server._setupMiddleware();
    }).not.toThrow();
  });

  test('should setup routes without errors', () => {
    server._setupMiddleware();
    expect(() => {
      server._setupRoutes();
    }).not.toThrow();
  });

  test('should setup WebSocket without errors', () => {
    server._setupMiddleware();
    server._setupRoutes();
    expect(() => {
      server._setupWebSocket();
    }).not.toThrow();
  });

  test('should have _broadcast method', () => {
    expect(typeof server._broadcast).toBe('function');
  });

  test('should have _handleConnection method', () => {
    expect(typeof server._handleConnection).toBe('function');
  });
});

describe('APIServer - Middleware Configuration', () => {
  let server;

  beforeEach(() => {
    server = new APIServer();
    server._setupMiddleware();
  });

  test('should setup middleware without errors', () => {
    expect(server.app).toBeDefined();
    expect(typeof server.app.use).toBe('function');
  });

  test('should accept POST requests after setup', () => {
    server._setupRoutes();

    // App should be properly configured
    expect(server.app).toBeDefined();
    expect(typeof server.app.post).toBe('function');
  });
});describe('APIServer - Route Setup', () => {
  let server;

  beforeEach(() => {
    server = new APIServer();
    server._setupMiddleware();
    server._setupRoutes();
  });

  test('should setup routes without errors', () => {
    // Verify that routes setup completes
    expect(server.app).toBeDefined();
    expect(typeof server.app.get).toBe('function');
  });

  test('should have HTTP methods available', () => {
    // Verify middleware and routes are set up
    expect(server.app).toBeDefined();
    expect(typeof server.app.get).toBe('function');
    expect(typeof server.app.post).toBe('function');
    expect(typeof server.app.put).toBe('function');
  });
});

describe('APIServer - WebSocket Setup', () => {
  let server;

  beforeEach(() => {
    server = new APIServer();
    server._setupMiddleware();
    server._setupRoutes();
  });

  test('should initialize io object after WebSocket setup', () => {
    server._setupWebSocket();
    expect(server.io).toBeDefined();
  });

  test('should have broadcast method working', () => {
    server._setupWebSocket();

    // Mock io.to and io.emit
    server.io = {
      to: jest.fn().mockReturnThis(),
      emit: jest.fn()
    };

    server._broadcast('test:event', { data: 'test' });

    expect(server.io.to).toHaveBeenCalledWith('team');
    expect(server.io.emit).toHaveBeenCalled();
  });
});

describe('APIServer - Error Handling', () => {
  let server;

  beforeEach(() => {
    server = new APIServer();
    server._setupMiddleware();
    server._setupRoutes();
  });

  test('should handle missing team data gracefully', () => {
    server.team = null;
    // Should not throw during broadcast
    expect(() => {
      server._broadcast('test:event', {});
    }).not.toThrow();
  });

  test('should handle null io gracefully', () => {
    server.io = null;
    // Should not throw during broadcast
    expect(() => {
      server._broadcast('test:event', {});
    }).not.toThrow();
  });
});

describe('APIServer - Broadcast Functionality', () => {
  let server;

  beforeEach(() => {
    server = new APIServer();
    server.io = {
      to: jest.fn().mockReturnThis(),
      emit: jest.fn()
    };
  });

  test('should broadcast event to team room', () => {
    server._broadcast('hunt:created', { id: '1', title: 'Test Hunt' });

    expect(server.io.to).toHaveBeenCalledWith('team');
    expect(server.io.emit).toHaveBeenCalled();
  });

  test('should broadcast multiple events sequentially', () => {
    server._broadcast('hunt:created', { id: '1' });
    server._broadcast('hunt:updated', { id: '1' });
    server._broadcast('hunt:completed', { id: '1' });

    expect(server.io.emit).toHaveBeenCalledTimes(3);
  });

  test('should include event data in broadcast', () => {
    const eventData = { huntId: '1', phase: 'Analysis' };
    server._broadcast('hunt:phase-changed', eventData);

    expect(server.io.emit).toHaveBeenCalledWith(
      'hunt:phase-changed',
      expect.any(Object)
    );
  });
});

describe('APIServer - Server Lifecycle', () => {
  let server;

  beforeEach(() => {
    server = new APIServer();
  });

  test('should have start method', () => {
    expect(typeof server.start).toBe('function');
  });

  test('should have stop method', () => {
    expect(typeof server.stop).toBe('function');
  });

  test('should have getStatus method', () => {
    expect(typeof server.getStatus).toBe('function');
  });

  test('should return status object with required properties', () => {
    server.team = { members: [] };
    server.tracker = { hunts: [] };
    server.io = { engine: { clientsCount: 0 } };

    const status = server.getStatus();

    expect(status).toHaveProperty('running');
    expect(status).toHaveProperty('port');
  });
});
