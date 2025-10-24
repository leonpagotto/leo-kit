/**
 * LionPack Analytics Engine
 * Tracks and reports team metrics and performance
 */

const fs = require('fs-extra');
const path = require('path');
const { RoleManager } = require('./roles');

/**
 * Analytics Engine
 * Collects and analyzes team performance metrics
 */
class AnalyticsEngine {
  constructor(packName) {
    this.packName = packName;
    this.metrics = [];
  }

  /**
   * Record hunt cycle metrics
   */
  recordHuntMetrics(hunt) {
    const metrics = {
      huntId: hunt.id,
      feature: hunt.featureName,
      completedAt: hunt.completedAt,
      status: hunt.status,
      totalDuration: hunt.getTotalDuration(),
      phases: {},
      timestamps: {
        started: hunt.startedAt,
        completed: hunt.completedAt
      }
    };

    // Calculate metrics per phase
    for (const phase of hunt.phaseHistory) {
      const roleInfo = RoleManager.getRole(phase.phase);

      metrics.phases[phase.phase] = {
        role: roleInfo.name,
        assignee: phase.assignee,
        duration: phase.duration, // in minutes
        startTime: phase.startTime,
        endTime: phase.endTime
      };
    }

    this.metrics.push(metrics);
    return metrics;
  }

  /**
   * Calculate pack velocity (hunts per month)
   */
  getPackVelocity(months = 1) {
    const now = new Date();
    const cutoffDate = new Date(now.getTime() - months * 30 * 24 * 60 * 60 * 1000);

    const recentMetrics = this.metrics.filter(m => {
      const completedDate = new Date(m.completedAt);
      return m.status === 'completed' && completedDate >= cutoffDate;
    });

    const huntsPerDay = recentMetrics.length / (months * 30);
    const huntsPerWeek = huntsPerDay * 7;
    const huntsPerMonth = huntsPerDay * 30;

    return {
      period: `${months} month(s)`,
      huntsCompleted: recentMetrics.length,
      huntsPerDay: huntsPerDay.toFixed(2),
      huntsPerWeek: huntsPerWeek.toFixed(2),
      huntsPerMonth: huntsPerMonth.toFixed(2),
      avgHuntDuration: this._calculateAverage(
        recentMetrics.map(m => m.totalDuration)
      ),
      trend: this._calculateTrend(recentMetrics)
    };
  }

  /**
   * Calculate role utilization
   */
  getRoleUtilization() {
    const roleStats = {};

    // Initialize all roles
    RoleManager.getSequence().forEach(roleId => {
      roleStats[roleId] = {
        role: RoleManager.getRole(roleId).name,
        tasksCompleted: 0,
        totalTime: 0,
        averageTime: 0
      };
    });

    // Aggregate data
    this.metrics.forEach(metric => {
      Object.entries(metric.phases).forEach(([roleId, phaseData]) => {
        if (roleStats[roleId]) {
          roleStats[roleId].tasksCompleted++;
          roleStats[roleId].totalTime += phaseData.duration || 0;
        }
      });
    });

    // Calculate averages
    Object.values(roleStats).forEach(stat => {
      stat.averageTime =
        stat.tasksCompleted > 0
          ? Math.round(stat.totalTime / stat.tasksCompleted)
          : 0;
    });

    return roleStats;
  }

  /**
   * Calculate quality metrics
   */
  getQualityMetrics() {
    const completed = this.metrics.filter(m => m.status === 'completed');

    return {
      huntsCompleted: completed.length,
      averageDuration: this._calculateAverage(
        completed.map(m => m.totalDuration)
      ),
      fastestHunt: Math.min(...completed.map(m => m.totalDuration)),
      slowestHunt: Math.max(...completed.map(m => m.totalDuration)),
      medianDuration: this._calculateMedian(
        completed.map(m => m.totalDuration)
      )
    };
  }

  /**
   * Calculate phase duration analysis
   */
  getPhaseAnalysis() {
    const phaseData = {};

    RoleManager.getSequence().forEach(roleId => {
      phaseData[roleId] = {
        phase: RoleManager.getRole(roleId).name,
        durations: [],
        count: 0,
        totalTime: 0,
        averageTime: 0
      };
    });

    this.metrics.forEach(metric => {
      Object.entries(metric.phases).forEach(([roleId, phaseInfo]) => {
        if (phaseData[roleId] && phaseInfo.duration) {
          phaseData[roleId].durations.push(phaseInfo.duration);
          phaseData[roleId].count++;
          phaseData[roleId].totalTime += phaseInfo.duration;
        }
      });
    });

    Object.values(phaseData).forEach(p => {
      p.averageTime = p.count > 0 ? Math.round(p.totalTime / p.count) : 0;
      p.minTime = p.durations.length > 0 ? Math.min(...p.durations) : 0;
      p.maxTime = p.durations.length > 0 ? Math.max(...p.durations) : 0;
    });

    return phaseData;
  }

  /**
   * Identify bottlenecks
   */
  identifyBottlenecks() {
    const bottlenecks = [];
    const phaseAnalysis = this.getPhaseAnalysis();
    const avgTimes = Object.values(phaseAnalysis).map(p => p.averageTime);
    const overallAvg = this._calculateAverage(avgTimes);

    Object.entries(phaseAnalysis).forEach(([roleId, data]) => {
      if (data.averageTime > overallAvg * 1.5) {
        bottlenecks.push({
          role: data.phase,
          averageTime: data.averageTime,
          severity: 'high',
          recommendation: `${data.phase} is ${Math.round((data.averageTime / overallAvg) * 100 - 100)}% slower than average. Consider pairing or additional resources.`
        });
      }
    });

    return bottlenecks;
  }

