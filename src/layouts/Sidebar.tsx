import React from 'react';
import { Link } from 'react-router-dom';
import { useUserContext } from '@/contexts/UserContext';
import { routes } from '@/utils/routes';

interface SidebarProps {
  isSidebarOpen: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ isSidebarOpen }) => {
  const { user } = useUserContext();

  const filteredRoutes = routes.filter(route =>
    user ? route.roles.includes(user.role) && route?.name : false
  );

  return (
    <aside className={`w-64 bg-indigo-700 text-white border-r border-indigo-600 fixed top-0 left-0 h-full transition-transform duration-300 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-64'}`}>
      <div className="flex flex-col h-full">
        <div className="items-center justify-center h-16 bg-indigo-800 hidden sm:flex">
          <img src="/logo-white.png" alt="Logo" className="h-16" />
        </div>
        <nav className="flex-1 overflow-y-auto">
          <ul className="space-y-2 lg:mt-5">
            {filteredRoutes.map((route, index) => (
              <li key={index}>
                <Link to={route.path} className="flex items-center px-4 py-3 text-gray-300 hover:bg-indigo-600">
                  {route.icon && <route.icon className="w-6 h-6 mr-3" />}
                  {route.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </aside>
  );
};

export default Sidebar;