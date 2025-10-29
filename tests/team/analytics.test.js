/**
 * AnalyticsEngine Tests
 * Tests team metrics and performance tracking
 */

const { AnalyticsEngine } = require('../../lib/team/analytics');

describe('AnalyticsEngine', () => {
  let engine;

  beforeEach(() => {
    engine = new AnalyticsEngine('Test Pack');
  });

  describe('Initialization', () => {
    test('should create new analytics engine', () => {
      expect(engine).toBeDefined();
      expect(engine.packName).toBe('Test Pack');
      expect(Array.isArray(engine.metrics)).toBe(true);
    });
  });

  describe('Hunt Metrics Recording', () => {
    test('should record hunt metrics', () => {
      const hunt = {
        id: 'hunt-1',
        featureName: 'Feature A',
        status: 'completed',
        startedAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
        completedAt: new Date(),
        getTotalDuration: () => 1440, // 24 hours in minutes
        phaseHistory: [
          {
            phase: 'requirements',
            assignee: 'alice',
            duration: 120,
            startTime: new Date(Date.now() - 24 * 60 * 60 * 1000),
            endTime: new Date(Date.now() - 23 * 60 * 60 * 1000)
          },
          {
            phase: 'spec',
            assignee: 'bob',
            duration: 240,
            startTime: new Date(Date.now() - 23 * 60 * 60 * 1000),
            endTime: new Date(Date.now() - 21 * 60 * 60 * 1000)
          }
        ]
      };

      const metrics = engine.recordHuntMetrics(hunt);

      expect(metrics).toBeDefined();
      expect(metrics.huntId).toBe('hunt-1');
      expect(metrics.feature).toBe('Feature A');
      expect(metrics.status).toBe('completed');
    });

    test('should store recorded metrics', () => {
      const hunt = {
        id: 'hunt-1',
        featureName: 'Feature A',
        status: 'completed',
        startedAt: new Date(),
        completedAt: new Date(),
        getTotalDuration: () => 480,
        phaseHistory: []
      };

      engine.recordHuntMetrics(hunt);

      expect(engine.metrics).toHaveLength(1);
      expect(engine.metrics[0].huntId).toBe('hunt-1');
    });
  });

  describe('Velocity Calculations', () => {
    beforeEach(() => {
      // Add 10 completed hunts
      for (let i = 0; i < 10; i++) {
        const hunt = {
          id: `hunt-${i}`,
          featureName: `Feature ${i}`,
          status: 'completed',
          completedAt: new Date(Date.now() - i * 24 * 60 * 60 * 1000),
          totalDuration: 480 + i * 60,
          phaseHistory: []
        };
        engine.recordHuntMetrics(hunt);
      }
    });

    test('should calculate pack velocity', () => {
      const velocity = engine.getPackVelocity(1);

      expect(velocity).toHaveProperty('huntsCompleted');
      expect(velocity).toHaveProperty('huntsPerDay');
      expect(velocity).toHaveProperty('huntsPerWeek');
      expect(velocity).toHaveProperty('huntsPerMonth');
      expect(velocity).toHaveProperty('avgHuntDuration');
    });

    test('should return numbers for velocity metrics', () => {
      const velocity = engine.getPackVelocity(1);

      expect(typeof velocity.huntsCompleted).toBe('number');
      expect(typeof parseFloat(velocity.huntsPerDay)).toBe('number');
      expect(typeof parseFloat(velocity.huntsPerWeek)).toBe('number');
    });

    test('should track velocity trend', () => {
      const velocity = engine.getPackVelocity(1);

      expect(velocity).toHaveProperty('trend');
      expect(
        ['📈 improving', '📉 declining', '➡️ stable'].includes(velocity.trend)
      ).toBe(true);
    });
  });

  describe('Role Utilization', () => {
    beforeEach(() => {
      const hunt = {
        id: 'hunt-1',
        featureName: 'Feature A',
        status: 'completed',
        startedAt: new Date(),
        completedAt: new Date(),
        getTotalDuration: () => 480,
        phaseHistory: [
          {
            phase: 'requirements',
            assignee: 'alice',
            duration: 120
          },
          {
            phase: 'spec',
            assignee: 'bob',
            duration: 240
          },
          {
            phase: 'implementation',
            assignee: 'carol',
            duration: 960
          },
          {
            phase: 'testing',
            assignee: 'dave',
            duration: 120
          }
        ]
      };

      engine.recordHuntMetrics(hunt);
    });

    test('should calculate role utilization', () => {
      const utilization = engine.getRoleUtilization();

      expect(utilization).toHaveProperty('requirements');
      expect(utilization).toHaveProperty('spec');
      expect(utilization).toHaveProperty('implementation');
      expect(utilization).toHaveProperty('testing');
    });

    test('should include task counts in utilization', () => {
      const utilization = engine.getRoleUtilization();

      Object.values(utilization).forEach(stat => {
        expect(stat).toHaveProperty('role');
        expect(stat).toHaveProperty('tasksCompleted');
        expect(stat).toHaveProperty('totalTime');
        expect(stat).toHaveProperty('averageTime');
      });
    });
  });

  describe('Quality Metrics', () => {
    beforeEach(() => {
      const hunts = [
        {
          id: 'hunt-1',
          status: 'completed',
          totalDuration: 480,
          phaseHistory: []
        },
        {
          id: 'hunt-2',
          status: 'completed',
          totalDuration: 600,
          phaseHistory: []
        },
        {
          id: 'hunt-3',
          status: 'completed',
          totalDuration: 720,
          phaseHistory: []
        }
      ];

      hunts.forEach(hunt => {
        engine.recordHuntMetrics({
          ...hunt,
          startedAt: new Date(),
          completedAt: new Date(),
          getTotalDuration: () => hunt.totalDuration,
          featureName: 'Test'
        });
      });
    });

    test('should calculate quality metrics', () => {
      const quality = engine.getQualityMetrics();

      expect(quality).toHaveProperty('huntsCompleted');
      expect(quality).toHaveProperty('averageDuration');
      expect(quality).toHaveProperty('fastestHunt');
      expect(quality).toHaveProperty('slowestHunt');
      expect(quality).toHaveProperty('medianDuration');
    });

    test('average duration should be reasonable', () => {
      const quality = engine.getQualityMetrics();

      expect(quality.averageDuration).toBeGreaterThan(0);
      expect(quality.fastestHunt).toBeLessThanOrEqual(quality.averageDuration);
      expect(quality.slowestHunt).toBeGreaterThanOrEqual(quality.averageDuration);
    });
  });

  describe('Phase Analysis', () => {
    beforeEach(() => {
      for (let i = 0; i < 5; i++) {
        const hunt = {
          id: `hunt-${i}`,
          featureName: `Feature ${i}`,
          status: 'completed',
          startedAt: new Date(),
          completedAt: new Date(),
          getTotalDuration: () => 480,
          phaseHistory: [
            { phase: 'requirements', duration: 120 },
            { phase: 'spec', duration: 180 },
            { phase: 'implementation', duration: 1200 },
            { phase: 'testing', duration: 120 }
          ]
        };

        engine.recordHuntMetrics(hunt);
      }
    });

    test('should analyze phase durations', () => {
      const analysis = engine.getPhaseAnalysis();

      expect(analysis).toHaveProperty('requirements');
      expect(analysis).toHaveProperty('spec');
      expect(analysis).toHaveProperty('implementation');
      expect(analysis).toHaveProperty('testing');
    });

    test('each phase should have statistics', () => {
      const analysis = engine.getPhaseAnalysis();

      Object.values(analysis).forEach(stat => {
        expect(stat).toHaveProperty('phase');
        expect(stat).toHaveProperty('count');
        expect(stat).toHaveProperty('totalTime');
        expect(stat).toHaveProperty('averageTime');
        expect(stat).toHaveProperty('minTime');
        expect(stat).toHaveProperty('maxTime');
      });
    });
  });

  describe('Bottleneck Detection', () => {
    beforeEach(() => {
      for (let i = 0; i < 3; i++) {
        const hunt = {
          id: `hunt-${i}`,
          featureName: `Feature ${i}`,
          status: 'completed',
          startedAt: new Date(),
          completedAt: new Date(),
          getTotalDuration: () => 480,
          phaseHistory: [
            { phase: 'requirements', duration: 120 },
            { phase: 'spec', duration: 180 },
            { phase: 'implementation', duration: 2400 }, // Much longer
            { phase: 'testing', duration: 120 }
          ]
        };

        engine.recordHuntMetrics(hunt);
      }
    });

    test('should identify bottlenecks', () => {
      const bottlenecks = engine.identifyBottlenecks();

      expect(Array.isArray(bottlenecks)).toBe(true);
      expect(bottlenecks.length).toBeGreaterThan(0);
    });

    test('bottleneck should have severity', () => {
      const bottlenecks = engine.identifyBottlenecks();

      bottlenecks.forEach(b => {
        expect(b).toHaveProperty('role');
        expect(b).toHaveProperty('severity');
        expect(b).toHaveProperty('recommendation');
      });
    });
  });

  describe('Team Report Generation', () => {
    beforeEach(() => {
      const hunt = {
        id: 'hunt-1',
        featureName: 'Feature A',
        status: 'completed',
        startedAt: new Date(),
        completedAt: new Date(),
        getTotalDuration: () => 480,
        phaseHistory: [
          { phase: 'requirements', duration: 120 },
          { phase: 'spec', duration: 240 }
        ]
      };

      engine.recordHuntMetrics(hunt);
    });

    test('should generate comprehensive team report', () => {
      const report = engine.generateTeamReport();

      expect(report).toHaveProperty('timestamp');
      expect(report).toHaveProperty('packName');
      expect(report).toHaveProperty('summary');
      expect(report).toHaveProperty('velocity');
      expect(report).toHaveProperty('utilization');
      expect(report).toHaveProperty('quality');
      expect(report).toHaveProperty('phaseAnalysis');
      expect(report).toHaveProperty('bottlenecks');
      expect(report).toHaveProperty('recommendations');
    });

    test('report should have valid summary', () => {
      const report = engine.generateTeamReport();

      expect(report.summary).toHaveProperty('totalHunts');
      expect(report.summary).toHaveProperty('completedHunts');
    });
  });

  describe('Report Formatting', () => {
    beforeEach(() => {
      const hunt = {
        id: 'hunt-1',
        featureName: 'Feature A',
        status: 'completed',
        startedAt: new Date(),
        completedAt: new Date(),
        getTotalDuration: () => 480,
        phaseHistory: [{ phase: 'requirements', duration: 120 }]
      };

      engine.recordHuntMetrics(hunt);
    });

    test('should format report as markdown', () => {
      const report = engine.generateTeamReport();
      const markdown = engine.formatReportAsMarkdown(report);

      expect(typeof markdown).toBe('string');
      expect(markdown).toContain('LEO Workflow Kit Team Report');
      expect(markdown).toContain(engine.packName);
    });

    test('markdown report should include sections', () => {
      const report = engine.generateTeamReport();
      const markdown = engine.formatReportAsMarkdown(report);

      expect(markdown).toContain('Summary');
      expect(markdown).toContain('Velocity');
      expect(markdown).toContain('Role Utilization');
    });
  });

  describe('Persistence', () => {
    test('should have save method', () => {
      expect(typeof engine.save).toBe('function');
    });

    test('should have static load method', () => {
      expect(typeof AnalyticsEngine.load).toBe('function');
    });
  });

  describe('Edge Cases', () => {
    test('should handle empty metrics', () => {
      const velocity = engine.getPackVelocity();
      expect(velocity).toBeDefined();
    });

    test('should handle single hunt', () => {
      const hunt = {
        id: 'hunt-1',
        featureName: 'Feature A',
        status: 'completed',
        startedAt: new Date(),
        completedAt: new Date(),
        getTotalDuration: () => 480,
        phaseHistory: []
      };

      engine.recordHuntMetrics(hunt);
      const quality = engine.getQualityMetrics();

      expect(quality.huntsCompleted).toBe(1);
    });

    test('should handle missing phase durations', () => {
      const hunt = {
        id: 'hunt-1',
        featureName: 'Feature A',
        status: 'completed',
        startedAt: new Date(),
        completedAt: new Date(),
        getTotalDuration: () => 480,
        phaseHistory: [
          { phase: 'requirements' },
          { phase: 'spec' }
        ]
      };

      const metrics = engine.recordHuntMetrics(hunt);
      expect(metrics).toBeDefined();
    });
  });
});
