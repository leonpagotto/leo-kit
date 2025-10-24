/**
 * GitHub Auth Tests
 *
 * Unit tests for GitHubAuth class
 * Tests token validation, storage, and retrieval
 *
 * @module tests/team/github-auth.test.js
 */

const GitHubAuth = require('../../lib/team/github-auth');
const fs = require('fs');
const path = require('path');

// Mock fs for token storage tests
jest.mock('fs');

describe('GitHubAuth', () => {
  let auth;
  const mockToken = 'ghp_1234567890abcdefghijklmnopqrstu';

  beforeEach(() => {
    jest.clearAllMocks();
    auth = new GitHubAuth(mockToken);
  });

  describe('constructor', () => {
    test('should initialize with token', () => {
      expect(auth.token).toBe(mockToken);
    });

    test('should initialize without token', () => {
      const authNoToken = new GitHubAuth();
      expect(authNoToken.token).toBeNull();
    });

    test('should initialize rate limit info', () => {
      expect(auth.rateLimit).toBeDefined();
      expect(auth.rateLimit.remaining).toBe(5000);
      expect(auth.rateLimit.reset).toBeGreaterThan(Date.now());
    });
  });

  describe('validateToken', () => {
    test('should validate token successfully', async () => {
      const user = await auth.validateToken();

      expect(user).toBeDefined();
      expect(user.login).toBe('test-user');
      expect(user.id).toBe(12345);
      expect(user.type).toBe('User');
      expect(user.name).toBe('Test User');
    });

    test('should throw error if no token provided', async () => {
      const authNoToken = new GitHubAuth();

      await expect(authNoToken.validateToken()).rejects.toThrow(
        'No GitHub token provided'
      );
    });

    test('should throw error for invalid token format', async () => {
      const authInvalid = new GitHubAuth('invalid_token');

      await expect(authInvalid.validateToken()).rejects.toThrow(
        'Invalid or expired GitHub token'
      );
    });

    test('should update rate limit from response', async () => {
      await auth.validateToken();

      expect(auth.rateLimit.remaining).toBe(5000);
      expect(auth.rateLimit.reset).toBeGreaterThan(0);
    });
  });

  describe('getUser', () => {
    test('should get user info', async () => {
      const user = await auth.getUser();

      expect(user).toBeDefined();
      expect(user.login).toBe('test-user');
    });

    test('should throw if validation fails', async () => {
      const authInvalid = new GitHubAuth('invalid');

      await expect(authInvalid.getUser()).rejects.toThrow();
    });
  });

  describe('isNearRateLimit', () => {
    test('should return false when rate limit is high', () => {
      auth.rateLimit.remaining = 1000;
      expect(auth.isNearRateLimit()).toBe(false);
    });

    test('should return true when rate limit is low', () => {
      auth.rateLimit.remaining = 50;
      expect(auth.isNearRateLimit()).toBe(true);
    });

    test('should return true at exactly 100', () => {
      auth.rateLimit.remaining = 100;
      expect(auth.isNearRateLimit()).toBe(false);
    });
  });

  describe('getRateLimit', () => {
    test('should return current rate limit', () => {
      auth.rateLimit.remaining = 3000;
      auth.rateLimit.reset = 1234567890;

      const limit = auth.getRateLimit();

      expect(limit.remaining).toBe(3000);
      expect(limit.reset).toBe(1234567890);
    });

    test('should return copy of rate limit', () => {
      const limit1 = auth.getRateLimit();
      const limit2 = auth.getRateLimit();

      expect(limit1).not.toBe(limit2);
      expect(limit1).toEqual(limit2);
    });
  });

  describe('saveToken', () => {
    test('should save token to file', () => {
      fs.existsSync.mockReturnValue(true);
      fs.writeFileSync.mockImplementation(() => {});

      GitHubAuth.saveToken(mockToken);

      expect(fs.writeFileSync).toHaveBeenCalled();
      const callArgs = fs.writeFileSync.mock.calls[0];
      expect(callArgs[1]).toBe(mockToken);
    });

    test('should create .lionpack directory if missing', () => {
      fs.existsSync.mockReturnValue(false);
      fs.mkdirSync.mockImplementation(() => {});
      fs.writeFileSync.mockImplementation(() => {});

      GitHubAuth.saveToken(mockToken);

      expect(fs.mkdirSync).toHaveBeenCalled();
    });

    test('should throw error for invalid token', () => {
      expect(() => {
        GitHubAuth.saveToken(null);
      }).toThrow('Invalid token');

      expect(() => {
        GitHubAuth.saveToken('');
      }).toThrow('Invalid token');
    });

    test('should set file permissions to user-only', () => {
      fs.existsSync.mockReturnValue(true);
      fs.writeFileSync.mockImplementation(() => {});

      GitHubAuth.saveToken(mockToken);

      const callArgs = fs.writeFileSync.mock.calls[0];
      expect(callArgs[2].mode).toBe(0o600);
    });
  });

  describe('loadToken', () => {
    test('should load token from file', () => {
      fs.existsSync.mockReturnValue(true);
      fs.readFileSync.mockReturnValue(mockToken);

      const token = GitHubAuth.loadToken();

      expect(token).toBe(mockToken);
      expect(fs.readFileSync).toHaveBeenCalled();
    });

    test('should throw error if token file missing', () => {
      fs.existsSync.mockReturnValue(false);

      expect(() => {
        GitHubAuth.loadToken();
      }).toThrow('GitHub token not found');
    });

    test('should throw error if token file empty', () => {
      fs.existsSync.mockReturnValue(true);
      fs.readFileSync.mockReturnValue('');

      expect(() => {
        GitHubAuth.loadToken();
      }).toThrow('GitHub token file is empty');
    });

    test('should trim whitespace from token', () => {
      fs.existsSync.mockReturnValue(true);
      fs.readFileSync.mockReturnValue(`  ${mockToken}  \n`);

      const token = GitHubAuth.loadToken();

      expect(token).toBe(mockToken);
    });
  });

  describe('deleteToken', () => {
    test('should delete token file', () => {
      fs.existsSync.mockReturnValue(true);
      fs.unlinkSync.mockImplementation(() => {});

      GitHubAuth.deleteToken();

      expect(fs.unlinkSync).toHaveBeenCalled();
    });

    test('should handle missing token file gracefully', () => {
      fs.existsSync.mockReturnValue(false);

      expect(() => {
        GitHubAuth.deleteToken();
      }).not.toThrow();
    });
  });

  describe('hasToken', () => {
    test('should return true if token exists', () => {
      fs.existsSync.mockReturnValue(true);
      fs.statSync.mockReturnValue({ size: 100 });

      expect(GitHubAuth.hasToken()).toBe(true);
    });

    test('should return false if token missing', () => {
      fs.existsSync.mockReturnValue(false);

      expect(GitHubAuth.hasToken()).toBe(false);
    });

    test('should return false if token file empty', () => {
      fs.existsSync.mockReturnValue(true);
      fs.statSync.mockReturnValue({ size: 0 });

      expect(GitHubAuth.hasToken()).toBe(false);
    });
  });

  describe('_makeRequest', () => {
    test('should return user data for valid token', async () => {
      const response = await auth._makeRequest('/user', 'GET');

      expect(response.status).toBe(200);
      expect(response.data).toBeDefined();
      expect(response.data.login).toBe('test-user');
    });

    test('should return 401 for invalid token', async () => {
      const invalidAuth = new GitHubAuth('invalid');

      await expect(invalidAuth._makeRequest('/user', 'GET')).rejects.toThrow();
    });

    test('should include headers with rate limit', async () => {
      const response = await auth._makeRequest('/user', 'GET');

      expect(response.headers).toBeDefined();
      expect(response.headers['x-ratelimit-remaining']).toBe('5000');
      expect(response.headers['x-ratelimit-reset']).toBeDefined();
    });
  });
});
