/**
 * SlackIntegration Unit Tests
 * Tests for Slack notification and integration functionality
 */

const SlackIntegration = require('../../lib/team/slack-integration');
const SlackAuth = require('../../lib/team/slack-auth');

// Mock fetch globally
global.fetch = jest.fn();

describe('SlackIntegration - Constructor', () => {
  const mockToken = 'mock-xoxb-token-for-testing-only';
  const mockChannelId = 'C1234567890';

  test('should initialize with SlackAuth and channel ID', () => {
    const auth = new SlackAuth(mockToken);
    const integration = new SlackIntegration(auth, mockChannelId);

    expect(integration.auth).toBe(auth);
    expect(integration.channelId).toBe(mockChannelId);
    expect(integration.baseUrl).toBe('https://slack.com/api');
  });

  test('should throw error if SlackAuth is not provided', () => {
    expect(() => {
      new SlackIntegration('not-an-auth', mockChannelId);
    }).toThrow('SlackIntegration requires SlackAuth instance');
  });

  test('should set default colors', () => {
    const auth = new SlackAuth(mockToken);
    const integration = new SlackIntegration(auth, mockChannelId);

    expect(integration.defaultColor).toBe('#2196F3');
    expect(integration.successColor).toBe('#4CAF50');
    expect(integration.warningColor).toBe('#FF9800');
    expect(integration.errorColor).toBe('#F44336');
  });
});

describe('SlackIntegration - Hunt Notifications', () => {
  const mockToken = 'mock-xoxb-token-for-testing-only';
  const mockChannelId = 'C1234567890';
  const mockHunt = {
    title: 'Test Hunt',
    description: 'Test Description',
    currentPhase: 'Discovery',
    owner: 'john_doe',
    priority: 'High',
    createdAt: new Date().toISOString()
  };

  beforeEach(() => {
    jest.clearAllMocks();
    global.fetch.mockClear();
  });

  describe('notifyHuntCreated', () => {
    test('should send hunt created notification', async () => {
      global.fetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => ({
          ok: true,
          ts: '1234567890.123456'
        })
      });

      const auth = new SlackAuth(mockToken);
      const integration = new SlackIntegration(auth, mockChannelId);

      const result = await integration.notifyHuntCreated(mockHunt);

      expect(result).toBe('1234567890.123456');
      expect(global.fetch).toHaveBeenCalledWith(
        'https://slack.com/api/chat.postMessage',
        expect.objectContaining({
          method: 'POST',
          headers: expect.any(Object)
        })
      );
    });

    test('should include hunt details in notification', async () => {
      global.fetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => ({
          ok: true,
          ts: '1234567890.123456'
        })
      });

      const auth = new SlackAuth(mockToken);
      const integration = new SlackIntegration(auth, mockChannelId);

      await integration.notifyHuntCreated(mockHunt);

      const callArgs = global.fetch.mock.calls[0];
      const payload = JSON.parse(callArgs[1].body);

      expect(payload.blocks).toBeDefined();
      expect(payload.text).toContain('Test Hunt');
    });

    test('should throw error on API failure', async () => {
      global.fetch.mockResolvedValueOnce({
        ok: false,
        status: 500
      });

      const auth = new SlackAuth(mockToken);
      const integration = new SlackIntegration(auth, mockChannelId);

      await expect(integration.notifyHuntCreated(mockHunt)).rejects.toThrow(
        'Failed to send hunt created notification'
      );
    });
  });

  describe('notifyPhaseTransition', () => {
    test('should send phase transition notification', async () => {
      global.fetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => ({
          ok: true,
          ts: '1234567890.123456'
        })
      });

      const auth = new SlackAuth(mockToken);
      const integration = new SlackIntegration(auth, mockChannelId);

      const result = await integration.notifyPhaseTransition(
        mockHunt,
        'Discovery',
        'Analysis'
      );

      expect(result).toBe('1234567890.123456');
    });

    test('should include phase transition details', async () => {
      global.fetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => ({
          ok: true,
          ts: '1234567890.123456'
        })
      });

      const auth = new SlackAuth(mockToken);
      const integration = new SlackIntegration(auth, mockChannelId);

      await integration.notifyPhaseTransition(
        mockHunt,
        'Discovery',
        'Analysis'
      );

      const callArgs = global.fetch.mock.calls[0];
      const payload = JSON.parse(callArgs[1].body);
      const text = JSON.stringify(payload.blocks);

      expect(text).toContain('Analysis');
      expect(text).toContain('Discovery');
    });

    test('should include GitHub issue link if available', async () => {
      global.fetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => ({
          ok: true,
          ts: '1234567890.123456'
        })
      });

      const huntWithGitHub = {
        ...mockHunt,
        githubIssue: { number: 42 }
      };

      const auth = new SlackAuth(mockToken);
      const integration = new SlackIntegration(auth, mockChannelId);

      await integration.notifyPhaseTransition(
        huntWithGitHub,
        'Discovery',
        'Analysis'
      );

      const callArgs = global.fetch.mock.calls[0];
      const payload = JSON.parse(callArgs[1].body);
      const text = JSON.stringify(payload.blocks);

      expect(text).toContain('GitHub');
    });
  });

  describe('notifyHuntCompleted', () => {
    test('should send hunt completed notification', async () => {
      global.fetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => ({
          ok: true,
          ts: '1234567890.123456'
        })
      });

      const auth = new SlackAuth(mockToken);
      const integration = new SlackIntegration(auth, mockChannelId);

      const result = await integration.notifyHuntCompleted(mockHunt, {
        duration: 120,
        completionRate: 100
      });

      expect(result).toBe('1234567890.123456');
    });

    test('should include completion metrics', async () => {
      global.fetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => ({
          ok: true,
          ts: '1234567890.123456'
        })
      });

      const auth = new SlackAuth(mockToken);
      const integration = new SlackIntegration(auth, mockChannelId);

      await integration.notifyHuntCompleted(mockHunt, {
        duration: 120,
        completionRate: 100,
        phasesCompleted: 5
      });

      const callArgs = global.fetch.mock.calls[0];
      const payload = JSON.parse(callArgs[1].body);
      const text = JSON.stringify(payload.blocks);

      expect(text).toContain('Completed');
      expect(text).toContain('100%');
    });

    test('should show success color in notification', async () => {
      global.fetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => ({
          ok: true,
          ts: '1234567890.123456'
        })
      });

      const auth = new SlackAuth(mockToken);
      const integration = new SlackIntegration(auth, mockChannelId);

      await integration.notifyHuntCompleted(mockHunt);

      const callArgs = global.fetch.mock.calls[0];
      const payload = JSON.parse(callArgs[1].body);

      expect(payload.text).toContain('✅');
    });
  });
});

