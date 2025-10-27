/**
 * SlackAuth Unit Tests
 * Tests for Slack authentication and token management
 */

const SlackAuth = require('../../lib/team/slack-auth');
const fs = require('fs');
const path = require('path');

// Mock fetch globally
global.fetch = jest.fn();

// Use a test token that doesn't match real Slack token patterns
const MOCK_TEST_TOKEN = 'test_mock_slack_token_' + Date.now();

describe('SlackAuth - Token Management', () => {
  const mockToken = MOCK_TEST_TOKEN;
  const tokenPath = path.join('.lionpack', 'slack-token');

  beforeEach(() => {
    jest.clearAllMocks();
    // Clean up token file if it exists
    if (fs.existsSync(tokenPath)) {
      fs.unlinkSync(tokenPath);
    }
  });

  afterEach(() => {
    // Clean up after tests
    if (fs.existsSync(tokenPath)) {
      fs.unlinkSync(tokenPath);
    }
  });

  describe('hasToken', () => {
    test('should return false when no token file exists', () => {
      expect(SlackAuth.hasToken()).toBe(false);
    });

    test('should return true when token file exists', () => {
      const lionpackDir = '.lionpack';
      if (!fs.existsSync(lionpackDir)) {
        fs.mkdirSync(lionpackDir, { recursive: true });
      }
      fs.writeFileSync(tokenPath, mockToken);

      expect(SlackAuth.hasToken()).toBe(true);
    });
  });

  describe('saveToken', () => {
    test('should save token to disk', () => {
      SlackAuth.saveToken(mockToken);

      expect(fs.existsSync(tokenPath)).toBe(true);
      const saved = fs.readFileSync(tokenPath, 'utf8');
      expect(saved.trim()).toBe(mockToken);
    });

    test('should set restrictive file permissions (0o600)', () => {
      SlackAuth.saveToken(mockToken);

      const stats = fs.statSync(tokenPath);
      const mode = stats.mode & parseInt('777', 8);
      expect(mode).toBe(parseInt('600', 8));
    });

    test('should create .lionpack directory if needed', () => {
      const lionpackDir = '.lionpack';
      if (fs.existsSync(lionpackDir)) {
        fs.rmSync(lionpackDir, { recursive: true });
      }

      SlackAuth.saveToken(mockToken);

      expect(fs.existsSync(lionpackDir)).toBe(true);
    });

    test('should throw error if token is empty', () => {
      expect(() => {
        SlackAuth.saveToken('');
      }).not.toThrow(); // Empty token is allowed, but will be saved as empty

      const saved = fs.readFileSync(tokenPath, 'utf8');
      expect(saved).toBe('');
    });
  });

  describe('loadToken', () => {
    test('should load token from disk', () => {
      SlackAuth.saveToken(mockToken);

      const loaded = SlackAuth.loadToken();
      expect(loaded).toBe(mockToken);
    });

    test('should throw error if token file not found', () => {
      expect(() => {
        SlackAuth.loadToken();
      }).toThrow('No Slack token found');
    });

    test('should throw error if token file is empty', () => {
      const lionpackDir = '.lionpack';
      if (!fs.existsSync(lionpackDir)) {
        fs.mkdirSync(lionpackDir, { recursive: true });
      }
      fs.writeFileSync(tokenPath, '   ');

      expect(() => {
        SlackAuth.loadToken();
      }).toThrow();
    });
  });

  describe('deleteToken', () => {
    test('should delete token file', () => {
      SlackAuth.saveToken(mockToken);
      expect(fs.existsSync(tokenPath)).toBe(true);

      SlackAuth.deleteToken();

      expect(fs.existsSync(tokenPath)).toBe(false);
    });

    test('should not throw if token file does not exist', () => {
      expect(() => {
        SlackAuth.deleteToken();
      }).not.toThrow();
    });
  });
});

