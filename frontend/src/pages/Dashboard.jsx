import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import StatCard from '../components/StatCard';
import { 
  Users, 
  FileText, 
  CheckSquare, 
  FileCheck,
  TrendingUp,
  AlertCircle
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';

// Mock Data for Charts
const monthlyData = [
  { name: 'Jan', spend: 4000 },
  { name: 'Feb', spend: 3000 },
  { name: 'Mar', spend: 2000 },
  { name: 'Apr', spend: 2780 },
  { name: 'May', spend: 1890 },
  { name: 'Jun', spend: 2390 },
];

const categoryData = [
  { name: 'IT Hardware', value: 400 },
  { name: 'Software', value: 300 },
  { name: 'Office Supplies', value: 300 },
  { name: 'Services', value: 200 },
];
const COLORS = ['#4F46E5', '#10B981', '#F59E0B', '#EF4444'];

const Dashboard = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      try {
        // Simulating API call
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Return dummy data based on role for now
        if (user?.role === 'vendor') {
          setStats({
            activeRfqs: 5,
            submittedQuotes: 12,
            wonBids: 3,
            pendingOrders: 2
          });
        } else {
          setStats({
            totalVendors: 124,
            activeRfqs: 18,
            pendingApprovals: 5,
            totalInvoices: 42
          });
        }
      } catch (error) {
        console.error('Failed to fetch stats', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [user]);

  const renderProcurementOfficerAdminDashboard = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard 
          loading={loading}
          title="Total Vendors" 
          value={stats?.totalVendors} 
          icon={Users} 
          color={{ bg: 'bg-indigo-100 dark:bg-indigo-900/50', text: 'text-indigo-600 dark:text-indigo-400' }} 
        />
        <StatCard 
          loading={loading}
          title="Active RFQs" 
          value={stats?.activeRfqs} 
          icon={FileText} 
          color={{ bg: 'bg-emerald-100 dark:bg-emerald-900/50', text: 'text-emerald-600 dark:text-emerald-400' }} 
        />
        <StatCard 
          loading={loading}
          title="Pending Approvals" 
          value={stats?.pendingApprovals} 
          icon={CheckSquare} 
          color={{ bg: 'bg-amber-100 dark:bg-amber-900/50', text: 'text-amber-600 dark:text-amber-400' }} 
        />
        <StatCard 
          loading={loading}
          title="Total Invoices" 
          value={stats?.totalInvoices} 
          icon={FileCheck} 
          color={{ bg: 'bg-purple-100 dark:bg-purple-900/50', text: 'text-purple-600 dark:text-purple-400' }} 
        />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Monthly Spend Bar Chart */}
        <div className="rounded-xl bg-white p-6 shadow-sm border border-gray-100 dark:border-gray-700 dark:bg-gray-800">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Monthly Procurement Spend</h3>
          {loading ? (
            <div className="h-[300px] flex items-center justify-center bg-gray-50 dark:bg-gray-900/50 rounded-lg animate-pulse">
              <TrendingUp className="h-8 w-8 text-gray-400" />
            </div>
          ) : (
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" vertical={false} />
                  <XAxis dataKey="name" stroke="#9CA3AF" />
                  <YAxis stroke="#9CA3AF" />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#1F2937', borderColor: '#374151', color: '#F3F4F6' }}
                    itemStyle={{ color: '#F3F4F6' }}
                  />
                  <Bar dataKey="spend" fill="#4F46E5" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        {/* Vendor Categories Pie Chart */}
        <div className="rounded-xl bg-white p-6 shadow-sm border border-gray-100 dark:border-gray-700 dark:bg-gray-800">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Vendors by Category</h3>
          {loading ? (
            <div className="h-[300px] flex items-center justify-center bg-gray-50 dark:bg-gray-900/50 rounded-lg animate-pulse">
              <div className="h-32 w-32 rounded-full border-8 border-gray-200 dark:border-gray-700"></div>
            </div>
          ) : (
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    fill="#8884d8"
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#1F2937', borderColor: '#374151', color: '#F3F4F6' }}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      </div>
      
      {/* Quick Actions */}
      <div className="rounded-xl bg-white p-6 shadow-sm border border-gray-100 dark:border-gray-700 dark:bg-gray-800">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Quick Actions</h3>
        <div className="flex flex-wrap gap-4">
          <button className="inline-flex items-center justify-center rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-colors">
            Create RFQ
          </button>
          <button className="inline-flex items-center justify-center rounded-lg bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm border border-gray-300 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700 transition-colors">
            Add New Vendor
          </button>
          <button className="inline-flex items-center justify-center rounded-lg bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm border border-gray-300 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700 transition-colors">
            View Approvals
          </button>
        </div>
      </div>
    </div>
  );

  const renderVendorDashboard = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard 
          loading={loading}
          title="New RFQs" 
          value={stats?.activeRfqs} 
          icon={AlertCircle} 
          color={{ bg: 'bg-amber-100 dark:bg-amber-900/50', text: 'text-amber-600 dark:text-amber-400' }} 
        />
        <StatCard 
          loading={loading}
          title="Submitted Quotes" 
          value={stats?.submittedQuotes} 
          icon={FileText} 
          color={{ bg: 'bg-blue-100 dark:bg-blue-900/50', text: 'text-blue-600 dark:text-blue-400' }} 
        />
        <StatCard 
          loading={loading}
          title="Won Bids" 
          value={stats?.wonBids} 
          icon={CheckSquare} 
          color={{ bg: 'bg-emerald-100 dark:bg-emerald-900/50', text: 'text-emerald-600 dark:text-emerald-400' }} 
        />
        <StatCard 
          loading={loading}
          title="Pending Orders" 
          value={stats?.pendingOrders} 
          icon={FileCheck} 
          color={{ bg: 'bg-indigo-100 dark:bg-indigo-900/50', text: 'text-indigo-600 dark:text-indigo-400' }} 
        />
      </div>
      
      <div className="rounded-xl bg-white p-6 shadow-sm border border-gray-100 dark:border-gray-700 dark:bg-gray-800">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Recent Activity</h3>
        <p className="text-gray-500 dark:text-gray-400 text-sm">No recent activity to show.</p>
      </div>
    </div>
  );

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Welcome back, {user?.name || 'User'}
        </h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Here's an overview of your {user?.role === 'vendor' ? 'bidding' : 'procurement'} operations.
        </p>
      </div>

      {user?.role === 'vendor' ? renderVendorDashboard() : renderProcurementOfficerAdminDashboard()}
    </div>
  );
};

export default Dashboard;