describe('SlackIntegration - Error Notifications', () => {
  const mockToken = 'mock-xoxb-token-for-testing-only';
  const mockChannelId = 'C1234567890';

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('notifyError', () => {
    test('should send error notification', async () => {
      global.fetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => ({
          ok: true,
          ts: '1234567890.123456'
        })
      });

      const auth = new SlackAuth(mockToken);
      const integration = new SlackIntegration(auth, mockChannelId);

      const result = await integration.notifyError(
        'Hunt Failed',
        'Failed to complete hunt'
      );

      expect(result).toBe('1234567890.123456');
    });

    test('should include error details', async () => {
      global.fetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => ({
          ok: true,
          ts: '1234567890.123456'
        })
      });

      const auth = new SlackAuth(mockToken);
      const integration = new SlackIntegration(auth, mockChannelId);

      await integration.notifyError(
        'Hunt Failed',
        'Failed to complete hunt',
        { code: 'ERR_001', timestamp: '2024-01-01' }
      );

      const callArgs = global.fetch.mock.calls[0];
      const payload = JSON.parse(callArgs[1].body);
      const text = JSON.stringify(payload.blocks);

      expect(text).toContain('ERR_001');
    });
  });
});

describe('SlackIntegration - Summary Notifications', () => {
  const mockToken = 'mock-xoxb-token-for-testing-only';
  const mockChannelId = 'C1234567890';
  const mockHunts = [
    { title: 'Hunt 1', currentPhase: 'Analysis' },
    { title: 'Hunt 2', currentPhase: 'Implementation' }
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('sendDailySummary', () => {
    test('should send daily summary notification', async () => {
      global.fetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => ({
          ok: true,
          ts: '1234567890.123456'
        })
      });

      const auth = new SlackAuth(mockToken);
      const integration = new SlackIntegration(auth, mockChannelId);

      const result = await integration.sendDailySummary(mockHunts, {
        completedToday: 3,
        avgDuration: 120,
        successRate: 95
      });

      expect(result).toBe('1234567890.123456');
    });

    test('should include summary statistics', async () => {
      global.fetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => ({
          ok: true,
          ts: '1234567890.123456'
        })
      });

      const auth = new SlackAuth(mockToken);
      const integration = new SlackIntegration(auth, mockChannelId);

      await integration.sendDailySummary(mockHunts, {
        completedToday: 3,
        avgDuration: 120,
        successRate: 95
      });

      const callArgs = global.fetch.mock.calls[0];
      const payload = JSON.parse(callArgs[1].body);
      const text = JSON.stringify(payload.blocks);

      expect(text).toContain('3'); // completedToday
      expect(text).toContain('95'); // successRate
    });

    test('should list active hunts', async () => {
      global.fetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => ({
          ok: true,
          ts: '1234567890.123456'
        })
      });

      const auth = new SlackAuth(mockToken);
      const integration = new SlackIntegration(auth, mockChannelId);

      await integration.sendDailySummary(mockHunts);

      const callArgs = global.fetch.mock.calls[0];
      const payload = JSON.parse(callArgs[1].body);
      const text = JSON.stringify(payload.blocks);

      expect(text).toContain('Hunt 1');
      expect(text).toContain('Hunt 2');
    });
  });
});