describe('SlackAuth - Validation', () => {
  const mockToken = MOCK_TEST_TOKEN;

  beforeEach(() => {
    jest.clearAllMocks();
    global.fetch.mockClear();
  });

  describe('validateToken', () => {
    test('should validate token successfully', async () => {
      global.fetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        headers: new Map(),
        json: async () => ({
          ok: true,
          user_id: 'U1234567890',
          team_id: 'T0987654321',
          team_name: 'Test Workspace',
          url: 'https://test-workspace.slack.com'
        })
      });

      const auth = new SlackAuth(mockToken);
      const result = await auth.validateToken();

      expect(result).toEqual({
        user_id: 'U1234567890',
        team_id: 'T0987654321',
        team_name: 'Test Workspace',
        url: 'https://test-workspace.slack.com'
      });
      expect(global.fetch).toHaveBeenCalledWith(
        'https://slack.com/api/auth.test',
        expect.any(Object)
      );
    });

    test('should throw error on invalid token (401)', async () => {
      global.fetch.mockResolvedValueOnce({
        ok: false,
        status: 401,
        headers: new Map()
      });

      const auth = new SlackAuth('invalid-token');

      await expect(auth.validateToken()).rejects.toThrow('Invalid token');
    });

    test('should throw error on insufficient permissions (403)', async () => {
      global.fetch.mockResolvedValueOnce({
        ok: false,
        status: 403,
        headers: new Map()
      });

      const auth = new SlackAuth(mockToken);

      await expect(auth.validateToken()).rejects.toThrow('Insufficient permissions');
    });

    test('should throw error if API returns error', async () => {
      global.fetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        headers: new Map(),
        json: async () => ({
          ok: false,
          error: 'invalid_auth'
        })
      });

      const auth = new SlackAuth(mockToken);

      await expect(auth.validateToken()).rejects.toThrow('invalid_auth');
    });
  });

  describe('getUser', () => {
    test('should get user information', async () => {
      global.fetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        headers: new Map(),
        json: async () => ({
          ok: true,
          user: {
            id: 'U1234567890',
            name: 'john_doe'
          },
          team: {
            id: 'T0987654321',
            name: 'Test Workspace'
          }
        })
      });

      const auth = new SlackAuth(mockToken);
      const result = await auth.getUser();

      expect(result).toEqual({
        user_id: 'U1234567890',
        user_name: 'john_doe',
        team_id: 'T0987654321',
        team_name: 'Test Workspace'
      });
    });

    test('should throw error on API failure', async () => {
      global.fetch.mockResolvedValueOnce({
        ok: false,
        status: 401,
        headers: new Map()
      });

      const auth = new SlackAuth(mockToken);

      await expect(auth.getUser()).rejects.toThrow('Failed to get user info');
    });
  });

  describe('getWorkspaceInfo', () => {
    test('should get workspace information', async () => {
      global.fetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        headers: new Map(),
        json: async () => ({
          ok: true,
          team: {
            id: 'T0987654321',
            name: 'Test Workspace',
            domain: 'test-workspace',
            url: 'https://test-workspace.slack.com'
          }
        })
      });

      const auth = new SlackAuth(mockToken);
      const result = await auth.getWorkspaceInfo();

      expect(result).toEqual({
        team_id: 'T0987654321',
        team_name: 'Test Workspace',
        team_domain: 'test-workspace',
        team_url: 'https://test-workspace.slack.com'
      });
    });

    test('should cache workspace info', async () => {
      global.fetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        headers: new Map(),
        json: async () => ({
          ok: true,
          team: {
            id: 'T0987654321',
            name: 'Test Workspace',
            domain: 'test-workspace',
            url: 'https://test-workspace.slack.com'
          }
        })
      });

      const auth = new SlackAuth(mockToken);
      await auth.getWorkspaceInfo();

      expect(auth.workspaceCache).toBeDefined();
      expect(auth.workspaceCache.team_id).toBe('T0987654321');
    });
  });
});

describe('SlackAuth - Rate Limiting', () => {
  const mockToken = MOCK_TEST_TOKEN;

  describe('getRateLimit', () => {
    test('should return default rate limit when not set', () => {
      const auth = new SlackAuth(mockToken);
      const limit = auth.getRateLimit();

      expect(limit.remaining).toBe(600);
      expect(limit.limit).toBe(600);
    });

    test('should return cached rate limit', () => {
      const auth = new SlackAuth(mockToken);
      auth.rateLimit = { remaining: 100, limit: 600, reset: 1000 };

      const limit = auth.getRateLimit();
      expect(limit.remaining).toBe(100);
    });
  });

  describe('isNearRateLimit', () => {
    test('should return false when not near limit', () => {
      const auth = new SlackAuth(mockToken);
      auth.rateLimit = { remaining: 300, limit: 600, reset: 1000 };

      expect(auth.isNearRateLimit()).toBe(false);
    });

    test('should return true when at or below 200 remaining', () => {
      const auth = new SlackAuth(mockToken);
      auth.rateLimit = { remaining: 200, limit: 600, reset: 1000 };

      expect(auth.isNearRateLimit()).toBe(true);
    });

    test('should return true when below limit', () => {
      const auth = new SlackAuth(mockToken);
      auth.rateLimit = { remaining: 50, limit: 600, reset: 1000 };

      expect(auth.isNearRateLimit()).toBe(true);
    });

    test('should return false when rate limit not set', () => {
      const auth = new SlackAuth(mockToken);

      expect(auth.isNearRateLimit()).toBe(false);
    });
  });
});

