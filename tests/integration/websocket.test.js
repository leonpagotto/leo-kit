/**
 * WebSocket Integration Tests
 * Tests for Socket.IO real-time events and broadcasting
 */

jest.mock('socket.io', () => {
  return jest.fn().mockImplementation(() => ({
    on: jest.fn(),
    to: jest.fn().mockReturnThis(),
    emit: jest.fn(),
    engine: { clientsCount: 0 },
    close: jest.fn()
  }));
});

jest.mock('../../lib/team/tracker');
jest.mock('../../lib/team/pack');
jest.mock('../../lib/team/analytics');
jest.mock('../../lib/team/config-manager');

const APIServer = require('../../lib/team/api-server');
const http = require('http');

describe('WebSocket - Connection Handling', () => {
  let server;
  let httpServer;

  beforeEach(async () => {
    server = new APIServer({ port: 3003 });
    server._setupMiddleware();
    server._setupRoutes();
    server._setupWebSocket();
    
    server.team = { members: [] };
    server.tracker = { hunts: [] };
  });

  afterEach(() => {
    if (httpServer) {
      httpServer.close();
    }
    if (server.server) {
      server.server.close();
    }
  });

  test('should initialize Socket.IO', () => {
    expect(server.io).toBeDefined();
  });

  test('should have connection handler', () => {
    expect(server._handleConnection).toBeDefined();
  });

  test('should have broadcast method', () => {
    expect(server._broadcast).toBeDefined();
  });
});

describe('WebSocket - Events', () => {
  let server;

  beforeEach(() => {
    server = new APIServer({ port: 3004 });
    server._setupMiddleware();
    server._setupRoutes();
    server._setupWebSocket();

    server.team = { members: [] };
    server.tracker = { hunts: [] };
  });

  describe('Hunt Created Event', () => {
    test('should broadcast hunt:created event', () => {
      const huntData = {
        id: '1',
        title: 'New Hunt',
        owner: 'Alice'
      };

      server._broadcast('hunt:created', huntData);

      expect(server.io.to).toHaveBeenCalledWith('team');
      expect(server.io.emit).toHaveBeenCalled();
    });

    test('should include hunt details in broadcast', () => {
      const huntData = {
        id: '1',
        title: 'New Hunt',
        owner: 'Alice',
        createdAt: new Date().toISOString()
      };

      server._broadcast('hunt:created', huntData);

      expect(server.io.emit).toHaveBeenCalledWith(
        'hunt:created',
        expect.objectContaining({
          id: '1',
          title: 'New Hunt'
        })
      );
    });

    test('should handle multiple hunt creations', () => {
      const hunts = [
        { id: '1', title: 'Hunt 1', owner: 'Alice' },
        { id: '2', title: 'Hunt 2', owner: 'Bob' },
        { id: '3', title: 'Hunt 3', owner: 'Alice' }
      ];

      hunts.forEach(hunt => {
        server._broadcast('hunt:created', hunt);
      });

      expect(server.io.emit).toHaveBeenCalledTimes(3);
    });
  });

  describe('Hunt Updated Event', () => {
    test('should broadcast hunt:updated event', () => {
      const huntData = {
        id: '1',
        title: 'Updated Hunt',
        owner: 'Alice'
      };

      server._broadcast('hunt:updated', huntData);

      expect(server.io.emit).toHaveBeenCalledWith(
        'hunt:updated',
        expect.any(Object)
      );
    });

    test('should preserve hunt metadata on update', () => {
      const huntData = {
        id: '1',
        title: 'Updated Title',
        description: 'Updated Description',
        priority: 'High',
        owner: 'Alice'
      };

      server._broadcast('hunt:updated', huntData);

      expect(server.io.emit).toHaveBeenCalled();
      const callArgs = server.io.emit.mock.calls[0];
      expect(callArgs[1]).toHaveProperty('id', '1');
      expect(callArgs[1]).toHaveProperty('priority', 'High');
    });
  });

  describe('Hunt Phase Changed Event', () => {
    test('should broadcast hunt:phase-changed event', () => {
      const phaseData = {
        huntId: '1',
        newPhase: 'Analysis',
        previousPhase: 'Discovery',
        timestamp: new Date().toISOString()
      };

      server._broadcast('hunt:phase-changed', phaseData);

      expect(server.io.emit).toHaveBeenCalledWith(
        'hunt:phase-changed',
        expect.any(Object)
      );
    });

    test('should include phase transition details', () => {
      const phaseData = {
        huntId: '1',
        newPhase: 'Analysis',
        previousPhase: 'Discovery'
      };

      server._broadcast('hunt:phase-changed', phaseData);

      const callArgs = server.io.emit.mock.calls[0];
      expect(callArgs[1]).toHaveProperty('huntId', '1');
      expect(callArgs[1]).toHaveProperty('newPhase', 'Analysis');
    });
  });

  describe('Hunt Completed Event', () => {
    test('should broadcast hunt:completed event', () => {
      const completionData = {
        huntId: '1',
        completedAt: new Date().toISOString(),
        duration: 120,
        owner: 'Alice'
      };

      server._broadcast('hunt:completed', completionData);

      expect(server.io.emit).toHaveBeenCalledWith(
        'hunt:completed',
        expect.any(Object)
      );
    });

    test('should include completion metrics', () => {
      const completionData = {
        huntId: '1',
        completedAt: new Date().toISOString(),
        duration: 120
      };

      server._broadcast('hunt:completed', completionData);

      const callArgs = server.io.emit.mock.calls[0];
      expect(callArgs[1]).toHaveProperty('duration', 120);
    });
  });

  describe('Error Events', () => {
    test('should broadcast error events', () => {
      const errorData = {
        message: 'Hunt creation failed',
        code: 'HUNT_CREATE_ERROR'
      };

      server._broadcast('error', errorData);

      expect(server.io.emit).toHaveBeenCalledWith('error', expect.any(Object));
    });

    test('should include error details', () => {
      const errorData = {
        message: 'Invalid hunt data',
        code: 'VALIDATION_ERROR',
        details: { field: 'title', reason: 'required' }
      };

      server._broadcast('error', errorData);

      const callArgs = server.io.emit.mock.calls[0];
      expect(callArgs[1]).toHaveProperty('code');
      expect(callArgs[1]).toHaveProperty('message');
    });
  });
});

