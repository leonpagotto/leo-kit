/**
 * Phase 2: TaskManager Tests (Dual-Mode Task Management)
 * Tests for lib/tasks/index.js - Checklist vs Child Issues modes
 */

const TaskManager = require('../../lib/tasks');
const { execSync } = require('child_process');

jest.mock('child_process');

describe('TaskManager - Dual-Mode Task Management', () => {
  let manager;

  beforeEach(() => {
    manager = new TaskManager();
    jest.clearAllMocks();
  });

  describe('Checklist Mode (Default)', () => {
    test('should create task checklist in spec body', async () => {
      const mockSpec = {
        number: 42,
        title: 'Test Spec',
        body: '## Plan\n\n1. Task A\n2. Task B\n3. Task C'
      };

      execSync
        .mockReturnValueOnce(JSON.stringify(mockSpec)) // spec fetch
        .mockReturnValueOnce('') // label check
        .mockReturnValueOnce('Updated #42'); // issue update

      await manager.create(42, { createIssues: false });

      // Should update issue body with checklist
      const updateCall = execSync.mock.calls.find(call =>
        call[0].includes('gh issue edit')
      );
      expect(updateCall).toBeDefined();
    });

    test('should extract tasks from plan section', () => {
      const specBody = `
## Plan

1. Set up project structure
2. Configure database
3. Add API endpoints
4. Write tests
      `;

      const tasks = manager._extractTasksFromPlan(specBody);

      expect(tasks).toHaveLength(4);
      expect(tasks[0]).toContain('Set up project structure');
      expect(tasks[3]).toContain('Write tests');
    });

    test('should convert tasks to checklist format', () => {
      const tasks = [
        'Task 1',
        'Task 2',
        'Task 3'
      ];

      const checklist = manager._formatAsChecklist(tasks);

      expect(checklist).toContain('- [ ] Task 1');
      expect(checklist).toContain('- [ ] Task 2');
      expect(checklist).toContain('- [ ] Task 3');
    });
  });

  describe('Child Issues Mode', () => {
    test('should create separate GitHub issues for each task', async () => {
      const mockSpec = {
        number: 42,
        title: 'Test Spec',
        body: '## Plan\n\n1. Task A\n2. Task B'
      };

      execSync
        .mockReturnValueOnce(JSON.stringify(mockSpec)) // spec fetch
        .mockReturnValue('https://github.com/test/repo/issues/43'); // child issues

      const result = await manager.create(42, { createIssues: true });

      expect(result.childIssues).toBeDefined();

      // Should create issues via gh CLI
      const createCalls = execSync.mock.calls.filter(call =>
        call[0].includes('gh issue create')
      );
      expect(createCalls.length).toBeGreaterThan(0);
    });

    test('should link child issues to parent spec', async () => {
      const mockSpec = {
        number: 42,
        title: 'Parent Spec',
        body: '## Plan\n\n1. Task A'
      };

      execSync
        .mockReturnValueOnce(JSON.stringify(mockSpec))
        .mockReturnValue('https://github.com/test/repo/issues/43');

      await manager.create(42, { createIssues: true });

      // Child issue body should reference parent
      const createCall = execSync.mock.calls.find(call =>
        call[0].includes('gh issue create') && call[0].includes('Task A')
      );
      expect(createCall).toBeDefined();
    });

    test('should apply task and subtask labels', async () => {
      const mockSpec = {
        number: 42,
        body: '## Plan\n\n1. Task A'
      };

      execSync
        .mockReturnValueOnce(JSON.stringify(mockSpec))
        .mockReturnValue('https://github.com/test/repo/issues/43');

      await manager.create(42, { createIssues: true });

      // Should ensure labels exist
      const labelCheck = execSync.mock.calls.find(call =>
        call[0].includes('gh label')
      );
      expect(labelCheck).toBeDefined();
    });

    test('should group tasks by phase', async () => {
      const mockSpec = {
        number: 42,
        body: `
## Plan

### Phase 1: Setup
1. Task A
2. Task B

### Phase 2: Implementation
1. Task C
2. Task D
        `
      };

      execSync
        .mockReturnValueOnce(JSON.stringify(mockSpec))
        .mockReturnValue('https://github.com/test/repo/issues/43');

      await manager.create(42, { createIssues: true });

      // Should create issues for both phases
      const createCalls = execSync.mock.calls.filter(call =>
        call[0].includes('gh issue create')
      );
      expect(createCalls.length).toBeGreaterThan(2);
    });
  });

  describe('Task Status Tracking', () => {
    test('should count completed checklist items', async () => {
      const mockSpec = {
        number: 42,
        body: `
## Tasks
- [x] Completed task 1
- [ ] Incomplete task 2
- [x] Completed task 3
- [ ] Incomplete task 4
        `
      };

      execSync.mockReturnValue(JSON.stringify(mockSpec));

      const status = await manager.status(42);

      expect(status.completed).toBe(2);
      expect(status.total).toBe(4);
      expect(status.percentage).toBe(50);
    });

    test('should track child issue states', async () => {
      const mockSpec = {
        number: 42,
        body: 'Parent spec with child issues #43, #44, #45'
      };

      const mockChildIssues = [
        { number: 43, state: 'CLOSED' },
        { number: 44, state: 'OPEN' },
        { number: 45, state: 'OPEN' }
      ];

      execSync
        .mockReturnValueOnce(JSON.stringify(mockSpec)) // parent
        .mockReturnValueOnce(JSON.stringify(mockChildIssues[0])) // child 1
        .mockReturnValueOnce(JSON.stringify(mockChildIssues[1])) // child 2
        .mockReturnValueOnce(JSON.stringify(mockChildIssues[2])); // child 3

      const status = await manager.status(42);

      expect(status).toBeDefined();
      // Should parse child issue states
    });

    test('should handle spec with no tasks', async () => {
      const mockSpec = {
        number: 42,
        body: 'No tasks yet'
      };

      execSync.mockReturnValue(JSON.stringify(mockSpec));

      const status = await manager.status(42);

      expect(status.completed).toBe(0);
      expect(status.total).toBe(0);
      expect(status.percentage).toBe(0);
    });

    test('should calculate correct percentage', async () => {
      const mockSpec = {
        number: 42,
        body: `
- [x] Task 1
- [x] Task 2
- [x] Task 3
- [ ] Task 4
- [ ] Task 5
        `
      };

      execSync.mockReturnValue(JSON.stringify(mockSpec));

      const status = await manager.status(42);

      expect(status.percentage).toBe(60); // 3/5 = 60%
    });
  });

  describe('Label Management', () => {
    test('should create has-tasks label if missing', async () => {
      execSync
        .mockImplementationOnce(() => {
          throw new Error('Label not found');
        })
        .mockReturnValue(''); // label created

      await manager._ensureLabelsExist(['has-tasks']);

      const createCall = execSync.mock.calls.find(call =>
        call[0].includes('gh label create') && call[0].includes('has-tasks')
      );
      expect(createCall).toBeDefined();
    });

    test('should create task and subtask labels for child issues', async () => {
      execSync
        .mockImplementationOnce(() => { throw new Error(); })
        .mockImplementationOnce(() => { throw new Error(); })
        .mockReturnValue('');

      await manager._ensureLabelsExist(['task', 'subtask']);

      expect(execSync).toHaveBeenCalledWith(
        expect.stringContaining('task'),
        expect.any(Object)
      );
    });
  });

  describe('Error Handling', () => {
    test('should handle missing spec gracefully', async () => {
      execSync.mockImplementation(() => {
        throw new Error('Issue not found');
      });

      await expect(manager.create(999)).rejects.toThrow();
    });

    test('should handle gh CLI errors', async () => {
      execSync.mockImplementation(() => {
        throw new Error('gh command failed');
      });

      await expect(manager.create(42)).rejects.toThrow();
    });

    test('should handle malformed plan section', async () => {
      const mockSpec = {
        number: 42,
        body: '## Plan\n\nNo structured tasks here'
      };

      execSync.mockReturnValue(JSON.stringify(mockSpec));

      // Should handle gracefully (not crash)
      await expect(manager.create(42)).resolves.not.toThrow();
    });
  });

  describe('Plan Parsing', () => {
    test('should extract numbered list tasks', () => {
      const plan = `
## Plan

1. First task
2. Second task
3. Third task
      `;

      const tasks = manager._extractTasksFromPlan(plan);

      expect(tasks).toContain('First task');
      expect(tasks).toContain('Second task');
      expect(tasks).toContain('Third task');
    });

    test('should extract bullet list tasks', () => {
      const plan = `
## Plan

- Task A
- Task B
- Task C
      `;

      const tasks = manager._extractTasksFromPlan(plan);

      expect(tasks).toContain('Task A');
      expect(tasks).toContain('Task B');
    });

    test('should extract phased tasks', () => {
      const plan = `
## Plan

### Phase 1
1. Setup
2. Configure

### Phase 2
1. Implement
2. Test
      `;

      const tasks = manager._extractTasksFromPlan(plan);

      expect(tasks.length).toBeGreaterThan(2);
    });
  });
});
