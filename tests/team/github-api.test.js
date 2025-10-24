/**
 * GitHub API Tests
 *
 * Unit tests for GitHubAPI class
 * Tests project creation, issue management, and board operations
 *
 * @module tests/team/github-api.test.js
 */

const GitHubAPI = require('../../lib/team/github-api');
const GitHubAuth = require('../../lib/team/github-auth');

describe('GitHubAPI', () => {
  let api;
  let auth;
  const mockToken = 'ghp_1234567890abcdefghijklmnopqrstu';

  beforeEach(() => {
    auth = new GitHubAuth(mockToken);
    api = new GitHubAPI(auth);
  });

  describe('constructor', () => {
    test('should initialize with valid auth', () => {
      expect(api.auth).toBe(auth);
      expect(api.projectCache).toBeDefined();
    });

    test('should throw error with invalid auth', () => {
      expect(() => {
        new GitHubAPI(null);
      }).toThrow('Invalid GitHubAuth instance provided');

      expect(() => {
        new GitHubAPI({});
      }).toThrow('Invalid GitHubAuth instance provided');
    });
  });

  describe('createProjectBoard', () => {
    test('should create project board with columns', async () => {
      const columnNames = ['Requirements', 'Design', 'In Progress', 'Testing', 'Complete'];

      const project = await api.createProjectBoard('test-hunts', columnNames);

      expect(project).toBeDefined();
      expect(project.id).toBeDefined();
      expect(project.name).toBe('test-hunts');
      expect(project.columns.length).toBe(5);
      expect(project.columns[0].name).toBe('Requirements');
    });

    test('should cache created project', async () => {
      const project = await api.createProjectBoard('test', ['Col1', 'Col2']);

      expect(api.projectCache.get(project.id)).toEqual(project);
    });

    test('should throw error for invalid project name', async () => {
      await expect(
        api.createProjectBoard('', ['Col1'])
      ).rejects.toThrow('Project name must be a non-empty string');

      await expect(
        api.createProjectBoard(null, ['Col1'])
      ).rejects.toThrow('Project name must be a non-empty string');
    });

    test('should throw error for invalid columns', async () => {
      await expect(
        api.createProjectBoard('test', [])
      ).rejects.toThrow('Column names must be a non-empty array');

      await expect(
        api.createProjectBoard('test', null)
      ).rejects.toThrow('Column names must be a non-empty array');
    });

    test('should set owner from authenticated user', async () => {
      await api.createProjectBoard('test', ['Col1']);

      expect(api.owner).toBe('test-user');
    });

    test('should include owner in project URL', async () => {
      const project = await api.createProjectBoard('test', ['Col1']);

      expect(project.url).toContain('test-user');
    });
  });

  describe('addColumn', () => {
    test('should add column to project', async () => {
      const project = await api.createProjectBoard('test', ['Col1']);
      const newColumn = await api.addColumn(project.id, 'Col2');

      expect(newColumn).toBeDefined();
      expect(newColumn.name).toBe('Col2');
      expect(newColumn.projectId).toBe(project.id);
    });

    test('should update project cache', async () => {
      const project = await api.createProjectBoard('test', ['Col1']);
      const initialLength = project.columns.length;

      await api.addColumn(project.id, 'Col2');

      const updated = api.projectCache.get(project.id);
      expect(updated.columns.length).toBe(initialLength + 1);
    });

    test('should throw error if project not found', async () => {
      await expect(
        api.addColumn('NONEXISTENT', 'Col1')
      ).rejects.toThrow('Project NONEXISTENT not found');
    });

    test('should throw error for missing parameters', async () => {
      await expect(
        api.addColumn('', 'Col1')
      ).rejects.toThrow('Project ID and column name are required');

      await expect(
        api.addColumn('PVT_123', '')
      ).rejects.toThrow('Project ID and column name are required');
    });
  });

  describe('createIssue', () => {
    test('should create issue', async () => {
      const issue = await api.createIssue(
        'leonpagotto/leo-kit',
        'Build Dashboard',
        'Create dashboard UI'
      );

      expect(issue).toBeDefined();
      expect(issue.number).toBeDefined();
      expect(issue.title).toBe('Build Dashboard');
      expect(issue.body).toBe('Create dashboard UI');
      expect(issue.state).toBe('open');
    });

    test('should include repository in URL', async () => {
      const issue = await api.createIssue(
        'leonpagotto/leo-kit',
        'Test',
        'Test issue'
      );

      expect(issue.url).toContain('leonpagotto/leo-kit');
    });

    test('should add labels to issue', async () => {
      const issue = await api.createIssue(
        'leonpagotto/leo-kit',
        'Test',
        'Test',
        ['bug', 'urgent']
      );

      expect(issue.labels).toEqual(['bug', 'urgent']);
    });

    test('should set created_at timestamp', async () => {
      const before = new Date();
      const issue = await api.createIssue(
        'leonpagotto/leo-kit',
        'Test',
        'Test'
      );
      const after = new Date();

      const createdAt = new Date(issue.created_at);
      expect(createdAt.getTime()).toBeGreaterThanOrEqual(before.getTime());
      expect(createdAt.getTime()).toBeLessThanOrEqual(after.getTime());
    });

    test('should throw error for missing parameters', async () => {
      await expect(
        api.createIssue('', 'Title', 'Body')
      ).rejects.toThrow('Repository and title are required');

      await expect(
        api.createIssue('repo/name', '', 'Body')
      ).rejects.toThrow('Repository and title are required');
    });
  });

  describe('updateIssue', () => {
    test('should update issue', async () => {
      const updated = await api.updateIssue('leonpagotto/leo-kit', 42, {
        state: 'closed',
        labels: ['complete'],
      });

      expect(updated.number).toBe(42);
      expect(updated.state).toBe('closed');
      expect(updated.labels).toContain('complete');
    });

    test('should update only specified fields', async () => {
      const updated = await api.updateIssue('leonpagotto/leo-kit', 42, {
        title: 'Updated Title',
      });

      expect(updated.title).toBe('Updated Title');
    });

    test('should set updated_at timestamp', async () => {
      const updated = await api.updateIssue('leonpagotto/leo-kit', 42, {});

      expect(updated.updated_at).toBeDefined();
    });

    test('should throw error for missing parameters', async () => {
      await expect(
        api.updateIssue('', 42, {})
      ).rejects.toThrow('Repository and issue number are required');

      await expect(
        api.updateIssue('repo/name', null, {})
      ).rejects.toThrow('Repository and issue number are required');
    });
  });

  describe('addLabel', () => {
    test('should add labels to issue', async () => {
      const labels = await api.addLabel('leonpagotto/leo-kit', 42, [
        'bug',
        'urgent',
      ]);

      expect(labels.length).toBe(2);
      expect(labels[0].name).toBe('bug');
      expect(labels[1].name).toBe('urgent');
    });

    test('should throw error for empty labels', async () => {
      await expect(
        api.addLabel('leonpagotto/leo-kit', 42, [])
      ).rejects.toThrow('Labels must be a non-empty array');

      await expect(
        api.addLabel('leonpagotto/leo-kit', 42, null)
      ).rejects.toThrow('Labels must be a non-empty array');
    });

    test('should throw error for missing parameters', async () => {
      await expect(
        api.addLabel('', 42, ['label'])
      ).rejects.toThrow('Repository and issue number are required');
    });
  });

  describe('addIssueToBoard', () => {
    test('should add issue to board', async () => {
      const card = await api.addIssueToBoard('PVT_123', 42, 'PVTF_col1');

      expect(card).toBeDefined();
      expect(card.projectId).toBe('PVT_123');
      expect(card.issueNumber).toBe(42);
      expect(card.columnId).toBe('PVTF_col1');
    });

    test('should set created_at timestamp', async () => {
      const card = await api.addIssueToBoard('PVT_123', 42, 'PVTF_col1');

      expect(card.created_at).toBeDefined();
    });

    test('should throw error for missing parameters', async () => {
      await expect(
        api.addIssueToBoard('', 42, 'PVTF_col1')
      ).rejects.toThrow('Project ID, issue number, and column ID are required');

      await expect(
        api.addIssueToBoard('PVT_123', '', 'PVTF_col1')
      ).rejects.toThrow('Project ID, issue number, and column ID are required');
    });
  });

  describe('moveIssueColumn', () => {
    test('should move issue to column', async () => {
      const card = await api.moveIssueColumn('PVT_123', 42, 'PVTF_col2');

      expect(card.projectId).toBe('PVT_123');
      expect(card.issueNumber).toBe(42);
      expect(card.columnId).toBe('PVTF_col2');
    });

    test('should set moved_at timestamp', async () => {
      const card = await api.moveIssueColumn('PVT_123', 42, 'PVTF_col2');

      expect(card.moved_at).toBeDefined();
    });

    test('should throw error for missing parameters', async () => {
      await expect(
        api.moveIssueColumn('', 42, 'PVTF_col2')
      ).rejects.toThrow('Project ID, issue number, and target column are required');
    });
  });

  describe('addComment', () => {
    test('should add comment to issue', async () => {
      const comment = await api.addComment(
        'leonpagotto/leo-kit',
        42,
        'Great work!'
      );

      expect(comment).toBeDefined();
      expect(comment.body).toBe('Great work!');
      expect(comment.author).toBe('test-user');
    });

    test('should set created_at timestamp', async () => {
      const comment = await api.addComment(
        'leonpagotto/leo-kit',
        42,
        'Test'
      );

      expect(comment.created_at).toBeDefined();
    });

    test('should throw error for missing parameters', async () => {
      await expect(
        api.addComment('', 42, 'comment')
      ).rejects.toThrow('Repository, issue number, and comment are required');

      await expect(
        api.addComment('repo/name', '', 'comment')
      ).rejects.toThrow('Repository, issue number, and comment are required');
    });
  });

  describe('getProject', () => {
    test('should get cached project', async () => {
      const created = await api.createProjectBoard('test', ['Col1']);
      const retrieved = await api.getProject(created.id);

      expect(retrieved).toBeDefined();
      expect(retrieved.name).toBe('test');
    });

    test('should return copy of project', async () => {
      const created = await api.createProjectBoard('test', ['Col1']);
      const retrieved = await api.getProject(created.id);

      expect(retrieved).not.toBe(created);
      expect(retrieved).toEqual(created);
    });

    test('should throw error if project not found', async () => {
      await expect(
        api.getProject('NONEXISTENT')
      ).rejects.toThrow('Project NONEXISTENT not found');
    });
  });

  describe('getIssue', () => {
    test('should get issue details', async () => {
      const issue = await api.getIssue('leonpagotto/leo-kit', 42);

      expect(issue).toBeDefined();
      expect(issue.number).toBe(42);
      expect(issue.repository).toBe('leonpagotto/leo-kit');
    });

    test('should throw error for missing parameters', async () => {
      await expect(
        api.getIssue('', 42)
      ).rejects.toThrow('Repository and issue number are required');
    });
  });

  describe('getBoardColumns', () => {
    test('should get board columns', async () => {
      const project = await api.createProjectBoard('test', [
        'Col1',
        'Col2',
        'Col3',
      ]);
      const columns = await api.getBoardColumns(project.id);

      expect(columns.length).toBe(3);
      expect(columns[0].name).toBe('Col1');
    });

    test('should return array copy', async () => {
      const project = await api.createProjectBoard('test', ['Col1']);
      const columns1 = await api.getBoardColumns(project.id);
      const columns2 = await api.getBoardColumns(project.id);

      expect(columns1).not.toBe(columns2);
      expect(columns1).toEqual(columns2);
    });

    test('should throw error if project not found', async () => {
      await expect(
        api.getBoardColumns('NONEXISTENT')
      ).rejects.toThrow('Project NONEXISTENT not found');
    });
  });

  describe('getProjectIssues', () => {
    test('should get project issues', async () => {
      const issues = await api.getProjectIssues('leonpagotto/leo-kit');

      expect(Array.isArray(issues)).toBe(true);
    });

    test('should throw error if repository missing', async () => {
      await expect(
        api.getProjectIssues('')
      ).rejects.toThrow('Repository is required');
    });
  });

  describe('getRateLimit', () => {
    test('should return rate limit from auth', () => {
      const limit = api.getRateLimit();

      expect(limit).toBeDefined();
      expect(limit.remaining).toBe(5000);
    });
  });

  describe('isNearRateLimit', () => {
    test('should check rate limit status', async () => {
      api.auth.rateLimit.remaining = 50;

      expect(api.isNearRateLimit()).toBe(true);
    });
  });
});
