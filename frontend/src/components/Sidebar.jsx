import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  FileText, 
  CheckSquare, 
  FileCheck,
  Activity
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import clsx from 'clsx';

const Sidebar = () => {
  const { user } = useAuth();

  const navItems = [
    { name: 'Dashboard', path: '/', icon: LayoutDashboard, roles: ['procurement_officer', 'vendor', 'manager', 'admin'] },
    { name: 'Vendors', path: '/vendors', icon: Users, roles: ['procurement_officer', 'admin'] },
    { name: 'RFQs', path: '/rfqs', icon: FileText, roles: ['procurement_officer', 'vendor', 'admin'] },
    { name: 'Approvals', path: '/approvals', icon: CheckSquare, roles: ['manager', 'admin'] },
    { name: 'Purchase Orders', path: '/pos', icon: FileCheck, roles: ['procurement_officer', 'vendor', 'admin'] },
    { name: 'Activity Logs', path: '/logs', icon: Activity, roles: ['admin'] },
  ];

  const allowedNavItems = navItems.filter(item => user && item.roles.includes(user.role));

  return (
    <div className="flex h-screen w-64 flex-col bg-white border-r border-gray-200 dark:bg-gray-800 dark:border-gray-700">
      <div className="flex h-16 items-center justify-center border-b border-gray-200 dark:border-gray-700">
        <h1 className="text-2xl font-bold text-primary flex items-center gap-2">
          <div className="w-8 h-8 bg-primary text-white rounded-lg flex items-center justify-center">B</div>
          BidFlow
        </h1>
      </div>
      <div className="flex-1 overflow-y-auto py-4">
        <nav className="space-y-1 px-3">
          {allowedNavItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.name}
                to={item.path}
                className={({ isActive }) =>
                  clsx(
                    'group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors',
                    isActive
                      ? 'bg-primary/10 text-primary dark:bg-primary/20 dark:text-primary-400'
                      : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white'
                  )
                }
              >
                <Icon
                  className="mr-3 h-5 w-5 flex-shrink-0"
                  aria-hidden="true"
                />
                {item.name}
              </NavLink>
            );
          })}
        </nav>
      </div>
    </div>
  );
};

export default Sidebar;
