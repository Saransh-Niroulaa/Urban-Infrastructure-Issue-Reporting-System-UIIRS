import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, Tooltip, Legend, Filler } from 'chart.js';
import { Doughnut, Bar, Line } from 'react-chartjs-2';
import { AlertTriangle, CheckCircle2, Clock, TrendingUp, ArrowRight } from 'lucide-react';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, Tooltip, Legend, Filler);

const Home = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('http://localhost:5000/api/stats')
      .then(res => { setStats(res.data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[70vh]">
        <div className="text-[#8b8fa3] text-sm">Loading dashboard...</div>
      </div>
    );
  }

  const summary = stats?.summary || { totalIssues: 0, openIssues: 0, inProgressIssues: 0, resolvedIssues: 0 };

  // Doughnut — status breakdown
  const doughnutData = {
    labels: ['Open', 'In Progress', 'Resolved'],
    datasets: [{
      data: [summary.openIssues, summary.inProgressIssues, summary.resolvedIssues],
      backgroundColor: ['#f43f5e', '#f59e0b', '#10b981'],
      borderColor: '#161822',
      borderWidth: 3,
    }]
  };
  const doughnutOpts = {
    cutout: '70%',
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
  };

  // Bar — category
  const barData = {
    labels: stats?.categoryStats?.map(s => s.name) || [],
    datasets: [{
      label: 'Issues',
      data: stats?.categoryStats?.map(s => s.value) || [],
      backgroundColor: '#6366f1',
      borderRadius: 4,
      barThickness: 28,
    }]
  };
  const barOpts = {
    maintainAspectRatio: false,
    scales: {
      x: { grid: { display: false }, ticks: { color: '#8b8fa3', font: { family: 'Outfit' } } },
      y: { grid: { color: '#252834' }, ticks: { color: '#8b8fa3', stepSize: 1, font: { family: 'Outfit' } } },
    },
    plugins: { legend: { display: false } },
  };

  // Line — timeline
  const lineData = {
    labels: stats?.timelineStats?.map(s => s.date) || [],
    datasets: [{
      label: 'Reports',
      data: stats?.timelineStats?.map(s => s.count) || [],
      borderColor: '#38bdf8',
      backgroundColor: 'rgba(56,189,248,0.08)',
      fill: true,
      tension: 0.4,
      pointRadius: 3,
      pointBackgroundColor: '#38bdf8',
    }]
  };
  const lineOpts = {
    maintainAspectRatio: false,
    scales: {
      x: { grid: { display: false }, ticks: { color: '#8b8fa3', font: { family: 'Outfit' } } },
      y: { grid: { color: '#252834' }, ticks: { color: '#8b8fa3', stepSize: 1, font: { family: 'Outfit' } } },
    },
    plugins: { legend: { display: false } },
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Dashboard</h1>
          <p className="text-sm text-[#8b8fa3] mt-0.5">Overview of city infrastructure health</p>
        </div>
        <Link to="/report" className="flex items-center gap-2 bg-[#6366f1] hover:bg-[#5558e6] text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors">
          Report Issue <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total Issues" value={summary.totalIssues} icon={<TrendingUp className="w-4 h-4" />} color="text-[#6366f1]" bg="bg-[#6366f1]/10" />
        <StatCard label="Open" value={summary.openIssues} icon={<AlertTriangle className="w-4 h-4" />} color="text-[#f43f5e]" bg="bg-[#f43f5e]/10" />
        <StatCard label="In Progress" value={summary.inProgressIssues} icon={<Clock className="w-4 h-4" />} color="text-[#f59e0b]" bg="bg-[#f59e0b]/10" />
        <StatCard label="Resolved" value={summary.resolvedIssues} icon={<CheckCircle2 className="w-4 h-4" />} color="text-[#10b981]" bg="bg-[#10b981]/10" />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Doughnut */}
        <div className="bg-[#161822] border border-[#252834] rounded-xl p-5">
          <h3 className="text-sm font-semibold text-[#c4c7d4] mb-4">Status Breakdown</h3>
          <div className="h-48 flex justify-center">
            <Doughnut data={doughnutData} options={doughnutOpts} />
          </div>
          <div className="flex justify-center gap-5 mt-4 text-xs text-[#8b8fa3]">
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-[#f43f5e]"></span>Open</span>
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-[#f59e0b]"></span>In Progress</span>
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-[#10b981]"></span>Resolved</span>
          </div>
        </div>

        {/* Bar */}
        <div className="bg-[#161822] border border-[#252834] rounded-xl p-5">
          <h3 className="text-sm font-semibold text-[#c4c7d4] mb-4">Issues by Category</h3>
          <div className="h-56">
            <Bar data={barData} options={barOpts} />
          </div>
        </div>

        {/* Line */}
        <div className="bg-[#161822] border border-[#252834] rounded-xl p-5">
          <h3 className="text-sm font-semibold text-[#c4c7d4] mb-4">Reports Over Time</h3>
          <div className="h-56">
            <Line data={lineData} options={lineOpts} />
          </div>
        </div>
      </div>

      {/* Zone Health */}
      {stats?.zoneHealth && (
        <div className="bg-[#161822] border border-[#252834] rounded-xl p-5">
          <h3 className="text-sm font-semibold text-[#c4c7d4] mb-4">Zone Health Scores</h3>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {stats.zoneHealth.map(zone => (
              <ZoneCard key={zone.zone} zone={zone} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const StatCard = ({ label, value, icon, color, bg }) => (
  <div className="bg-[#161822] border border-[#252834] rounded-xl p-4 flex items-center gap-4">
    <div className={`${bg} ${color} w-10 h-10 rounded-lg flex items-center justify-center`}>
      {icon}
    </div>
    <div>
      <div className="text-2xl font-bold text-white">{value}</div>
      <div className="text-xs text-[#8b8fa3] font-medium">{label}</div>
    </div>
  </div>
);

const ZoneCard = ({ zone }) => {
  const getColor = (score) => {
    if (score < 50) return { bar: 'bg-[#f43f5e]', text: 'text-[#f43f5e]', label: 'Critical' };
    if (score < 75) return { bar: 'bg-[#f59e0b]', text: 'text-[#f59e0b]', label: 'Degraded' };
    if (score < 90) return { bar: 'bg-[#38bdf8]', text: 'text-[#38bdf8]', label: 'Moderate' };
    return { bar: 'bg-[#10b981]', text: 'text-[#10b981]', label: 'Healthy' };
  };
  const c = getColor(zone.score);

  return (
    <div className="bg-[#1e2030] rounded-lg p-4">
      <div className="flex justify-between items-start mb-3">
        <span className="text-sm font-medium text-white">{zone.zone}</span>
        <span className={`text-xs font-semibold ${c.text}`}>{c.label}</span>
      </div>
      <div className="text-2xl font-bold text-white mb-2">{zone.score}<span className="text-sm text-[#8b8fa3] font-normal">/100</span></div>
      <div className="w-full h-1.5 bg-[#252834] rounded-full overflow-hidden">
        <div className={`h-full ${c.bar} rounded-full transition-all`} style={{ width: `${zone.score}%` }}></div>
      </div>
      <div className="text-xs text-[#8b8fa3] mt-2">{zone.issuesCount} active issues</div>
    </div>
  );
};

export default Home;
