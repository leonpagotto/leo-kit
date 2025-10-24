/**
 * Unit Tests for CostTracker
 * 
 * Tests budget enforcement, usage tracking, and cost calculation
 */

const CostTracker = require('../../lib/model-selection/cost-tracker');
const fs = require('fs-extra');
const path = require('path');

// Mock fs-extra to avoid file I/O
jest.mock('fs-extra');

describe('CostTracker', () => {
  let costTracker;
  const mockUsageData = {
    month: '2025-01',
    dailyUsage: {},
    monthlyUsage: {
      cost: 0,
      requests: 0,
      byAgent: {},
      byModel: {}
    },
    budgets: {
      daily: 5,
      monthly: 50,
      perAgent: 10
    }
  };

  beforeEach(() => {
    jest.clearAllMocks();
    
    // Mock file operations
    fs.pathExists.mockResolvedValue(true);
    fs.readJson.mockResolvedValue(mockUsageData);
    fs.writeJson.mockResolvedValue(true);
    fs.ensureDir.mockResolvedValue(true);

    costTracker = new CostTracker();
  });

  describe('Initialization', () => {
    test('should initialize with default budgets', () => {
      expect(costTracker.budgets).toEqual({
        daily: 5,
        monthly: 50,
        perAgent: 10
      });
    });

    test('should load custom budgets from config', () => {
      const customBudgets = {
        daily: 10,
        monthly: 100,
        perAgent: 20
      };
      
      const tracker = new CostTracker(customBudgets);
      expect(tracker.budgets).toEqual(customBudgets);
    });
  });

  describe('Budget Checking', () => {
    test('should allow task when under budget', async () => {
      const canAfford = await costTracker.canAfford('frontend', 'Simple task');
      expect(canAfford).toBe(true);
    });

    test('should deny task when daily budget exceeded', async () => {
      const today = new Date().toISOString().split('T')[0];
      const overBudgetData = {
        ...mockUsageData,
        dailyUsage: {
          [today]: {
            cost: 5.5,
            requests: 50,
            byAgent: { frontend: 5.5 }
          }
        }
      };

      fs.readJson.mockResolvedValue(overBudgetData);
      const tracker = new CostTracker();
      await tracker.loadUsage();

      const canAfford = await tracker.canAfford('frontend', 'Task');
      expect(canAfford).toBe(false);
    });

    test('should deny task when monthly budget exceeded', async () => {
      const overBudgetData = {
        ...mockUsageData,
        monthlyUsage: {
          cost: 51,
          requests: 100,
          byAgent: {},
          byModel: {}
        }
      };

      fs.readJson.mockResolvedValue(overBudgetData);
      const tracker = new CostTracker();
      await tracker.loadUsage();

      const canAfford = await tracker.canAfford('frontend', 'Task');
      expect(canAfford).toBe(false);
    });

    test('should deny task when per-agent budget exceeded', async () => {
      const overBudgetData = {
        ...mockUsageData,
        monthlyUsage: {
          cost: 20,
          requests: 50,
          byAgent: { frontend: 11 },
          byModel: {}
        }
      };

      fs.readJson.mockResolvedValue(overBudgetData);
      const tracker = new CostTracker();
      await tracker.loadUsage();

      const canAfford = await tracker.canAfford('frontend', 'Task');
      expect(canAfford).toBe(false);
    });
  });

  describe('Cost Calculation', () => {
    test('should calculate cost for GPT-4', () => {
      const usage = {
        inputTokens: 1000,
        outputTokens: 500
      };

      const cost = costTracker.calculateCost('gpt-4', usage);
      
      // GPT-4: $0.03 input + $0.06 output per 1K tokens
      // (1000 * 0.03 / 1000) + (500 * 0.06 / 1000) = 0.03 + 0.03 = 0.06
      expect(cost).toBeCloseTo(0.06, 4);
    });

    test('should calculate cost for GPT-3.5-turbo', () => {
      const usage = {
        inputTokens: 1000,
        outputTokens: 500
      };

      const cost = costTracker.calculateCost('gpt-3.5-turbo', usage);
      
      // GPT-3.5-turbo: $0.0005 input + $0.0015 output per 1K tokens
      // (1000 * 0.0005 / 1000) + (500 * 0.0015 / 1000) = 0.0005 + 0.00075 = 0.00125
      expect(cost).toBeCloseTo(0.00125, 5);
    });

    test('should calculate cost for Claude-3-opus', () => {
      const usage = {
        inputTokens: 1000,
        outputTokens: 500
      };

      const cost = costTracker.calculateCost('claude-3-opus', usage);
      
      // Claude-3-opus: $0.015 input + $0.075 output per 1K tokens
      expect(cost).toBeCloseTo(0.0525, 4);
    });

    test('should handle zero tokens', () => {
      const usage = {
        inputTokens: 0,
        outputTokens: 0
      };

      const cost = costTracker.calculateCost('gpt-4', usage);
      expect(cost).toBe(0);
    });

    test('should return 0 for unknown model', () => {
      const usage = {
        inputTokens: 1000,
        outputTokens: 500
      };

      const cost = costTracker.calculateCost('unknown-model', usage);
      expect(cost).toBe(0);
    });
  });

  describe('Usage Recording', () => {
    test('should record usage correctly', async () => {
      const usage = {
        inputTokens: 1000,
        outputTokens: 500,
        model: 'gpt-4'
      };

      await costTracker.recordUsage('frontend', 'gpt-4', 'Task', usage);

      expect(fs.writeJson).toHaveBeenCalled();
      
      const today = new Date().toISOString().split('T')[0];
      expect(costTracker.usage.dailyUsage[today]).toBeDefined();
      expect(costTracker.usage.dailyUsage[today].requests).toBeGreaterThan(0);
    });

    test('should update daily usage', async () => {
      const usage = {
        inputTokens: 1000,
        outputTokens: 500
      };

      await costTracker.recordUsage('frontend', 'gpt-4', 'Task', usage);

      const today = new Date().toISOString().split('T')[0];
      const dailyUsage = costTracker.usage.dailyUsage[today];

      expect(dailyUsage.cost).toBeGreaterThan(0);
      expect(dailyUsage.requests).toBe(1);
      expect(dailyUsage.byAgent.frontend).toBeGreaterThan(0);
    });

    test('should update monthly usage', async () => {
      const usage = {
        inputTokens: 1000,
        outputTokens: 500
      };

      await costTracker.recordUsage('backend', 'claude-3-opus', 'Task', usage);

      expect(costTracker.usage.monthlyUsage.cost).toBeGreaterThan(0);
      expect(costTracker.usage.monthlyUsage.requests).toBe(1);
      expect(costTracker.usage.monthlyUsage.byAgent.backend).toBeGreaterThan(0);
      expect(costTracker.usage.monthlyUsage.byModel['claude-3-opus']).toBeGreaterThan(0);
    });

    test('should accumulate multiple requests', async () => {
      const usage = {
        inputTokens: 500,
        outputTokens: 250
      };

      await costTracker.recordUsage('frontend', 'gpt-4', 'Task 1', usage);
      await costTracker.recordUsage('frontend', 'gpt-4', 'Task 2', usage);

      const today = new Date().toISOString().split('T')[0];
      expect(costTracker.usage.dailyUsage[today].requests).toBe(2);
      expect(costTracker.usage.monthlyUsage.requests).toBe(2);
    });
  });

  describe('Monthly Reset', () => {
    test('should detect month change', async () => {
      const oldMonthData = {
        month: '2024-12',
        dailyUsage: {},
        monthlyUsage: {
          cost: 25,
          requests: 100,
          byAgent: {},
          byModel: {}
        },
        budgets: mockUsageData.budgets
      };

      fs.readJson.mockResolvedValue(oldMonthData);
      const tracker = new CostTracker();
      await tracker.loadUsage();

      // Should reset to current month
      expect(tracker.usage.month).toBe(new Date().toISOString().slice(0, 7));
      expect(tracker.usage.monthlyUsage.cost).toBe(0);
      expect(tracker.usage.monthlyUsage.requests).toBe(0);
    });

    test('should preserve budgets after reset', async () => {
      const oldMonthData = {
        month: '2024-12',
        dailyUsage: {},
        monthlyUsage: { cost: 25, requests: 100, byAgent: {}, byModel: {} },
        budgets: {
          daily: 10,
          monthly: 100,
          perAgent: 20
        }
      };

      fs.readJson.mockResolvedValue(oldMonthData);
      const tracker = new CostTracker();
      await tracker.loadUsage();

      expect(tracker.budgets).toEqual(oldMonthData.budgets);
    });
  });

  describe('Usage Statistics', () => {
    test('should return daily usage for today', () => {
      const today = new Date().toISOString().split('T')[0];
      costTracker.usage.dailyUsage[today] = {
        cost: 2.5,
        requests: 20,
        byAgent: { frontend: 1.2, backend: 1.3 }
      };

      const dailyStats = costTracker.getDailyUsage();
      expect(dailyStats.cost).toBe(2.5);
      expect(dailyStats.requests).toBe(20);
    });

    test('should return monthly usage', () => {
      costTracker.usage.monthlyUsage = {
        cost: 15,
        requests: 125,
        byAgent: { frontend: 5, backend: 7, testing: 3 },
        byModel: { 'gpt-4': 8, 'gpt-3.5-turbo': 7 }
      };

      const monthlyStats = costTracker.getMonthlyUsage();
      expect(monthlyStats.cost).toBe(15);
      expect(monthlyStats.requests).toBe(125);
      expect(monthlyStats.byAgent.frontend).toBe(5);
    });

    test('should return agent usage', () => {
      costTracker.usage.monthlyUsage = {
        cost: 15,
        requests: 125,
        byAgent: { frontend: 5.5, backend: 4.3, testing: 1.5 },
        byModel: {}
      };

      const agentUsage = costTracker.getAgentUsage('frontend');
      expect(agentUsage).toBe(5.5);
    });

    test('should return 0 for agent with no usage', () => {
      const agentUsage = costTracker.getAgentUsage('nonexistent');
      expect(agentUsage).toBe(0);
    });
  });

  describe('Budget Management', () => {
    test('should update daily budget', () => {
      costTracker.updateBudget('daily', 10);
      expect(costTracker.budgets.daily).toBe(10);
    });

    test('should update monthly budget', () => {
      costTracker.updateBudget('monthly', 100);
      expect(costTracker.budgets.monthly).toBe(100);
    });

    test('should update per-agent budget', () => {
      costTracker.updateBudget('perAgent', 20);
      expect(costTracker.budgets.perAgent).toBe(20);
    });

    test('should reject negative budgets', () => {
      expect(() => {
        costTracker.updateBudget('daily', -5);
      }).toThrow();
    });

    test('should reject invalid budget types', () => {
      expect(() => {
        costTracker.updateBudget('invalid', 10);
      }).toThrow();
    });
  });

  describe('File Persistence', () => {
    test('should create usage file if not exists', async () => {
      fs.pathExists.mockResolvedValue(false);
      
      const tracker = new CostTracker();
      await tracker.loadUsage();

      expect(fs.ensureDir).toHaveBeenCalled();
      expect(fs.writeJson).toHaveBeenCalled();
    });

    test('should load existing usage file', async () => {
      const existingData = {
        ...mockUsageData,
        monthlyUsage: {
          cost: 10,
          requests: 50,
          byAgent: { frontend: 6, backend: 4 },
          byModel: {}
        }
      };

      fs.readJson.mockResolvedValue(existingData);
      
      const tracker = new CostTracker();
      await tracker.loadUsage();

      expect(tracker.usage.monthlyUsage.cost).toBe(10);
      expect(tracker.usage.monthlyUsage.requests).toBe(50);
    });

    test('should save usage to file', async () => {
      await costTracker.saveUsage();
      
      expect(fs.writeJson).toHaveBeenCalled();
      const writeCall = fs.writeJson.mock.calls[0];
      expect(writeCall[0]).toContain('model-usage.json');
    });
  });

  describe('Error Handling', () => {
    test('should handle file read errors gracefully', async () => {
      fs.readJson.mockRejectedValue(new Error('File read error'));
      
      const tracker = new CostTracker();
      await tracker.loadUsage();

      // Should initialize with default values
      expect(tracker.usage.monthlyUsage.cost).toBe(0);
    });

    test('should handle file write errors gracefully', async () => {
      fs.writeJson.mockRejectedValue(new Error('File write error'));
      
      const usage = { inputTokens: 100, outputTokens: 50 };
      
      // Should not throw
      await expect(
        costTracker.recordUsage('frontend', 'gpt-4', 'Task', usage)
      ).resolves.not.toThrow();
    });
  });
});
