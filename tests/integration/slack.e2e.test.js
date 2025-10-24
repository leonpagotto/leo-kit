/**
 * Slack Integration E2E Tests
 * End-to-end testing of Slack notifications with hunt lifecycle
 */

const SlackAuth = require('../../lib/team/slack-auth');
const SlackIntegration = require('../../lib/team/slack-integration');
const path = require('path');
const fs = require('fs');

// Mock fetch globally
global.fetch = jest.fn();

// Helper function to create test config
function getTestConfig() {
  return {
    slack: {
      enabled: true,
      channelId: 'C1234567890',
      botToken: 'xoxb-test-token'
    },
    github: {
      enabled: true,
      projectId: 'PVT_1234'
    },
    owner: 'test_user',
    workflow: {
      sequence: ['Discovery', 'Analysis', 'Implementation', 'Testing', 'Completed'],
      columns: [
        { id: 'Discovery', name: 'Discovery' },
        { id: 'Analysis', name: 'Analysis' },
        { id: 'Implementation', name: 'Implementation' },
        { id: 'Testing', name: 'Testing' },
        { id: 'Completed', name: 'Completed' }
      ]
    }
  };
}

// Helper function to create test hunt
function getTestHunt(overrides = {}) {
  return {
    id: 'hunt-123',
    featureName: 'Test Feature',
    title: 'Test Feature',
    description: 'Test feature description',
    owner: 'test_user',
    priority: 'High',
    currentPhase: 'Discovery',
    createdAt: new Date().toISOString(),
    phases: [
      { name: 'Discovery', completed: true },
      { name: 'Analysis', completed: false },
      { name: 'Implementation', completed: false },
      { name: 'Testing', completed: false },
      { name: 'Completed', completed: false }
    ],
    githubIssue: {
      number: 42,
      id: 'I_1234567890',
      url: 'https://github.com/test/repo/issues/42'
    },
    getTotalDuration: () => 120,
    ...overrides
  };
}