  /**
   * Generate comprehensive team report
   */
  generateTeamReport() {
    const velocity = this.getPackVelocity(1);
    const utilization = this.getRoleUtilization();
    const quality = this.getQualityMetrics();
    const phaseAnalysis = this.getPhaseAnalysis();
    const bottlenecks = this.identifyBottlenecks();

    return {
      timestamp: new Date().toISOString(),
      packName: this.packName,
      summary: {
        totalHunts: this.metrics.length,
        completedHunts: this.metrics.filter(m => m.status === 'completed').length
      },
      velocity,
      utilization,
      quality,
      phaseAnalysis,
      bottlenecks,
      recommendations: this._generateRecommendations(
        velocity,
        utilization,
        bottlenecks
      )
    };
  }

  /**
   * Format report as markdown
   */
  formatReportAsMarkdown(report) {
    let md = `# 🦁 LionPack Team Report\n\n`;
    md += `**Pack:** ${report.packName}\n`;
    md += `**Generated:** ${new Date(report.timestamp).toLocaleString()}\n\n`;

    // Summary
    md += `## 📊 Summary\n\n`;
    md += `- Total Hunts: ${report.summary.totalHunts}\n`;
    md += `- Completed: ${report.summary.completedHunts}\n\n`;

    // Velocity
    md += `## 🚀 Velocity\n\n`;
    md += `- Hunts/Month: **${report.velocity.huntsPerMonth}**\n`;
    md += `- Avg Duration: ${report.velocity.avgHuntDuration} min\n`;
    md += `- Trend: ${report.velocity.trend}\n\n`;

    // Quality
    md += `## ✨ Quality\n\n`;
    md += `- Avg Duration: ${report.quality.averageDuration} min\n`;
    md += `- Fastest: ${report.quality.fastestHunt} min\n`;
    md += `- Slowest: ${report.quality.slowestHunt} min\n\n`;

    // Utilization
    md += `## 👥 Role Utilization\n\n`;
    md += `| Role | Tasks | Avg Time | Total Time |\n`;
    md += `|------|-------|----------|------------|\n`;

    Object.values(report.utilization).forEach(stat => {
      md += `| ${stat.role} | ${stat.tasksCompleted} | ${stat.averageTime}m | ${stat.totalTime}m |\n`;
    });
    md += `\n`;

    // Bottlenecks
    if (report.bottlenecks.length > 0) {
      md += `## ⚠️ Bottlenecks\n\n`;
      report.bottlenecks.forEach(b => {
        md += `- **${b.role}** (${b.severity}): ${b.recommendation}\n`;
      });
      md += `\n`;
    }

    // Recommendations
    if (report.recommendations.length > 0) {
      md += `## 💡 Recommendations\n\n`;
      report.recommendations.forEach(rec => {
        md += `- ${rec}\n`;
      });
    }

    return md;
  }

  /**
   * Save metrics to file
   */
  async save(projectPath = '.') {
    const analyticsPath = path.join(projectPath, '.lionpack', 'analytics.json');
    await fs.ensureDir(path.dirname(analyticsPath));
    await fs.writeJson(analyticsPath, {
      packName: this.packName,
      metrics: this.metrics,
      generatedAt: new Date().toISOString()
    }, { spaces: 2 });
  }

  /**
   * Load metrics from file
   */
  static async load(packName, projectPath = '.') {
    const engine = new AnalyticsEngine(packName);
    const analyticsPath = path.join(projectPath, '.lionpack', 'analytics.json');

    try {
      const data = await fs.readJson(analyticsPath);
      engine.metrics = data.metrics || [];
    } catch (error) {
      if (error.code !== 'ENOENT') {
        console.warn('Could not load analytics:', error.message);
      }
    }

    return engine;
  }

  // Private helper methods

  _calculateAverage(numbers) {
    if (numbers.length === 0) return 0;
    const sum = numbers.reduce((a, b) => a + b, 0);
    return Math.round(sum / numbers.length);
  }

  _calculateMedian(numbers) {
    if (numbers.length === 0) return 0;
    const sorted = [...numbers].sort((a, b) => a - b);
    const mid = Math.floor(sorted.length / 2);
    return sorted.length % 2 !== 0 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
  }

  _calculateTrend(metrics) {
    if (metrics.length < 2) return 'insufficient data';

    const firstHalf = metrics.slice(0, Math.floor(metrics.length / 2));
    const secondHalf = metrics.slice(Math.floor(metrics.length / 2));

    const firstAvg = this._calculateAverage(firstHalf.map(m => m.totalDuration));
    const secondAvg = this._calculateAverage(secondHalf.map(m => m.totalDuration));

    if (secondAvg < firstAvg * 0.9) return '📈 improving';
    if (secondAvg > firstAvg * 1.1) return '📉 declining';
    return '➡️ stable';
  }

  _generateRecommendations(velocity, utilization, bottlenecks) {
    const recs = [];

    if (velocity.huntsPerMonth < 5) {
      recs.push('📌 Velocity is low. Consider analyzing blockers and optimizing handoffs.');
    }

    if (bottlenecks.length > 0) {
      recs.push('⚠️ Identified bottlenecks. See section above for recommendations.');
    }

    const overutilized = Object.values(utilization).filter(
      u => u.tasksCompleted > 10
    );
    if (overutilized.length > 0) {
      recs.push('👥 Some roles are overutilized. Consider role rotation or team expansion.');
    }

    return recs;
  }
}

module.exports = {
  AnalyticsEngine
};