describe('SlackIntegration - Static Utilities', () => {
  describe('createMessage', () => {
    test('should create message with title', () => {
      const blocks = SlackIntegration.createMessage('Test Title');

      expect(blocks).toHaveLength(1);
      expect(blocks[0].type).toBe('header');
      expect(blocks[0].text.text).toBe('Test Title');
    });

    test('should create message with fields', () => {
      const fields = { 'Field 1': 'Value 1', 'Field 2': 'Value 2' };
      const blocks = SlackIntegration.createMessage('Title', fields);

      expect(blocks).toHaveLength(2);
      expect(blocks[1].type).toBe('section');
      expect(blocks[1].fields).toHaveLength(2);
    });

    test('should include color parameter', () => {
      const blocks = SlackIntegration.createMessage('Title', {}, '#FF0000');

      expect(blocks).toBeDefined();
    });
  });

  describe('createActions', () => {
    test('should create action buttons', () => {
      const actions = [
        { label: 'Approve', value: 'approve' },
        { label: 'Reject', value: 'reject' }
      ];

      const block = SlackIntegration.createActions(actions);

      expect(block.type).toBe('actions');
      expect(block.elements).toHaveLength(2);
    });

    test('should set action IDs from labels', () => {
      const actions = [{ label: 'Test Action', value: 'test' }];
      const block = SlackIntegration.createActions(actions);

      expect(block.elements[0].action_id).toBe('test_action');
    });

    test('should create empty actions block', () => {
      const block = SlackIntegration.createActions();

      expect(block.type).toBe('actions');
      expect(block.elements).toHaveLength(0);
    });
  });
});

describe('SlackIntegration - Private Utilities', () => {
  const mockToken = 'mock-xoxb-token-for-testing-only';
  const mockChannelId = 'C1234567890';

  describe('_calculateProgress', () => {
    test('should calculate progress from phases', () => {
      const auth = new SlackAuth(mockToken);
      const integration = new SlackIntegration(auth, mockChannelId);

      const hunt = {
        phases: [
          { completed: true },
          { completed: true },
          { completed: false }
        ]
      };

      const progress = integration._calculateProgress(hunt);

      expect(progress).toBe('67%');
    });

    test('should return 0% for no phases', () => {
      const auth = new SlackAuth(mockToken);
      const integration = new SlackIntegration(auth, mockChannelId);

      const hunt = { phases: [] };
      const progress = integration._calculateProgress(hunt);

      expect(progress).toBe('0%');
    });

    test('should return 100% for all phases completed', () => {
      const auth = new SlackAuth(mockToken);
      const integration = new SlackIntegration(auth, mockChannelId);

      const hunt = {
        phases: [
          { completed: true },
          { completed: true },
          { completed: true }
        ]
      };

      const progress = integration._calculateProgress(hunt);

      expect(progress).toBe('100%');
    });
  });

  describe('_formatDuration', () => {
    test('should format duration in minutes', () => {
      const auth = new SlackAuth(mockToken);
      const integration = new SlackIntegration(auth, mockChannelId);

      expect(integration._formatDuration(45)).toBe('45m');
    });

    test('should format duration in hours', () => {
      const auth = new SlackAuth(mockToken);
      const integration = new SlackIntegration(auth, mockChannelId);

      expect(integration._formatDuration(120)).toBe('2h');
    });

    test('should format duration in hours and minutes', () => {
      const auth = new SlackAuth(mockToken);
      const integration = new SlackIntegration(auth, mockChannelId);

      expect(integration._formatDuration(150)).toBe('2h 30m');
    });
  });
});
