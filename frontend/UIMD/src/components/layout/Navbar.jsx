import { Link, useLocation } from 'react-router-dom';
import { Home, Map, FilePlus, LayoutDashboard } from 'lucide-react';

const Navbar = () => {
  const location = useLocation();

  const navLinks = [
    { name: 'Dashboard', path: '/', icon: Home },
    { name: 'Report Issue', path: '/report', icon: FilePlus },
    { name: 'Map', path: '/map', icon: Map },
    { name: 'Admin', path: '/admin', icon: LayoutDashboard },
  ];

  return (
    <nav className="bg-[#161822] border-b border-[#252834]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-14">
          <div className="flex items-center gap-10">
            <Link to="/" className="text-xl font-bold text-white tracking-tight">
              UIHIIS
            </Link>
            <div className="hidden sm:flex items-center gap-1">
              {navLinks.map((link) => {
                const Icon = link.icon;
                const isActive = location.pathname === link.path;
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-[#252834] text-white'
                        : 'text-[#8b8fa3] hover:text-white hover:bg-[#1e2030]'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    {link.name}
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
