import { useState, useEffect } from 'react';
import axios from 'axios';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, Tooltip, Legend } from 'chart.js';
import { Bar, Pie, Line } from 'react-chartjs-2';
import { LayoutDashboard } from 'lucide-react';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, Tooltip, Legend);

const AdminDashboard = () => {
  const [issues, setIssues] = useState([]);
  const [stats, setStats] = useState(null);

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    try {
      const [issuesRes, statsRes] = await Promise.all([
        axios.get('http://localhost:5000/api/issues'),
        axios.get('http://localhost:5000/api/stats')
      ]);
      setIssues(issuesRes.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
      setStats(statsRes.data);
    } catch (error) {
      console.error(error);
    }
  };

  const updateStatus = async (id, newStatus) => {
    try {
      await axios.patch(`http://localhost:5000/api/issues/${id}`, { status: newStatus });
      fetchData();
    } catch (error) {
      console.error(error);
    }
  };

  const chartFont = { family: 'Outfit' };
  const gridColor = '#252834';
  const tickColor = '#8b8fa3';

  const barChartData = {
    labels: stats?.categoryStats?.map(s => s.name) || [],
    datasets: [{
      label: 'Issues',
      data: stats?.categoryStats?.map(s => s.value) || [],
      backgroundColor: '#6366f1',
      borderRadius: 4,
      barThickness: 28,
    }]
  };

  const pieChartData = {
    labels: stats?.statusStats?.map(s => s.name) || [],
    datasets: [{
      data: stats?.statusStats?.map(s => s.value) || [],
      backgroundColor: ['#f43f5e', '#f59e0b', '#10b981'],
      borderColor: '#161822',
      borderWidth: 3,
    }]
  };

  const lineChartData = {
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

  const commonOpts = {
    maintainAspectRatio: false,
    scales: {
      x: { grid: { display: false }, ticks: { color: tickColor, font: chartFont } },
      y: { grid: { color: gridColor }, ticks: { color: tickColor, stepSize: 1, font: chartFont } },
    },
    plugins: { legend: { display: false } },
  };

  return (
    <div className="space-y-6 pb-10">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <LayoutDashboard className="w-5 h-5 text-[#6366f1]" />
            Admin Panel
          </h1>
          <p className="text-sm text-[#8b8fa3] mt-0.5">Manage and monitor reported infrastructure issues.</p>
        </div>
        {stats && (
          <div className="flex gap-6 text-center">
            <div><span className="block text-xl font-bold text-[#f43f5e]">{stats.summary.openIssues}</span><span className="text-[10px] text-[#8b8fa3] uppercase tracking-wider font-semibold">Open</span></div>
            <div><span className="block text-xl font-bold text-[#f59e0b]">{stats.summary.inProgressIssues}</span><span className="text-[10px] text-[#8b8fa3] uppercase tracking-wider font-semibold">In Progress</span></div>
            <div><span className="block text-xl font-bold text-[#10b981]">{stats.summary.resolvedIssues}</span><span className="text-[10px] text-[#8b8fa3] uppercase tracking-wider font-semibold">Resolved</span></div>
          </div>
        )}
      </div>

      {/* Charts */}
      {stats && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="bg-[#161822] border border-[#252834] rounded-xl p-5 h-72">
            <h3 className="text-sm font-semibold text-[#c4c7d4] mb-3">By Category</h3>
            <div className="h-56"><Bar data={barChartData} options={commonOpts} /></div>
          </div>
          <div className="bg-[#161822] border border-[#252834] rounded-xl p-5 h-72">
            <h3 className="text-sm font-semibold text-[#c4c7d4] mb-3">Status Split</h3>
            <div className="h-56 flex justify-center"><Pie data={pieChartData} options={{ maintainAspectRatio: false, plugins: { legend: { labels: { color: tickColor, font: chartFont } } } }} /></div>
          </div>
          <div className="bg-[#161822] border border-[#252834] rounded-xl p-5 h-72">
            <h3 className="text-sm font-semibold text-[#c4c7d4] mb-3">Timeline</h3>
            <div className="h-56"><Line data={lineChartData} options={commonOpts} /></div>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="bg-[#161822] border border-[#252834] rounded-xl overflow-hidden">
        <div className="px-5 py-4 border-b border-[#252834]">
          <h3 className="text-sm font-semibold text-white">All Issues</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="text-[#8b8fa3] text-xs uppercase tracking-wider border-b border-[#252834]">
              <tr>
                <th className="px-5 py-3">Title</th>
                <th className="px-5 py-3">Category</th>
                <th className="px-5 py-3">Severity</th>
                <th className="px-5 py-3">Status</th>
                <th className="px-5 py-3">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#252834]">
              {issues.map(issue => (
                <tr key={issue._id} className="hover:bg-[#1e2030] transition-colors">
                  <td className="px-5 py-3">
                    <div className="font-medium text-white">{issue.title}</div>
                    <div className="text-xs text-[#555a6e] mt-0.5">{issue.zone}</div>
                  </td>
                  <td className="px-5 py-3 text-[#c4c7d4]">{issue.category}</td>
                  <td className="px-5 py-3">
                    <span className="text-white font-semibold">{issue.severity}</span><span className="text-[#555a6e]">/5</span>
                  </td>
                  <td className="px-5 py-3">
                    <span className={`px-2 py-0.5 rounded text-xs font-semibold uppercase
                      ${issue.status === 'open' ? 'bg-[#f43f5e]/10 text-[#f43f5e]' :
                        issue.status === 'in progress' ? 'bg-[#f59e0b]/10 text-[#f59e0b]' :
                        'bg-[#10b981]/10 text-[#10b981]'}`}
                    >
                      {issue.status}
                    </span>
                  </td>
                  <td className="px-5 py-3">
                    <select
                      value={issue.status}
                      onChange={(e) => updateStatus(issue._id, e.target.value)}
                      className="bg-[#1e2030] border border-[#252834] text-white text-sm rounded-md focus:border-[#6366f1] focus:outline-none px-2 py-1"
                    >
                      <option value="open">Open</option>
                      <option value="in progress">In Progress</option>
                      <option value="resolved">Resolved</option>
                    </select>
                  </td>
                </tr>
              ))}
              {issues.length === 0 && (
                <tr>
                  <td colSpan="5" className="px-5 py-8 text-center text-[#555a6e]">
                    No issues reported yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
