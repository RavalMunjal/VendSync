import { useState, useEffect } from 'react';
import { Search, Plus, UserCircle, Shield, MoreVertical } from 'lucide-react';
import { Badge } from '../../components/ui/Badge';
import { TableSkeleton } from '../../components/ui/Skeleton';
import api from '../../api/axios';

const MOCK_USERS = [
  { id: 1, name: 'Alice Smith', email: 'alice@bidflow.com', role: 'admin', status: 'active', lastLogin: '2026-06-16' },
  { id: 2, name: 'Bob Johnson', email: 'bob@bidflow.com', role: 'manager', status: 'active', lastLogin: '2026-06-15' },
  { id: 3, name: 'Charlie Davis', email: 'charlie@bidflow.com', role: 'procurement_officer', status: 'inactive', lastLogin: '2026-06-01' },
];

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await api.get('/users').catch(() => null);
        setUsers(response?.data || MOCK_USERS);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const filteredUsers = users.filter(u => u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="animate-in fade-in duration-500 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">User Management</h1>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">Manage internal users and their roles.</p>
        </div>
        <button className="inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-primary to-primary-dark px-4 py-2.5 text-sm font-medium text-white shadow-lg shadow-primary/30 hover:shadow-primary/50 hover:-translate-y-0.5 transition-all">
          <Plus className="mr-2 h-4 w-4" />
          Add User
        </button>
      </div>

      <div className="glass-card overflow-hidden">
        <div className="p-4 border-b border-light-border dark:border-dark-border flex bg-gray-50/50 dark:bg-[#0F1117]/50">
          <div className="relative flex-1 max-w-md">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
              <Search className="h-4 w-4 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search users..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="block w-full rounded-xl border border-gray-200 dark:border-dark-border bg-white dark:bg-dark-card py-2 pl-10 pr-3 text-sm focus:border-primary focus:ring-1 focus:ring-primary dark:text-white transition-all"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          {loading ? (
            <TableSkeleton rows={4} columns={5} />
          ) : (
            <table className="min-w-full divide-y divide-light-border dark:divide-dark-border">
              <thead className="bg-gray-50/50 dark:bg-[#0F1117]/50 uppercase text-xs tracking-wider text-gray-500 dark:text-gray-400">
                <tr>
                  <th className="px-6 py-4 font-medium text-left">User</th>
                  <th className="px-6 py-4 font-medium text-left">Role</th>
                  <th className="px-6 py-4 font-medium text-left">Status</th>
                  <th className="px-6 py-4 font-medium text-left">Last Login</th>
                  <th className="px-6 py-4 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-light-border dark:divide-dark-border">
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50/50 dark:hover:bg-white/[0.02] transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <UserCircle className="h-10 w-10 text-gray-400 mr-3" />
                        <div>
                          <div className="text-sm font-bold text-gray-900 dark:text-white">{user.name}</div>
                          <div className="text-xs text-gray-500">{user.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center text-sm text-gray-900 dark:text-white capitalize">
                        {user.role === 'admin' && <Shield className="h-4 w-4 mr-1.5 text-primary" />}
                        {user.role.replace('_', ' ')}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant={user.status === 'active' ? 'success' : 'default'}>{user.status}</Badge>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">{user.lastLogin}</td>
                    <td className="px-6 py-4 text-right">
                      <button className="p-2 text-gray-400 hover:text-primary rounded-lg hover:bg-primary/10 transition-colors">
                        <MoreVertical className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserManagement;
