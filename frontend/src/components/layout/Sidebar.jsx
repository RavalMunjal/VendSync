import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, Users, FileText, CheckSquare, MessageSquare, 
  Package, Receipt, ShieldAlert, BarChart3, Settings, Building2, Menu, X
} from 'lucide-react';
import clsx from 'clsx';
import { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';

const NAVIGATION = [
  {
    section: 'Main',
    items: [
      { name: 'Dashboard', to: '/', icon: LayoutDashboard },
    ]
  },
  {
    section: 'Procurement',
    items: [
      { name: 'Vendors', to: '/vendors', icon: Building2 },
      { name: 'RFQs', to: '/rfqs', icon: FileText },
      { name: 'Quotations', to: '/quotations', icon: MessageSquare },
      { name: 'Approvals', to: '/approvals', icon: CheckSquare },
      { name: 'Purchase Orders', to: '/pos', icon: Package },
      { name: 'Invoices', to: '/invoices', icon: Receipt },
    ]
  },
  {
    section: 'Admin',
    roles: ['admin', 'manager'],
    items: [
      { name: 'User Management', to: '/users', icon: Users },
      { name: 'Reports & Analytics', to: '/analytics', icon: BarChart3 },
      { name: 'Activity Logs', to: '/logs', icon: ShieldAlert },
    ]
  },
  {
    section: 'Account',
    items: [
      { name: 'Settings', to: '/settings', icon: Settings },
    ]
  }
];

const Sidebar = () => {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => setIsOpen(!isOpen);
  const closeSidebar = () => setIsOpen(false);

  return (
    <>
      {/* Mobile Hamburger */}
      <div className="lg:hidden fixed top-0 left-0 z-50 p-4">
        <button
          onClick={toggleSidebar}
          className="p-2 rounded-md bg-white dark:bg-dark-card border border-light-border dark:border-dark-border shadow-sm text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
        >
          {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-30 bg-gray-900/50 backdrop-blur-sm lg:hidden"
          onClick={closeSidebar}
        />
      )}

      {/* Sidebar */}
      <div className={clsx(
        "fixed inset-y-0 left-0 z-40 w-64 transform flex-col border-r border-light-border bg-white/80 dark:bg-[#0F1117]/80 backdrop-blur-xl dark:border-dark-border transition-transform duration-300 ease-in-out lg:static lg:translate-x-0 lg:flex",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="flex h-16 shrink-0 items-center px-6 border-b border-light-border dark:border-dark-border">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-indigo-700 shadow-lg shadow-indigo-500/30">
              <span className="text-lg font-bold text-white">B</span>
            </div>
            <span className="text-xl font-bold tracking-tight text-gray-900 dark:text-white">BidFlow</span>
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto px-4 py-6 space-y-8 scrollbar-hide">
          {NAVIGATION.map((group) => {
            if (group.roles && !group.roles.includes(user?.role)) return null;

            return (
              <div key={group.section}>
                <h3 className="px-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
                  {group.section}
                </h3>
                <div className="space-y-1">
                  {group.items.map((item) => (
                    <NavLink
                      key={item.name}
                      to={item.to}
                      onClick={closeSidebar}
                      className={({ isActive }) => clsx(
                        'group flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200',
                        isActive
                          ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-400'
                          : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-800/50 dark:hover:text-white'
                      )}
                    >
                      {({ isActive }) => (
                        <>
                          <div className={clsx(
                            "absolute left-0 w-1 rounded-r-full transition-all duration-200",
                            isActive ? "h-8 bg-indigo-600 dark:bg-indigo-500" : "h-0"
                          )} />
                          <item.icon
                            className={clsx(
                              'mr-3 h-5 w-5 flex-shrink-0 transition-colors',
                              isActive ? 'text-indigo-600 dark:text-indigo-400' : 'text-gray-400 group-hover:text-gray-500 dark:text-gray-500 dark:group-hover:text-gray-300'
                            )}
                            aria-hidden="true"
                          />
                          {item.name}
                        </>
                      )}
                    </NavLink>
                  ))}
                </div>
              </div>
            );
          })}
        </nav>
      </div>
    </>
  );
};

export default Sidebar;