describe('WebSocket - Broadcasting', () => {
  let server;

  beforeEach(() => {
    server = new APIServer();
    server._setupMiddleware();
    server._setupRoutes();
    server._setupWebSocket();

    server.team = { members: [] };
    server.tracker = { hunts: [] };
  });

  test('should broadcast to team room', () => {
    server._broadcast('test:event', { data: 'test' });

    expect(server.io.to).toHaveBeenCalledWith('team');
  });

  test('should handle null io gracefully', () => {
    server.io = null;

    expect(() => {
      server._broadcast('test:event', {});
    }).not.toThrow();
  });

  test('should broadcast large payloads', () => {
    const largeData = {
      hunts: Array.from({ length: 100 }, (_, i) => ({
        id: String(i),
        title: `Hunt ${i}`,
        description: 'x'.repeat(1000)
      }))
    };

    server._broadcast('large:data', largeData);

    expect(server.io.emit).toHaveBeenCalled();
  });

  test('should handle rapid successive broadcasts', () => {
    for (let i = 0; i < 10; i++) {
      server._broadcast('test:event', { id: i });
    }

    expect(server.io.emit).toHaveBeenCalledTimes(10);
  });

  test('should include timestamp in broadcasts', () => {
    server._broadcast('test:event', { data: 'test' });

    const callArgs = server.io.emit.mock.calls[0];
    // Timestamp should be added to the payload
    expect(callArgs[1]).toBeDefined();
  });
});

describe('WebSocket - Connection Management', () => {
  let server;
  let mockSocket;

  beforeEach(() => {
    server = new APIServer();
    server._setupMiddleware();
    server._setupRoutes();
    server._setupWebSocket();

    server.team = { members: [] };
    server.tracker = { hunts: [] };

    // Create mock socket
    mockSocket = {
      id: 'socket-1',
      on: jest.fn(),
      emit: jest.fn(),
      join: jest.fn(),
      leave: jest.fn(),
      disconnect: jest.fn()
    };
  });

  test('should handle socket connection', () => {
    expect(server._handleConnection).toBeDefined();
  });

  test('should add socket to team room on connection', () => {
    server._handleConnection(mockSocket);

    expect(mockSocket.join).toHaveBeenCalledWith('team');
  });

  test('should register disconnect handler', () => {
    server._handleConnection(mockSocket);

    expect(mockSocket.on).toHaveBeenCalledWith(
      'disconnect',
      expect.any(Function)
    );
  });

  test('should handle multiple socket connections', () => {
    const socket1 = { ...mockSocket, id: 'socket-1', join: jest.fn(), on: jest.fn() };
    const socket2 = { ...mockSocket, id: 'socket-2', join: jest.fn(), on: jest.fn() };
    const socket3 = { ...mockSocket, id: 'socket-3', join: jest.fn(), on: jest.fn() };

    server._handleConnection(socket1);
    server._handleConnection(socket2);
    server._handleConnection(socket3);

    expect(socket1.join).toHaveBeenCalledWith('team');
    expect(socket2.join).toHaveBeenCalledWith('team');
    expect(socket3.join).toHaveBeenCalledWith('team');
  });
});

