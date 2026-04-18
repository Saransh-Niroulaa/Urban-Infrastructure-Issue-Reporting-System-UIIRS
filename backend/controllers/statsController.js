import Issue from '../models/Issue.js';

// @desc    Get stats for dashboard and health score
// @route   GET /api/stats
// @access  Private/Admin or Public
const getStats = async (req, res, next) => {
  try {
    const issues = await Issue.find({});
    
    // Calculate basic stats
    const totalIssues = issues.length;
    const openIssues = issues.filter(i => i.status === 'open').length;
    const resolvedIssues = issues.filter(i => i.status === 'resolved').length;
    const inProgressIssues = issues.filter(i => i.status === 'in progress').length;
    
    // Group by Category
    const issuesByCategory = issues.reduce((acc, issue) => {
      acc[issue.category] = (acc[issue.category] || 0) + 1;
      return acc;
    }, {});
    
    // Format for Recharts
    const categoryStats = Object.keys(issuesByCategory).map(key => ({
      name: key,
      value: issuesByCategory[key]
    }));

    // Group by Status
    const statusStats = [
      { name: 'Open', value: openIssues },
      { name: 'In Progress', value: inProgressIssues },
      { name: 'Resolved', value: resolvedIssues }
    ];

    // Issues over time (simulated by month or just raw created dates grouped)
    // To keep simple, let's group by date (YYYY-MM-DD)
    const issuesOverTimeObj = issues.reduce((acc, issue) => {
      const date = new Date(issue.createdAt).toISOString().split('T')[0];
      acc[date] = (acc[date] || 0) + 1;
      return acc;
    }, {});
    
    const timelineStats = Object.keys(issuesOverTimeObj).map(date => ({
      date,
      count: issuesOverTimeObj[date]
    })).sort((a, b) => new Date(a.date) - new Date(b.date));

    // Calculate Health Score per Zone
    const zones = ['North Zone', 'South Zone', 'East Zone', 'West Zone'];
    const zoneHealth = zones.map(zoneName => {
      const zoneIssues = issues.filter(i => i.zone === zoneName);
      let score = 100;
      
      zoneIssues.forEach(issue => {
        if (issue.status === 'open' || issue.status === 'in progress') {
          // Deduct points based on severity (1-5)
          score -= (issue.severity * 2); 
        }
      });
      
      score = Math.max(0, score); // lowest score is 0
      
      let label = 'Healthy';
      if (score < 50) label = 'Critical';
      else if (score < 75) label = 'Degraded';
      else if (score < 90) label = 'Moderate';
      
      return {
        zone: zoneName,
        score,
        label,
        issuesCount: zoneIssues.length
      };
    });

    res.json({
      summary: { totalIssues, openIssues, inProgressIssues, resolvedIssues },
      categoryStats,
      statusStats,
      timelineStats,
      zoneHealth
    });

  } catch (error) {
    next(error);
  }
};

export { getStats };
