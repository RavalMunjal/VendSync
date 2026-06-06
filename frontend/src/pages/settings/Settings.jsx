import { useState } from 'react';
import { User, Lock, Bell, Building } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import toast from 'react-hot-toast';

const Settings = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [loading, setLoading] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      toast.success('Settings saved successfully!');
    }, 1000);
  };

  return (
    <div className="animate-in fade-in duration-500 space-y-6 pb-20">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">Settings</h1>
        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">Manage your account settings and preferences.</p>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        {/* Sidebar */}
        <div className="w-full md:w-64 space-y-1">
          <button onClick={() => setActiveTab('profile')} className={`w-full flex items-center px-4 py-3 rounded-xl text-sm font-semibold transition-colors ${activeTab === 'profile' ? 'bg-primary/10 text-primary' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800'}`}>
            <User className="h-5 w-5 mr-3" /> Profile
          </button>
          <button onClick={() => setActiveTab('security')} className={`w-full flex items-center px-4 py-3 rounded-xl text-sm font-semibold transition-colors ${activeTab === 'security' ? 'bg-primary/10 text-primary' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800'}`}>
            <Lock className="h-5 w-5 mr-3" /> Security
          </button>
          <button onClick={() => setActiveTab('notifications')} className={`w-full flex items-center px-4 py-3 rounded-xl text-sm font-semibold transition-colors ${activeTab === 'notifications' ? 'bg-primary/10 text-primary' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800'}`}>
            <Bell className="h-5 w-5 mr-3" /> Notifications
          </button>
          {user?.role === 'admin' && (
            <button onClick={() => setActiveTab('company')} className={`w-full flex items-center px-4 py-3 rounded-xl text-sm font-semibold transition-colors ${activeTab === 'company' ? 'bg-primary/10 text-primary' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800'}`}>
              <Building className="h-5 w-5 mr-3" /> Company
            </button>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 glass-card p-6 sm:p-8">
          {activeTab === 'profile' && (
            <form onSubmit={handleSave} className="space-y-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white border-b border-light-border dark:border-dark-border pb-4">Profile Information</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Full Name</label>
                  <input type="text" defaultValue={user?.name} className="block w-full rounded-xl border border-gray-200 dark:border-dark-border bg-white dark:bg-[#0F1117] py-2.5 px-4 text-sm focus:border-primary focus:ring-1 focus:ring-primary dark:text-white" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Email Address</label>
                  <input type="email" defaultValue={user?.email} disabled className="block w-full rounded-xl border border-gray-200 dark:border-dark-border bg-gray-50 dark:bg-[#0F1117]/50 py-2.5 px-4 text-sm text-gray-500 cursor-not-allowed" />
                </div>
              </div>
              <div className="pt-4 flex justify-end">
                <button type="submit" disabled={loading} className="px-6 py-2.5 rounded-xl bg-primary text-white font-bold hover:bg-primary-dark transition-colors disabled:opacity-50">
                  {loading ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          )}

          {activeTab === 'security' && (
            <form onSubmit={handleSave} className="space-y-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white border-b border-light-border dark:border-dark-border pb-4">Change Password</h2>
              <div className="space-y-4 max-w-md">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Current Password</label>
                  <input type="password" placeholder="••••••••" className="block w-full rounded-xl border border-gray-200 dark:border-dark-border bg-white dark:bg-[#0F1117] py-2.5 px-4 text-sm focus:border-primary focus:ring-1 focus:ring-primary dark:text-white" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">New Password</label>
                  <input type="password" placeholder="••••••••" className="block w-full rounded-xl border border-gray-200 dark:border-dark-border bg-white dark:bg-[#0F1117] py-2.5 px-4 text-sm focus:border-primary focus:ring-1 focus:ring-primary dark:text-white" />
                </div>
              </div>
              <div className="pt-4 flex justify-end">
                <button type="submit" disabled={loading} className="px-6 py-2.5 rounded-xl bg-primary text-white font-bold hover:bg-primary-dark transition-colors disabled:opacity-50">
                  {loading ? 'Updating...' : 'Update Password'}
                </button>
              </div>
            </form>
          )}

          {activeTab === 'notifications' && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white border-b border-light-border dark:border-dark-border pb-4">Notification Preferences</h2>
              <div className="space-y-4">
                <label className="flex items-center justify-between p-4 border border-light-border dark:border-dark-border rounded-xl cursor-pointer hover:bg-gray-50/50 dark:hover:bg-[#0F1117]/50 transition-colors">
                  <div>
                    <h3 className="font-bold text-gray-900 dark:text-white">Email Notifications</h3>
                    <p className="text-sm text-gray-500">Receive updates about your RFQs and POs via email.</p>
                  </div>
                  <input type="checkbox" defaultChecked className="h-5 w-5 text-primary border-gray-300 rounded focus:ring-primary dark:border-gray-600 dark:bg-gray-700" />
                </label>
                <label className="flex items-center justify-between p-4 border border-light-border dark:border-dark-border rounded-xl cursor-pointer hover:bg-gray-50/50 dark:hover:bg-[#0F1117]/50 transition-colors">
                  <div>
                    <h3 className="font-bold text-gray-900 dark:text-white">In-App Alerts</h3>
                    <p className="text-sm text-gray-500">Show notification dots for new system events.</p>
                  </div>
                  <input type="checkbox" defaultChecked className="h-5 w-5 text-primary border-gray-300 rounded focus:ring-primary dark:border-gray-600 dark:bg-gray-700" />
                </label>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default Settings;
