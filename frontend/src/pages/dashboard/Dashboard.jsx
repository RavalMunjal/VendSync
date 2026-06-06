import { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import StatCard from '../../components/ui/StatCard';
import { Badge } from '../../components/ui/Badge';
import api from '../../api/axios';
import { 
  Users, 
  FileText, 
  CheckSquare, 
  FileCheck,
  TrendingUp,
  AlertCircle,
  Plus
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
import { Link } from 'react-router-dom';

// Fallback Mock Data
const MOCK_MONTHLY_DATA = [
  { name: 'Jan', spend: 4000 },
  { name: 'Feb', spend: 3000 },
  { name: 'Mar', spend: 2000 },
  { name: 'Apr', spend: 2780 },
  { name: 'May', spend: 1890 },
  { name: 'Jun', spend: 2390 },
];

const MOCK_CATEGORY_DATA = [
  { name: 'IT Hardware', value: 400 },
  { name: 'Software', value: 300 },
  { name: 'Office Supplies', value: 300 },
  { name: 'Services', value: 200 },
];

const MOCK_RECENT_POS = [
  { id: 'PO-2026-001', vendor: 'TechCorp Solutions', amount: 45000, date: '2026-06-01', status: 'generated' },
  { id: 'PO-2026-002', vendor: 'Global Software Inc', amount: 12000, date: '2026-06-03', status: 'sent' },
  { id: 'PO-2026-003', vendor: 'Hardware Hub', amount: 8500, date: '2026-06-05', status: 'acknowledged' },
];

const MOCK_PENDING_APPROVALS = [
  { id: 1, title: 'Server Upgrade Q3', vendor: 'TechCorp Solutions', amount: 45000, timeAgo: '2 hours ago' },
  { id: 2, title: 'Office Laptops', vendor: 'Hardware Hub', amount: 120000, timeAgo: '5 hours ago' },
];

const COLORS = ['#6366F1', '#10B981', '#F59E0B', '#EF4444', '#3B82F6'];

const Dashboard = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const [chartData, setChartData] = useState({ monthly: [], category: [] });
  const [recentData, setRecentData] = useState({ pos: [], approvals: [] });

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Attempt real API calls
        const [statsRes, monthlyRes, categoryRes, posRes, approvalsRes] = await Promise.all([
          api.get('/analytics/stats').catch(() => null),
          api.get('/analytics/spending/monthly').catch(() => null),
          api.get('/analytics/category/spending').catch(() => null),
          api.get('/pos/recent').catch(() => null),
          api.get('/approvals/pending/list').catch(() => null),
        ]);

        if (user?.role === 'vendor') {
          setStats(statsRes?.data || { activeRfqs: 5, submittedQuotes: 12, wonBids: 3, pendingOrders: 2 });
        } else {
          setStats(statsRes?.data || { totalVendors: 124, activeRfqs: 18, pendingApprovals: 5, totalInvoices: 42 });
        }

        setChartData({
          monthly: monthlyRes?.data || MOCK_MONTHLY_DATA,
          category: categoryRes?.data || MOCK_CATEGORY_DATA,
        });

        setRecentData({
          pos: posRes?.data || MOCK_RECENT_POS,
          approvals: approvalsRes?.data || MOCK_PENDING_APPROVALS,
        });

      } catch (error) {
        console.error('Failed to fetch dashboard data', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  const renderProcurementOfficerAdminDashboard = () => (
    <div className="space-y-6">
      {/* Top Stat Cards */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard 
          loading={loading}
          title="Total Vendors" 
          value={stats?.totalVendors} 
          icon={Users} 
          glowColor="glow-border-purple"
          color={{ bg: 'bg-primary/10', text: 'text-primary' }} 
          trend={{ value: 12, isPositive: true }}
        />
        <StatCard 
          loading={loading}
          title="Active RFQs" 
          value={stats?.activeRfqs} 
          icon={FileText} 
          glowColor="glow-border-green"
          color={{ bg: 'bg-success/10', text: 'text-success' }} 
          trend={{ value: 8, isPositive: true }}
        />
        <Link to="/approvals" className="block transition-transform hover:-translate-y-1">
          <StatCard 
            loading={loading}
            title="Pending Approvals" 
            value={stats?.pendingApprovals} 
            icon={CheckSquare} 
            glowColor="glow-border-amber"
            color={{ bg: 'bg-warning/10', text: 'text-warning' }} 
            trend={{ value: 2, isPositive: false }}
          />
        </Link>
        <StatCard 
          loading={loading}
          title="Total Invoices" 
          value={stats?.totalInvoices} 
          icon={FileCheck} 
          glowColor="glow-border-blue"
          color={{ bg: 'bg-info/10', text: 'text-info' }} 
          trend={{ value: 24, isPositive: true }}
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="glass-card p-6">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6">Monthly Procurement Spend</h3>
          {loading ? (
            <div className="h-[300px] flex items-center justify-center bg-gray-50/50 dark:bg-gray-800/50 rounded-xl animate-pulse">
              <TrendingUp className="h-8 w-8 text-gray-400" />
            </div>
          ) : (
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData.monthly} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <defs>
                    <linearGradient id="colorSpend" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366F1" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#6366F1" stopOpacity={0.2}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#2A2D3E" vertical={false} />
                  <XAxis dataKey="name" stroke="#6B7280" tickLine={false} axisLine={false} />
                  <YAxis stroke="#6B7280" tickFormatter={(value) => `₹${value}`} tickLine={false} axisLine={false} />
                  <Tooltip 
                    cursor={{ fill: 'rgba(99, 102, 241, 0.1)' }}
                    contentStyle={{ backgroundColor: '#1A1D27', borderColor: '#2A2D3E', borderRadius: '12px', color: '#fff', boxShadow: '0 4px 24px rgba(0,0,0,0.2)' }}
                    formatter={(value) => [`₹${value}`, 'Spend']}
                  />
                  <Bar dataKey="spend" fill="url(#colorSpend)" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        <div className="glass-card p-6">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6">Vendors by Category</h3>
          {loading ? (
            <div className="h-[300px] flex items-center justify-center bg-gray-50/50 dark:bg-gray-800/50 rounded-xl animate-pulse">
              <div className="h-32 w-32 rounded-full border-8 border-gray-200 dark:border-gray-700"></div>
            </div>
          ) : (
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chartData.category}
                    cx="50%"
                    cy="50%"
                    innerRadius={70}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                    stroke="none"
                  >
                    {chartData.category.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#1A1D27', borderColor: '#2A2D3E', borderRadius: '12px', color: '#fff' }}
                    itemStyle={{ color: '#fff' }}
                  />
                  <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      </div>
      
      {/* Tables Row */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        {/* Recent POs */}
        <div className="glass-card overflow-hidden">
          <div className="p-6 border-b border-light-border dark:border-dark-border flex items-center justify-between">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">Recent Purchase Orders</h3>
            <Link to="/pos" className="text-sm font-medium text-primary hover:text-primary-dark">View All</Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-gray-50/50 dark:bg-[#0F1117]/50 text-gray-500 dark:text-gray-400 border-b border-light-border dark:border-dark-border">
                <tr>
                  <th className="px-6 py-4 font-medium">PO Number</th>
                  <th className="px-6 py-4 font-medium">Vendor</th>
                  <th className="px-6 py-4 font-medium">Amount</th>
                  <th className="px-6 py-4 font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-light-border dark:divide-dark-border">
                {recentData.pos.map((po) => (
                  <tr key={po.id} className="hover:bg-gray-50/50 dark:hover:bg-white/[0.02] transition-colors">
                    <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">{po.id}</td>
                    <td className="px-6 py-4 text-gray-600 dark:text-gray-300">{po.vendor}</td>
                    <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">₹{po.amount.toLocaleString('en-IN')}</td>
                    <td className="px-6 py-4">
                      <Badge variant={
                        po.status === 'generated' ? 'primary' : 
                        po.status === 'sent' ? 'warning' : 'success'
                      }>
                        {po.status}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pending Approvals */}
        <div className="glass-card overflow-hidden">
          <div className="p-6 border-b border-light-border dark:border-dark-border flex items-center justify-between">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">Pending Approvals</h3>
            <Link to="/approvals" className="text-sm font-medium text-primary hover:text-primary-dark">View All</Link>
          </div>
          <div className="p-6">
            <div className="space-y-6">
              {recentData.approvals.map((approval) => (
                <div key={approval.id} className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="h-10 w-10 rounded-full bg-warning/10 flex items-center justify-center">
                      <CheckSquare className="h-5 w-5 text-warning" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">{approval.title}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{approval.vendor} • {approval.timeAgo}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className="text-sm font-bold text-gray-900 dark:text-white mr-2">₹{approval.amount.toLocaleString('en-IN')}</span>
                    <button className="px-3 py-1.5 text-xs font-medium bg-success/10 text-success rounded-lg hover:bg-success hover:text-white transition-colors">
                      Approve
                    </button>
                    <button className="px-3 py-1.5 text-xs font-medium bg-danger/10 text-danger rounded-lg hover:bg-danger hover:text-white transition-colors">
                      Reject
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      
      {/* Quick Actions Buttons */}
      <div className="flex flex-wrap gap-4 pt-4">
        <Link to="/rfqs/create" className="inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-primary to-primary-dark px-6 py-3 text-sm font-medium text-white shadow-lg shadow-primary/30 hover:shadow-primary/50 hover:-translate-y-0.5 transition-all">
          <Plus className="w-4 h-4 mr-2" />
          Create RFQ
        </Link>
        <Link to="/vendors" className="inline-flex items-center justify-center rounded-xl bg-white dark:bg-dark-card border border-light-border dark:border-dark-border px-6 py-3 text-sm font-medium text-gray-700 dark:text-gray-200 shadow-sm hover:bg-gray-50 dark:hover:bg-gray-800 hover:-translate-y-0.5 transition-all">
          <Plus className="w-4 h-4 mr-2" />
          Add Vendor
        </Link>
        <Link to="/analytics" className="inline-flex items-center justify-center rounded-xl bg-white dark:bg-dark-card border border-light-border dark:border-dark-border px-6 py-3 text-sm font-medium text-gray-700 dark:text-gray-200 shadow-sm hover:bg-gray-50 dark:hover:bg-gray-800 hover:-translate-y-0.5 transition-all">
          View Reports
        </Link>
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
          glowColor="glow-border-amber"
          color={{ bg: 'bg-warning/10', text: 'text-warning' }} 
        />
        <StatCard 
          loading={loading}
          title="Submitted Quotes" 
          value={stats?.submittedQuotes} 
          icon={FileText} 
          glowColor="glow-border-blue"
          color={{ bg: 'bg-info/10', text: 'text-info' }} 
        />
        <StatCard 
          loading={loading}
          title="Won Bids" 
          value={stats?.wonBids} 
          icon={CheckSquare} 
          glowColor="glow-border-green"
          color={{ bg: 'bg-success/10', text: 'text-success' }} 
        />
        <StatCard 
          loading={loading}
          title="Pending Orders" 
          value={stats?.pendingOrders} 
          icon={FileCheck} 
          glowColor="glow-border-purple"
          color={{ bg: 'bg-primary/10', text: 'text-primary' }} 
        />
      </div>
      
      <div className="glass-card p-6">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Recent Activity</h3>
        <p className="text-gray-500 dark:text-gray-400 text-sm">No recent activity to show.</p>
      </div>
    </div>
  );

  return (
    <div className="animate-in fade-in duration-500">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
          Welcome back, {user?.name || 'User'}
        </h1>
        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
          Here's an overview of your {user?.role === 'vendor' ? 'bidding' : 'procurement'} operations.
        </p>
      </div>

      {user?.role === 'vendor' ? renderVendorDashboard() : renderProcurementOfficerAdminDashboard()}
    </div>
  );
};

export default Dashboard;
