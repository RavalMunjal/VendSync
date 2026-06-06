import { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import StatCard from '../../components/ui/StatCard';
import { DollarSign, TrendingDown, Users, Package } from 'lucide-react';
import api from '../../api/axios';

const MOCK_DATA = [
  { name: 'Jan', spend: 4000, savings: 2400 },
  { name: 'Feb', spend: 3000, savings: 1398 },
  { name: 'Mar', spend: 2000, savings: 9800 },
  { name: 'Apr', spend: 2780, savings: 3908 },
  { name: 'May', spend: 1890, savings: 4800 },
  { name: 'Jun', spend: 2390, savings: 3800 },
];

const Analytics = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(false);
  }, []);

  return (
    <div className="animate-in fade-in duration-500 space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">Reports & Analytics</h1>
        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">Detailed insights into procurement operations and spending.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard loading={loading} title="Total Spend YTD" value="$1.2M" icon={DollarSign} color={{ bg: 'bg-primary/10', text: 'text-primary' }} glowColor="glow-border-purple" />
        <StatCard loading={loading} title="Cost Savings" value="$145K" icon={TrendingDown} color={{ bg: 'bg-success/10', text: 'text-success' }} glowColor="glow-border-green" />
        <StatCard loading={loading} title="Active Vendors" value="124" icon={Users} color={{ bg: 'bg-info/10', text: 'text-info' }} glowColor="glow-border-blue" />
        <StatCard loading={loading} title="Total POs" value="450" icon={Package} color={{ bg: 'bg-warning/10', text: 'text-warning' }} glowColor="glow-border-amber" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass-card p-6">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6">Spend vs Savings Trend</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={MOCK_DATA}>
                <CartesianGrid strokeDasharray="3 3" stroke="#2A2D3E" vertical={false} />
                <XAxis dataKey="name" stroke="#6B7280" tickLine={false} axisLine={false} />
                <YAxis stroke="#6B7280" tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ backgroundColor: '#1A1D27', borderColor: '#2A2D3E', borderRadius: '12px', color: '#fff' }} />
                <Line type="monotone" dataKey="spend" stroke="#6366F1" strokeWidth={3} dot={false} />
                <Line type="monotone" dataKey="savings" stroke="#10B981" strokeWidth={3} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass-card p-6">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6">Monthly Procurement Volume</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={MOCK_DATA}>
                <defs>
                  <linearGradient id="colorVol" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.2}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#2A2D3E" vertical={false} />
                <XAxis dataKey="name" stroke="#6B7280" tickLine={false} axisLine={false} />
                <YAxis stroke="#6B7280" tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ backgroundColor: '#1A1D27', borderColor: '#2A2D3E', borderRadius: '12px', color: '#fff' }} />
                <Bar dataKey="spend" fill="url(#colorVol)" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
