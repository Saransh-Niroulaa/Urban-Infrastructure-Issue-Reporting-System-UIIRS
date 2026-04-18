import { Routes, Route } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import Home from '../pages/Home';
import ReportIssue from '../pages/ReportIssue';
import MapView from '../pages/MapView';
import AdminDashboard from '../pages/AdminDashboard';

const AppRoutes = () => {
  return (
    <div className="min-h-screen flex flex-col w-full bg-[#0f1117] text-[#e2e4e9]">
      <Navbar />
      <main className="flex-1 overflow-x-hidden max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/report" element={<ReportIssue />} />
          <Route path="/map" element={<MapView />} />
          <Route path="/admin" element={<AdminDashboard />} />
        </Routes>
      </main>
    </div>
  );
};

export default AppRoutes;
