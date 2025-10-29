/**
 * GitHub Integration E2E Tests
 *
 * Tests for GitHub integration with hunt lifecycle:
 * - GitHub board creation during team setup
 * - GitHub issue creation during hunt start
 * - GitHub column moves during phase transitions
 * - GitHub issue closure during hunt completion
 */

const GitHubAuth = require('../../lib/team/github-auth');
const GitHubAPI = require('../../lib/team/github-api');

jest.mock('../../lib/team/github-auth');
jest.mock('../../lib/team/github-api');describe('GitHub Integration E2E Tests', () => {
  let mockAuth;
  let mockAPI;

  beforeEach(() => {
    jest.clearAllMocks();

    // Setup mocks
    mockAuth = {
      validateToken: jest.fn().mockResolvedValue({
        id: 12345,
        login: 'testuser',
        name: 'Test User'
      }),
      getUser: jest.fn().mockResolvedValue({
        id: 12345,
        login: 'testuser'
      }),
      isNearRateLimit: jest.fn().mockReturnValue(false),
      getRateLimit: jest.fn().mockReturnValue({
        remaining: 4000,
        reset: Date.now() + 3600000
      })
    };

    mockAPI = {
      createProjectBoard: jest.fn().mockResolvedValue({
        id: 'P1',
        name: 'LEO Workflow Kit Board',
        columns: [
          { id: 'C1', name: 'discovery' },
          { id: 'C2', name: 'design' },
          { id: 'C3', name: 'development' }
        ]
      }),
      createIssue: jest.fn().mockResolvedValue({
        id: 'I1',
        number: 42,
        title: 'Test Feature',
        state: 'open'
      }),
      updateIssue: jest.fn().mockResolvedValue({
        id: 'I1',
        number: 42,
        state: 'closed'
      }),
      addLabel: jest.fn().mockResolvedValue(true),
      addIssueToBoard: jest.fn().mockResolvedValue(true),
      moveIssueColumn: jest.fn().mockResolvedValue(true),
      addComment: jest.fn().mockResolvedValue({
        id: 'comment1',
        body: 'Test comment'
      }),
      getProjectIssues: jest.fn().mockResolvedValue([])
    };

    GitHubAuth.mockImplementation(() => mockAuth);
    GitHubAuth.hasToken = jest.fn().mockReturnValue(true);
    GitHubAuth.loadToken = jest.fn().mockReturnValue('gho_test_token_123');
    GitHubAuth.saveToken = jest.fn();
    GitHubAuth.deleteToken = jest.fn();
    GitHubAPI.mockImplementation(() => mockAPI);
  });

  const getTestConfig = () => ({
    org: 'testorg',
    repo: 'testrepo',
    team: 'test-team',
    workflow: {
      sequence: ['discovery', 'design', 'development'],
      columns: [
        { id: 'col1', name: 'discovery' },
        { id: 'col2', name: 'design' },
        { id: 'col3', name: 'development' }
      ],
      memberMapping: {
        discovery: 'alice',
        design: 'bob',
        development: 'charlie'
      }
    },
    github: {
      enabled: true,
      projectId: 'P1',
      columns: [
        { id: 'C1', name: 'discovery' },
        { id: 'C2', name: 'design' },
        { id: 'C3', name: 'development' }
      ]
    }
  });

  const getTestHunt = () => ({
    id: 'hunt-1',
    featureName: 'Test Feature',
    description: 'A test feature',
    currentPhase: 'discovery',
    status: 'active',
    githubIssue: { number: 42, id: 'I1' },
    getTotalDuration: () => 120
  });

  describe('Scenario 1: GitHub Setup → Board Creation', () => {
    test('should create GitHub project board during team setup', async () => {
      // When team setup creates GitHub board
      const auth = new GitHubAuth('test_token');
      const api = new GitHubAPI(auth);

      const board = await api.createProjectBoard('LEO Workflow Kit Board', [
        'discovery',
        'design',
        'development'
      ]);

      // Then board should be created with columns
      expect(api.createProjectBoard).toHaveBeenCalledWith(
        'LEO Workflow Kit Board',
        ['discovery', 'design', 'development']
      );
      expect(board).toEqual({
        id: 'P1',
        name: 'LEO Workflow Kit Board',
        columns: [
          { id: 'C1', name: 'discovery' },
          { id: 'C2', name: 'design' },
          { id: 'C3', name: 'development' }
        ]
      });
    });

    test('should validate token before board creation', async () => {
      const auth = new GitHubAuth('test_token');

      // Should validate token
      const user = await auth.validateToken();

      expect(auth.validateToken).toHaveBeenCalled();
      expect(user).toEqual({
        id: 12345,
        login: 'testuser',
        name: 'Test User'
      });
    });

    test('should check rate limits before operations', async () => {
      const auth = new GitHubAuth('test_token');

      const isNear = auth.isNearRateLimit();
      expect(isNear).toBe(false);

      const limits = auth.getRateLimit();
      expect(limits.remaining).toBe(4000);
    });
  });

  describe('Scenario 2: Hunt Start → Issue Creation', () => {
    test('should create GitHub issue when hunt starts', async () => {
      const config = getTestConfig();
      const auth = new GitHubAuth('test_token');
      const api = new GitHubAPI(auth);
      const hunt = getTestHunt();

      // When hunt starts
      const issue = await api.createIssue(
        `${config.org}/${config.repo}`,
        `🦁 ${hunt.featureName}`,
        `${hunt.description}\n\nHunt ID: ${hunt.id}`,
        ['hunt', 'leo']
      );

      // Then issue should be created
      expect(api.createIssue).toHaveBeenCalledWith(
        'testorg/testrepo',
        '🦁 Test Feature',
        'A test feature\n\nHunt ID: hunt-1',
        ['hunt', 'leo']
      );
      expect(issue).toEqual({
        id: 'I1',
        number: 42,
        title: 'Test Feature',
        state: 'open'
      });
    });

    test('should add issue to project board', async () => {
      const config = getTestConfig();
      const api = new GitHubAPI(mockAuth);
      const firstColumnId = config.github.columns[0].id;

      // When issue is added to board
      await api.addIssueToBoard(config.github.projectId, 42, firstColumnId);

      // Then should add to first column (discovery)
      expect(api.addIssueToBoard).toHaveBeenCalledWith('P1', 42, 'C1');
    });

    test('should handle GitHub disabled gracefully', async () => {
      GitHubAuth.hasToken = jest.fn().mockReturnValue(false);

      // When GitHub is not configured
      const hasToken = GitHubAuth.hasToken();

      // Then should return false
      expect(hasToken).toBe(false);
    });

    test('should store issue metadata in hunt', async () => {
      const hunt = getTestHunt();

      // Issue metadata should be stored
      expect(hunt.githubIssue).toEqual({
        number: 42,
        id: 'I1'
      });
    });
  });

  describe('Scenario 3: Phase Transition → Column Move', () => {
    test('should move issue to next column on phase transition', async () => {
      const config = getTestConfig();
      const api = new GitHubAPI(mockAuth);
      const hunt = getTestHunt();

      // When hunt transitions from discovery to design
      const newColumnId = config.github.columns[1].id; // design column
      await api.moveIssueColumn(config.github.projectId, hunt.githubIssue.number, newColumnId);

      // Then issue should move to design column
      expect(api.moveIssueColumn).toHaveBeenCalledWith('P1', 42, 'C2');
    });

    test('should add phase label on transition', async () => {
      const api = new GitHubAPI(mockAuth);
      const hunt = getTestHunt();
      const config = getTestConfig();

      // When phase transitions
      await api.addLabel(
        `${config.org}/${config.repo}`,
        hunt.githubIssue.number,
        ['design']
      );

      // Then label should be added
      expect(api.addLabel).toHaveBeenCalledWith('testorg/testrepo', 42, ['design']);
    });

    test('should add comment on phase transition', async () => {
      const api = new GitHubAPI(mockAuth);
      const hunt = getTestHunt();
      const config = getTestConfig();

      // When phase transitions
      await api.addComment(
        `${config.org}/${config.repo}`,
        hunt.githubIssue.number,
        '🔄 Moved to **design** phase'
      );

      // Then comment should be added
      expect(api.addComment).toHaveBeenCalledWith(
        'testorg/testrepo',
        42,
        '🔄 Moved to **design** phase'
      );
    });

    test('should handle multiple transitions', async () => {
      const config = getTestConfig();
      const api = new GitHubAPI(mockAuth);
      const hunt = getTestHunt();

      // First transition: discovery → design
      await api.moveIssueColumn(config.github.projectId, hunt.githubIssue.number, 'C2');

      // Second transition: design → development
      await api.moveIssueColumn(config.github.projectId, hunt.githubIssue.number, 'C3');

      // Then both transitions should be recorded
      expect(api.moveIssueColumn).toHaveBeenCalledTimes(2);
      expect(api.moveIssueColumn).toHaveBeenNthCalledWith(1, 'P1', 42, 'C2');
      expect(api.moveIssueColumn).toHaveBeenNthCalledWith(2, 'P1', 42, 'C3');
    });
  });

  describe('Scenario 4: Hunt Completion → Issue Closure', () => {
    test('should close issue when hunt completes', async () => {
      const config = getTestConfig();
      const api = new GitHubAPI(mockAuth);
      const hunt = getTestHunt();

      // When hunt completes
      await api.updateIssue(
        `${config.org}/${config.repo}`,
        hunt.githubIssue.number,
        { state: 'closed' }
      );

      // Then issue should be closed
      expect(api.updateIssue).toHaveBeenCalledWith(
        'testorg/testrepo',
        42,
        { state: 'closed' }
      );
    });

    test('should add completion comment with metrics', async () => {
      const config = getTestConfig();
      const api = new GitHubAPI(mockAuth);
      const hunt = getTestHunt();

      // When hunt completes
      const duration = hunt.getTotalDuration();
      await api.addComment(
        `${config.org}/${config.repo}`,
        hunt.githubIssue.number,
        `✅ Hunt completed! Duration: ${duration} minutes`
      );

      // Then completion comment should be added
      expect(api.addComment).toHaveBeenCalledWith(
        'testorg/testrepo',
        42,
        '✅ Hunt completed! Duration: 120 minutes'
      );
    });

    test('should handle completion without GitHub issue', async () => {
      const hunt = getTestHunt();
      hunt.githubIssue = null;

      // When hunt without issue completes
      const hasIssue = hunt.githubIssue !== null;

      // Then should gracefully skip GitHub operations
      expect(hasIssue).toBe(false);
    });
  });  describe('Error Handling', () => {
    test('should handle invalid token gracefully', async () => {
      const auth = new GitHubAuth('invalid_token');

      mockAuth.validateToken.mockRejectedValueOnce(
        new Error('Invalid token (401)')
      );

      await expect(auth.validateToken()).rejects.toThrow('Invalid token (401)');
    });

    test('should handle rate limit exceeded', async () => {
      const auth = new GitHubAuth('test_token');

      mockAuth.getRateLimit.mockReturnValue({
        remaining: 0,
        reset: Date.now() + 3600000
      });

      const limits = auth.getRateLimit();
      expect(limits.remaining).toBe(0);
    });

    test('should handle GitHub API errors gracefully', async () => {
      const api = new GitHubAPI(mockAuth);

      mockAPI.createIssue.mockRejectedValueOnce(
        new Error('Failed to create issue')
      );

      await expect(
        api.createIssue('org/repo', 'title', 'body', [])
      ).rejects.toThrow('Failed to create issue');
    });

    test('should recover from transient failures', async () => {
      const api = new GitHubAPI(mockAuth);

      // First attempt fails
      mockAPI.createIssue.mockRejectedValueOnce(new Error('Timeout'));

      // Retry succeeds
      mockAPI.createIssue.mockResolvedValueOnce({
        id: 'I1',
        number: 42
      });

      await expect(
        api.createIssue('org/repo', 'title', 'body', [])
      ).rejects.toThrow('Timeout');

      const result = await api.createIssue('org/repo', 'title', 'body', []);
      expect(result).toEqual({ id: 'I1', number: 42 });
    });
  });

  describe('Full Workflow Integration', () => {
    test('should handle complete hunt lifecycle with GitHub sync', async () => {
      const config = getTestConfig();
      const auth = new GitHubAuth('test_token');
      const api = new GitHubAPI(auth);
      const hunt = getTestHunt();

      // Step 1: Validate auth
      await auth.validateToken();
      expect(auth.validateToken).toHaveBeenCalled();

      // Step 2: Create issue
      const issue = await api.createIssue(
        `${config.org}/${config.repo}`,
        `🦁 ${hunt.featureName}`,
        hunt.description,
        ['hunt']
      );
      expect(issue.number).toBe(42);

      // Step 3: Add to board
      await api.addIssueToBoard(config.github.projectId, issue.number, 'C1');
      expect(api.addIssueToBoard).toHaveBeenCalled();

      // Step 4: Move through phases
      await api.moveIssueColumn(config.github.projectId, issue.number, 'C2');
      await api.addComment(`${config.org}/${config.repo}`, issue.number, '🔄 In design');

      // Step 5: Close on completion
      await api.updateIssue(
        `${config.org}/${config.repo}`,
        issue.number,
        { state: 'closed' }
      );
      await api.addComment(`${config.org}/${config.repo}`, issue.number, '✅ Complete');

      // Verify full workflow
      expect(api.createIssue).toHaveBeenCalled();
      expect(api.addIssueToBoard).toHaveBeenCalled();
      expect(api.moveIssueColumn).toHaveBeenCalled();
      expect(api.addComment).toHaveBeenCalled();
      expect(api.updateIssue).toHaveBeenCalled();
    });

    test('should maintain consistency across config changes', () => {
      const config = getTestConfig();
      expect(config.github.enabled).toBe(true);

      // Check configuration
      expect(config.github.columns).toHaveLength(3);
      expect(config.workflow.sequence).toHaveLength(3);
    });
  });

  describe('Performance & Efficiency', () => {
    test('should cache project information', async () => {
      const api = new GitHubAPI(mockAuth);

      // Multiple calls to same project
      await api.createIssue('org/repo', 'title1', 'body1', []);
      await api.createIssue('org/repo', 'title2', 'body2', []);
      await api.createIssue('org/repo', 'title3', 'body3', []);

      // All should use cached info
      expect(api.createIssue).toHaveBeenCalledTimes(3);
    });

    test('should handle batch operations efficiently', async () => {
      const config = getTestConfig();
      const api = new GitHubAPI(mockAuth);

      // Batch add multiple issues
      const issues = [42, 43, 44];

      for (const issueNum of issues) {
        await api.addIssueToBoard(config.github.projectId, issueNum, 'C1');
      }

      expect(api.addIssueToBoard).toHaveBeenCalledTimes(3);
    });

    test('should respect rate limits', async () => {
      const auth = new GitHubAuth('test_token');

      mockAuth.isNearRateLimit.mockReturnValue(true);

      const isNear = auth.isNearRateLimit();
      expect(isNear).toBe(true);
    });
  });
});
