import { useState, useEffect, useRef } from 'react';
import { LogOut, User, Moon, Sun, ChevronDown, Settings } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { Link, useNavigate } from 'react-router-dom';

const Header = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isDarkMode, setIsDarkMode] = useState(() => {
    return localStorage.getItem('theme') === 'dark' || 
      (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches);
  });
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    setIsDropdownOpen(false);
    logout();
    navigate('/login');
  };

  return (
    <header className="flex h-16 items-center justify-between border-b border-light-border bg-white/80 px-4 dark:border-dark-border dark:bg-[#0F1117]/80 backdrop-blur-md sm:px-6 lg:px-8 z-20 sticky top-0">
      <div className="flex flex-1 items-center justify-end gap-4">
        <button
          onClick={() => setIsDarkMode(!isDarkMode)}
          className="rounded-full p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-800 dark:hover:text-gray-300 transition-colors"
        >
          {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
        </button>

        <div className="relative border-l border-light-border pl-4 dark:border-dark-border" ref={dropdownRef}>
          <button 
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center gap-3 hover:opacity-80 transition-opacity"
          >
            <div className="flex flex-col items-end hidden sm:flex">
              <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">{user?.name || 'User'}</span>
              <span className="text-xs text-gray-500 dark:text-gray-400 capitalize">{user?.role?.replace('_', ' ')}</span>
            </div>
            <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center text-primary">
              <User className="h-5 w-5" />
            </div>
            <ChevronDown className="h-4 w-4 text-gray-400" />
          </button>

          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 rounded-xl bg-white dark:bg-dark-card border border-light-border dark:border-dark-border shadow-lg py-1 z-50">
              <div className="px-4 py-2 border-b border-light-border dark:border-dark-border sm:hidden">
                <p className="text-sm font-medium text-gray-900 dark:text-white">{user?.name}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">{user?.email}</p>
              </div>
              <Link
                to="/settings"
                onClick={() => setIsDropdownOpen(false)}
                className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800/50"
              >
                <Settings className="mr-3 h-4 w-4" />
                Settings
              </Link>
              <button
                onClick={handleLogout}
                className="flex w-full items-center px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
              >
                <LogOut className="mr-3 h-4 w-4" />
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