describe('Slack Integration - Hunt Lifecycle', () => {
  const mockToken = 'xoxb-test-token';
  const mockChannelId = 'C1234567890';
  let slackAuth;
  let slackIntegration;

  beforeEach(() => {
    jest.clearAllMocks();
    global.fetch.mockClear();
    slackAuth = new SlackAuth(mockToken);
    slackIntegration = new SlackIntegration(slackAuth, mockChannelId);
  });

  describe('Hunt Lifecycle Scenario 1: Create Hunt', () => {
    test('should notify hunt creation', async () => {
      global.fetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => ({
          ok: true,
          ts: '1234567890.123456'
        })
      });

      const hunt = getTestHunt();
      const result = await slackIntegration.notifyHuntCreated(hunt);

      expect(result).toBe('1234567890.123456');
      expect(global.fetch).toHaveBeenCalledTimes(1);

      const call = global.fetch.mock.calls[0];
      expect(call[0]).toContain('chat.postMessage');

      const payload = JSON.parse(call[1].body);
      expect(payload.channel).toBe(mockChannelId);
      expect(payload.text).toContain('Test Feature');
    });

    test('should include all hunt details in creation notification', async () => {
      global.fetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => ({
          ok: true,
          ts: '1234567890.123456'
        })
      });

      const hunt = getTestHunt();
      await slackIntegration.notifyHuntCreated(hunt);

      const payload = JSON.parse(global.fetch.mock.calls[0][1].body);
      const blockText = JSON.stringify(payload.blocks);

      expect(blockText).toContain('Test Feature');
      expect(blockText).toContain('Test feature description');
      expect(blockText).toContain('High');
      expect(blockText).toContain('test_user');
    });
  });

  describe('Hunt Lifecycle Scenario 2: Phase Transitions', () => {
    test('should notify phase transition from Discovery to Analysis', async () => {
      global.fetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => ({
          ok: true,
          ts: '1234567890.123457'
        })
      });

      const hunt = getTestHunt({ currentPhase: 'Analysis' });
      const result = await slackIntegration.notifyPhaseTransition(
        hunt,
        'Discovery',
        'Analysis'
      );

      expect(result).toBe('1234567890.123457');

      const payload = JSON.parse(global.fetch.mock.calls[0][1].body);
      const blockText = JSON.stringify(payload.blocks);

      expect(blockText).toContain('Analysis');
      expect(blockText).toContain('Test Feature');
    });

    test('should notify all phase transitions', async () => {
      const phases = [
        { from: 'Discovery', to: 'Analysis' },
        { from: 'Analysis', to: 'Implementation' },
        { from: 'Implementation', to: 'Testing' },
        { from: 'Testing', to: 'Completed' }
      ];

      for (let i = 0; i < phases.length; i++) {
        global.fetch.mockResolvedValueOnce({
          ok: true,
          status: 200,
          json: async () => ({
            ok: true,
            ts: `1234567890.${100000 + i}`
          })
        });

        const hunt = getTestHunt({ currentPhase: phases[i].to });
        await slackIntegration.notifyPhaseTransition(
          hunt,
          phases[i].from,
          phases[i].to
        );
      }

      expect(global.fetch).toHaveBeenCalledTimes(4);
    });

    test('should include GitHub link in phase notification if available', async () => {
      global.fetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => ({
          ok: true,
          ts: '1234567890.123458'
        })
      });

      const hunt = getTestHunt({ githubIssue: { number: 42 } });
      await slackIntegration.notifyPhaseTransition(
        hunt,
        'Discovery',
        'Analysis'
      );

      const payload = JSON.parse(global.fetch.mock.calls[0][1].body);
      const blockText = JSON.stringify(payload.blocks);

      expect(blockText).toContain('GitHub');
      expect(blockText).toContain('42');
    });
  });

  describe('Hunt Lifecycle Scenario 3: Hunt Completion', () => {
    test('should notify hunt completion', async () => {
      global.fetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => ({
          ok: true,
          ts: '1234567890.123459'
        })
      });

      const hunt = getTestHunt({ currentPhase: 'Completed' });
      const result = await slackIntegration.notifyHuntCompleted(hunt, {
        duration: 120,
        completionRate: 100
      });

      expect(result).toBe('1234567890.123459');

      const payload = JSON.parse(global.fetch.mock.calls[0][1].body);
      const blockText = JSON.stringify(payload.blocks);

      expect(blockText).toContain('✅');
      expect(blockText).toContain('Completed');
      expect(blockText).toContain('100%');
    });

    test('should include completion metrics', async () => {
      global.fetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => ({
          ok: true,
          ts: '1234567890.123459'
        })
      });

      const hunt = getTestHunt();
      const metrics = {
        duration: 120,
        completionRate: 100,
        phasesCompleted: 5,
        qualityScore: 95
      };

      await slackIntegration.notifyHuntCompleted(hunt, metrics);

      const payload = JSON.parse(global.fetch.mock.calls[0][1].body);
      const blockText = JSON.stringify(payload.blocks);

      expect(blockText).toContain('120');
      expect(blockText).toContain('5');
      expect(blockText).toContain('95');
    });

    test('should show success color for completion', async () => {
      global.fetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => ({
          ok: true,
          ts: '1234567890.123459'
        })
      });

      const hunt = getTestHunt();
      await slackIntegration.notifyHuntCompleted(hunt);

      const payload = JSON.parse(global.fetch.mock.calls[0][1].body);
      expect(payload.text).toContain('✅');
    });
  });

  describe('Hunt Lifecycle Scenario 4: Error Handling', () => {
    test('should handle API errors gracefully', async () => {
      global.fetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
        json: async () => ({
          ok: false,
          error: 'internal_error'
        })
      });

      const hunt = getTestHunt();

      await expect(
        slackIntegration.notifyHuntCreated(hunt)
      ).rejects.toThrow('Failed to send hunt created notification');
    });

    test('should handle missing channel gracefully', async () => {
      const invalidIntegration = new SlackIntegration(slackAuth, null);

      global.fetch.mockResolvedValueOnce({
        ok: false,
        status: 400
      });

      const hunt = getTestHunt();

      await expect(
        invalidIntegration.notifyHuntCreated(hunt)
      ).rejects.toThrow();
    });

    test('should send error notification', async () => {
      global.fetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => ({
          ok: true,
          ts: '1234567890.123460'
        })
      });

      const result = await slackIntegration.notifyError(
        'Hunt Error',
        'Failed to create GitHub issue',
        { code: 'GH_401', timestamp: new Date().toISOString() }
      );

      expect(result).toBe('1234567890.123460');

      const payload = JSON.parse(global.fetch.mock.calls[0][1].body);
      const blockText = JSON.stringify(payload.blocks);

      expect(blockText).toContain('GH_401');
    });
  });

  describe('Hunt Lifecycle Scenario 5: Daily Summary', () => {
    test('should send daily summary with active hunts', async () => {
      global.fetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => ({
          ok: true,
          ts: '1234567890.123461'
        })
      });

      const hunts = [
        getTestHunt({ title: 'Feature A', currentPhase: 'Analysis' }),
        getTestHunt({ title: 'Feature B', currentPhase: 'Implementation' }),
        getTestHunt({ title: 'Feature C', currentPhase: 'Testing' })
      ];

      const result = await slackIntegration.sendDailySummary(hunts, {
        completedToday: 2,
        avgDuration: 125,
        successRate: 94
      });

      expect(result).toBe('1234567890.123461');

      const payload = JSON.parse(global.fetch.mock.calls[0][1].body);
      const blockText = JSON.stringify(payload.blocks);

      expect(blockText).toContain('Feature A');
      expect(blockText).toContain('Feature B');
      expect(blockText).toContain('Feature C');
      expect(blockText).toContain('2'); // completedToday
      expect(blockText).toContain('94'); // successRate
    });

    test('should handle summary with no hunts', async () => {
      global.fetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => ({
          ok: true,
          ts: '1234567890.123462'
        })
      });

      const result = await slackIntegration.sendDailySummary([], {
        completedToday: 0,
        avgDuration: 0,
        successRate: 0
      });

      expect(result).toBe('1234567890.123462');

      const payload = JSON.parse(global.fetch.mock.calls[0][1].body);
      const blockText = JSON.stringify(payload.blocks);

      expect(blockText).toContain('0'); // No active hunts
    });
  });
});

