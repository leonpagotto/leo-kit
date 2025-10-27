/**
 * Phase 2: SpecManager Tests (GitHub Issue-Based Specs)
 * Tests for lib/spec/index.js - GitHub-native specification creation
 */

const SpecManager = require('../../lib/spec');
const { execSync } = require('child_process');

// Mock child_process execSync
jest.mock('child_process');

describe('SpecManager - GitHub Issue Specs', () => {
  let manager;

  beforeEach(() => {
    manager = new SpecManager();
    jest.clearAllMocks();
  });

  describe('Auto-Population (Non-Interactive Mode)', () => {
    test('should create spec with auto-populated sections', async () => {
      const mockIssueUrl = 'https://github.com/test/repo/issues/42';
      execSync.mockReturnValue(mockIssueUrl);

      const result = await manager.create('Add user authentication', {
        interactive: false,
        autoPopulate: true
      });

      expect(result).toBeDefined();
      expect(result.url).toBe(mockIssueUrl);
      expect(result.number).toBe(42);
    });

    test('should extract context from description', () => {
      const context = manager._extractContext('Add user authentication');

      expect(context).toContain('user authentication');
      expect(context).toContain('improve the system');
    });

    test('should generate requirements from description', () => {
      const requirements = manager._extractRequirements('Add user authentication');

      expect(requirements).toContain('Add user authentication');
      expect(requirements).toContain('Error handling');
      expect(requirements).toContain('Tests added');
      expect(requirements).toContain('Documentation updated');
    });

    test('should generate user stories from description', () => {
      const stories = manager._generateUserStories('Add user authentication');

      expect(stories).toContain('As a user');
      expect(stories).toContain('As a developer');
      expect(stories).toContain('user authentication');
    });

    test('should generate acceptance criteria', () => {
      const criteria = manager._generateAcceptanceCriteria('Add user authentication');

      expect(criteria).toContain('Given');
      expect(criteria).toContain('when');
      expect(criteria).toContain('then');
    });

    test('should detect architecture keywords', () => {
      expect(manager._hasArchitectureKeywords('Create API endpoint')).toBe(true);
      expect(manager._hasArchitectureKeywords('Setup database schema')).toBe(true);
      expect(manager._hasArchitectureKeywords('Build component')).toBe(true);
      expect(manager._hasArchitectureKeywords('Add button')).toBe(false);
    });

    test('should detect dependency keywords', () => {
      expect(manager._hasDependencyKeywords('Depends on authentication')).toBe(true);
      expect(manager._hasDependencyKeywords('Requires database setup')).toBe(true);
      expect(manager._hasDependencyKeywords('After migration complete')).toBe(true);
      expect(manager._hasDependencyKeywords('Add feature')).toBe(false);
    });
  });

  describe('Label Management', () => {
    test('should determine labels based on priority and type', () => {
      const labels = manager._determineLabels('high', 'bug');

      expect(labels).toContain('spec');
      expect(labels).toContain('needs-planning');
      expect(labels).toContain('priority: high');
      expect(labels).toContain('type: bug');
    });

    test('should handle default priority and type', () => {
      const labels = manager._determineLabels('medium', 'feature');

      expect(labels).toContain('priority: medium');
      expect(labels).toContain('type: feature');
    });

    test('should ensure labels exist before creating issue', async () => {
      execSync.mockReturnValue(''); // Label exists (no error)

      await manager._ensureLabelsExist(['spec', 'needs-planning']);

      // Should check for label existence
      expect(execSync).toHaveBeenCalled();
    });
  });

  describe('Issue Body Formatting', () => {
    test('should format spec content as Markdown', () => {
      const specContent = {
        title: 'Test Spec',
        sections: {
          'Context': 'Background information',
          'Requirements': '- [ ] Requirement 1\n- [ ] Requirement 2',
          'Acceptance Criteria': '- [ ] Criteria 1'
        }
      };

      const body = manager._formatIssueBody(specContent);

      expect(body).toContain('## Context');
      expect(body).toContain('Background information');
      expect(body).toContain('## Requirements');
      expect(body).toContain('- [ ] Requirement 1');
      expect(body).toContain('## Acceptance Criteria');
      expect(body).toContain('_This spec was created using `leo spec new`_');
    });

    test('should include footer with next steps', () => {
      const specContent = {
        sections: { 'Context': 'Test' }
      };

      const body = manager._formatIssueBody(specContent);

      expect(body).toContain('leo clarify');
      expect(body).toContain('leo plan');
    });
  });

  describe('GitHub Issue Creation', () => {
    test('should create GitHub issue via gh CLI', async () => {
      const mockUrl = 'https://github.com/test/repo/issues/99';
      execSync.mockReturnValue(mockUrl);

      const result = await manager._createGitHubIssue(
        'Test Issue',
        'Body content',
        ['spec', 'test']
      );

      expect(result.number).toBe(99);
      expect(result.url).toBe(mockUrl);
      expect(execSync).toHaveBeenCalledWith(
        expect.stringContaining('gh issue create'),
        expect.any(Object)
      );
    });

    test('should handle gh CLI errors gracefully', async () => {
      execSync.mockImplementation(() => {
        throw new Error('gh: command not found');
      });

      await expect(
        manager._createGitHubIssue('Test', 'Body', ['spec'])
      ).rejects.toThrow();
    });
  });

  describe('Constitutional Validation', () => {
    test('should skip validation if no config', async () => {
      const specContent = {
        sections: {
          'Requirements': 'Test requirements'
        }
      };

      // Should not throw
      await expect(
        manager._validateAgainstPrinciples(specContent)
      ).resolves.not.toThrow();
    });

    test('should validate against TDD principle', async () => {
      const specContent = {
        sections: {
          'Requirements': '- [ ] Add tests\n- [ ] Implement feature'
        }
      };

      // Mock config file
      const fs = require('fs').promises;
      jest.spyOn(fs, 'access').mockResolvedValue();
      jest.spyOn(fs, 'readFile').mockResolvedValue(JSON.stringify({
        constitution: {
          principles: [
            { name: 'Test-First Development', enabled: true }
          ]
        }
      }));

      await manager._validateAgainstPrinciples(specContent);

      expect(fs.readFile).toHaveBeenCalled();
    });
  });

  describe('List and Show Operations', () => {
    test('should list spec issues', async () => {
      const mockIssues = JSON.stringify([
        {
          number: 42,
          title: 'Test Spec',
          state: 'OPEN',
          labels: [{ name: 'spec' }, { name: 'priority: high' }],
          url: 'https://github.com/test/repo/issues/42'
        }
      ]);

      execSync.mockReturnValue(mockIssues);

      const result = await manager.list({ status: 'all', limit: 10 });

      expect(result).toHaveLength(1);
      expect(result[0].number).toBe(42);
      expect(result[0].title).toBe('Test Spec');
    });

    test('should show specific spec issue', async () => {
      const mockIssue = JSON.stringify({
        number: 42,
        title: 'Test Spec',
        body: 'Spec body content',
        state: 'OPEN',
        labels: [{ name: 'spec' }],
        url: 'https://github.com/test/repo/issues/42',
        createdAt: '2025-10-27T00:00:00Z',
        updatedAt: '2025-10-27T12:00:00Z'
      });

      execSync.mockReturnValue(mockIssue);

      const result = await manager.show(42);

      expect(result.number).toBe(42);
      expect(result.title).toBe('Test Spec');
      expect(result.body).toBe('Spec body content');
    });

    test('should handle empty issue list', async () => {
      execSync.mockReturnValue('[]');

      const result = await manager.list();

      expect(result).toHaveLength(0);
    });
  });

  describe('Default Spec Content', () => {
    test('should generate default content when auto-populate disabled', () => {
      const content = manager._defaultSpecContent('Add feature X');

      expect(content.title).toBe('Add feature X');
      expect(content.sections['Context']).toContain('add feature x');
      expect(content.sections['Requirements']).toContain('To be defined');
      expect(content.sections['Acceptance Criteria']).toContain('Feature works');
    });
  });

  describe('Technical Approach and Dependencies', () => {
    test('should extract technical approach placeholder', () => {
      const approach = manager._extractTechnicalApproach('Build API');

      expect(approach).toContain('Technical approach will be determined');
      expect(approach).toContain('Architecture pattern');
      expect(approach).toContain('Tech stack');
    });

    test('should extract dependencies placeholder', () => {
      const deps = manager._extractDependencies('Requires auth');

      expect(deps).toContain('Dependencies will be identified');
      expect(deps).toContain('blocking issues');
      expect(deps).toContain('external dependencies');
    });
  });
});