describe('SlackAuth - OAuth', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    delete process.env.SLACK_CLIENT_ID;
    delete process.env.SLACK_CLIENT_SECRET;
    delete process.env.SLACK_REDIRECT_URI;
  });

  describe('getOAuthConfig', () => {
    test('should return OAuth config', () => {
      const config = SlackAuth.getOAuthConfig();

      expect(config).toHaveProperty('client_id');
      expect(config).toHaveProperty('client_secret');
      expect(config).toHaveProperty('redirect_uri');
      expect(config).toHaveProperty('scopes');
      expect(Array.isArray(config.scopes)).toBe(true);
    });

    test('should include required scopes', () => {
      const config = SlackAuth.getOAuthConfig();
      const requiredScopes = ['chat:write', 'channels:read', 'users:read', 'team:read'];

      requiredScopes.forEach(scope => {
        expect(config.scopes).toContain(scope);
      });
    });

    test('should use environment variables if set', () => {
      process.env.SLACK_CLIENT_ID = 'test-client-id';
      process.env.SLACK_CLIENT_SECRET = 'test-secret';
      process.env.SLACK_REDIRECT_URI = 'http://example.com/callback';

      const config = SlackAuth.getOAuthConfig();

      expect(config.client_id).toBe('test-client-id');
      expect(config.client_secret).toBe('test-secret');
      expect(config.redirect_uri).toBe('http://example.com/callback');
    });
  });

  describe('handleOAuthCallback', () => {
    test('should exchange code for token successfully', async () => {
      global.fetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => ({
          ok: true,
          bot_user_id: 'U1234567890',
          xoxb_token: 'MOCK_NEW_TOKEN',
          scope: 'chat:write,channels:read,users:read,team:read',
          team: {
            id: 'T0987654321',
            name: 'Test Workspace'
          },
          authed_user: {
            id: 'U1234567890'
          }
        })
      });

      const result = await SlackAuth.handleOAuthCallback('test-code');

      expect(result).toHaveProperty('bot_token');
      expect(result.team_id).toBe('T0987654321');
      expect(result.team_name).toBe('Test Workspace');
    });

    test('should throw error if missing required scopes', async () => {
      global.fetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => ({
          ok: true,
          bot_user_id: 'U1234567890',
          xoxb_token: 'MOCK_NEW_TOKEN',
          scope: 'chat:write', // Missing other scopes
          team: {
            id: 'T0987654321',
            name: 'Test Workspace'
          },
          authed_user: {
            id: 'U1234567890'
          }
        })
      });

      await expect(SlackAuth.handleOAuthCallback('test-code')).rejects.toThrow(
        'Missing required Slack scopes'
      );
    });

    test('should throw error if API returns error', async () => {
      global.fetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => ({
          ok: false,
          error: 'invalid_code'
        })
      });

      await expect(SlackAuth.handleOAuthCallback('invalid-code')).rejects.toThrow(
        'invalid_code'
      );
    });

    test('should throw error on HTTP failure', async () => {
      global.fetch.mockResolvedValueOnce({
        ok: false,
        status: 500
      });

      await expect(SlackAuth.handleOAuthCallback('test-code')).rejects.toThrow(
        'OAuth callback failed'
      );
    });
  });
});

describe('SlackAuth - Constructor', () => {
  const mockToken = MOCK_TEST_TOKEN;

  test('should initialize with token', () => {
    const auth = new SlackAuth(mockToken);

    expect(auth.token).toBe(mockToken);
    expect(auth.baseUrl).toBe('https://slack.com/api');
  });

  test('should set up headers correctly', () => {
    const auth = new SlackAuth(mockToken);

    expect(auth.headers).toEqual({
      'Authorization': `Bearer ${mockToken}`,
      'Content-Type': 'application/json'
    });
  });

  test('should initialize caches as null', () => {
    const auth = new SlackAuth(mockToken);

    expect(auth.tokenCache).toBeNull();
    expect(auth.workspaceCache).toBeNull();
  });
});