describe('Slack Integration - Rate Limiting', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should handle multiple concurrent notifications', async () => {
    const mockToken = 'xoxb-test-token';
    const slackAuth = new SlackAuth(mockToken);
    const integration = new SlackIntegration(slackAuth, 'C1234567890');

    // Mock multiple successful notifications
    for (let i = 0; i < 5; i++) {
      global.fetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        headers: new Map(),
        json: async () => ({
          ok: true,
          ts: `1234567890.${100000 + i}`
        })
      });
    }

    const hunt = getTestHunt();

    // Send 5 notifications concurrently
    const results = await Promise.all([
      integration.notifyHuntCreated(hunt),
      integration.notifyHuntCreated(hunt),
      integration.notifyHuntCreated(hunt),
      integration.notifyHuntCreated(hunt),
      integration.notifyHuntCreated(hunt)
    ]);

    expect(results).toHaveLength(5);
    expect(results.every(r => r)).toBe(true); // All should succeed
    expect(global.fetch).toHaveBeenCalledTimes(5);
  });

  test('should respect rate limits by tracking remaining calls', async () => {
    const mockToken = 'xoxb-test-token';
    const slackAuth = new SlackAuth(mockToken);

    slackAuth.rateLimit = { remaining: 600, limit: 600, reset: 1234567890 };
    expect(slackAuth.isNearRateLimit()).toBe(false);

    // Simulate heavy usage
    slackAuth.rateLimit = { remaining: 150, limit: 600, reset: 1234567890 };
    expect(slackAuth.isNearRateLimit()).toBe(true);

    // Simulate reset
    slackAuth.rateLimit = { remaining: 600, limit: 600, reset: 1234567890 };
    expect(slackAuth.isNearRateLimit()).toBe(false);
  });
});

describe('Slack Integration - Token Management', () => {
  const tokenPath = path.join('.lionpack', 'slack-token');

  afterEach(() => {
    if (fs.existsSync(tokenPath)) {
      fs.unlinkSync(tokenPath);
    }
  });

  test('should save and load token', () => {
    const token = 'xoxb-test-token-123';

    SlackAuth.saveToken(token);
    expect(SlackAuth.hasToken()).toBe(true);

    const loaded = SlackAuth.loadToken();
    expect(loaded).toBe(token);
  });

  test('should delete token', () => {
    SlackAuth.saveToken('xoxb-test-token');
    expect(SlackAuth.hasToken()).toBe(true);

    SlackAuth.deleteToken();
    expect(SlackAuth.hasToken()).toBe(false);
  });
});

describe('Slack Integration - Block Kit', () => {
  test('should create formatted messages with Block Kit', () => {
    const blocks = SlackIntegration.createMessage(
      'Test Title',
      {
        'Status': 'Active',
        'Duration': '2 hours',
        'Progress': '75%'
      },
      '#2196F3'
    );

    expect(blocks).toHaveLength(2);
    expect(blocks[0].type).toBe('header');
    expect(blocks[1].type).toBe('section');
    expect(blocks[1].fields).toHaveLength(3);
  });

  test('should create action buttons', () => {
    const actions = SlackIntegration.createActions([
      { label: 'Approve', value: 'approve' },
      { label: 'Reject', value: 'reject' },
      { label: 'Review', value: 'review' }
    ]);

    expect(actions.type).toBe('actions');
    expect(actions.elements).toHaveLength(3);
    expect(actions.elements[0].text.text).toBe('Approve');
  });
});
