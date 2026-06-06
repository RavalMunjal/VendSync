import React from 'react';
import { LogOut, User, Moon, Sun } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

const Header = () => {
  const { user, logout } = useAuth();
  const [isDarkMode, setIsDarkMode] = React.useState(false);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    if (!isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  return (
    <header className="flex h-16 items-center justify-between border-b border-gray-200 bg-white px-4 dark:border-gray-700 dark:bg-gray-800 sm:px-6 lg:px-8">
      <div className="flex flex-1 items-center justify-end gap-4">
        <button
          onClick={toggleDarkMode}
          className="rounded-full p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500 dark:hover:bg-gray-700 dark:hover:text-gray-300 transition-colors"
        >
          {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
        </button>

        <div className="flex items-center gap-3 border-l border-gray-200 pl-4 dark:border-gray-700">
          <div className="flex flex-col items-end">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-200">{user?.name || 'User'}</span>
            <span className="text-xs text-gray-500 dark:text-gray-400 capitalize">{user?.role?.replace('_', ' ')}</span>
          </div>
          <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
            <User className="h-5 w-5" />
          </div>
          <button
            onClick={logout}
            className="ml-2 rounded-full p-2 text-gray-400 hover:bg-red-50 hover:text-red-500 dark:hover:bg-gray-700 dark:hover:text-red-400 transition-colors"
            title="Logout"
          >
            <LogOut className="h-5 w-5" />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