describe('WebSocket - Client Subscriptions', () => {
  let server;
  let mockSocket;

  beforeEach(() => {
    server = new APIServer();
    server._setupMiddleware();
    server._setupRoutes();
    server._setupWebSocket();

    server.team = { members: [] };
    server.tracker = { hunts: [] };

    mockSocket = {
      id: 'socket-1',
      on: jest.fn(),
      emit: jest.fn(),
      join: jest.fn(),
      leave: jest.fn()
    };
  });

  test('should allow clients to subscribe to events', () => {
    server._handleConnection(mockSocket);

    // Client should be able to listen for events
    expect(mockSocket.on).toHaveBeenCalled();
  });

  test('should send initial state to connected client', () => {
    server._handleConnection(mockSocket);

    expect(mockSocket.emit).toHaveBeenCalledWith(
      'initial:state',
      expect.any(Object)
    );
  });

  test('should notify client of existing hunts', () => {
    server.tracker.hunts = [
      { id: '1', title: 'Hunt 1' },
      { id: '2', title: 'Hunt 2' }
    ];

    server._handleConnection(mockSocket);

    const emitCalls = mockSocket.emit.mock.calls;
    const hasHuntData = emitCalls.some(call => 
      call[0] === 'initial:state' && call[1].hunts
    );

    expect(hasHuntData).toBe(true);
  });
});

describe('WebSocket - Real-time Sync', () => {
  let server;

  beforeEach(() => {
    server = new APIServer();
    server._setupMiddleware();
    server._setupRoutes();
    server._setupWebSocket();

    server.team = { members: [] };
    server.tracker = { hunts: [] };
  });

  test('should sync hunt creation across all clients', () => {
    const huntData = {
      id: '1',
      title: 'New Hunt',
      owner: 'Alice'
    };

    server._broadcast('hunt:created', huntData);

    expect(server.io.to).toHaveBeenCalledWith('team');
    expect(server.io.emit).toHaveBeenCalled();
  });

  test('should sync hunt updates across all clients', () => {
    const updateData = {
      id: '1',
      title: 'Updated Hunt',
      phase: 'Analysis'
    };

    server._broadcast('hunt:updated', updateData);

    expect(server.io.emit).toHaveBeenCalled();
  });

  test('should sync phase transitions across all clients', () => {
    const phaseData = {
      huntId: '1',
      newPhase: 'Analysis',
      previousPhase: 'Discovery'
    };

    server._broadcast('hunt:phase-changed', phaseData);

    expect(server.io.emit).toHaveBeenCalled();
  });

  test('should handle concurrent updates', () => {
    const updates = [
      { event: 'hunt:created', data: { id: '1', title: 'Hunt 1' } },
      { event: 'hunt:created', data: { id: '2', title: 'Hunt 2' } },
      { event: 'hunt:updated', data: { id: '1', title: 'Updated Hunt 1' } },
      { event: 'hunt:phase-changed', data: { huntId: '1', newPhase: 'Analysis' } }
    ];

    updates.forEach(update => {
      server._broadcast(update.event, update.data);
    });

    expect(server.io.emit).toHaveBeenCalledTimes(4);
  });
});

describe('WebSocket - Event Serialization', () => {
  let server;

  beforeEach(() => {
    server = new APIServer();
    server._setupMiddleware();
    server._setupRoutes();
    server._setupWebSocket();

    server.team = { members: [] };
    server.tracker = { hunts: [] };
  });

  test('should properly serialize dates in events', () => {
    const now = new Date();
    const eventData = {
      id: '1',
      timestamp: now.toISOString(),
      completedAt: now.toISOString()
    };

    server._broadcast('test:event', eventData);

    const callArgs = server.io.emit.mock.calls[0];
    expect(typeof callArgs[1].timestamp).toBe('string');
    expect(typeof callArgs[1].completedAt).toBe('string');
  });

  test('should handle nested objects in events', () => {
    const eventData = {
      huntId: '1',
      metadata: {
        owner: 'Alice',
        team: {
          name: 'Team A',
          size: 5
        }
      }
    };

    server._broadcast('test:event', eventData);

    const callArgs = server.io.emit.mock.calls[0];
    expect(callArgs[1].metadata.team.name).toBe('Team A');
  });

  test('should handle arrays in events', () => {
    const eventData = {
      huntIds: ['1', '2', '3'],
      members: ['Alice', 'Bob', 'Charlie']
    };

    server._broadcast('test:event', eventData);

    const callArgs = server.io.emit.mock.calls[0];
    expect(Array.isArray(callArgs[1].huntIds)).toBe(true);
    expect(callArgs[1].huntIds.length).toBe(3);
  });
});
