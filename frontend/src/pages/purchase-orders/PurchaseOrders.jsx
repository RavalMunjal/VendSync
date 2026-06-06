import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Eye, Filter, Package } from 'lucide-react';
import { Badge } from '../../components/ui/Badge';
import { TableSkeleton } from '../../components/ui/Skeleton';
import { EmptyState } from '../../components/ui/EmptyState';
import api from '../../api/axios';

const MOCK_POS = [
  { id: 'PO-2026-001', vendor: 'TechCorp Solutions', date: '2026-06-16', amount: 65000, status: 'issued' },
  { id: 'PO-2026-002', vendor: 'Office Depot', date: '2026-05-22', amount: 4500, status: 'fulfilled' },
  { id: 'PO-2026-003', vendor: 'Global Software Inc', date: '2026-06-10', amount: 12000, status: 'pending_invoice' },
];

const PurchaseOrders = () => {
  const [pos, setPos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  useEffect(() => {
    const fetchPOs = async () => {
      setLoading(true);
      try {
        const response = await api.get('/pos').catch(() => null);
        setPos(response?.data || MOCK_POS);
      } catch (error) {
        console.error('Failed to fetch POs', error);
      } finally {
        setLoading(false);
      }
    };
    fetchPOs();
  }, []);

  const getStatusVariant = (status) => {
    switch (status) {
      case 'issued': return 'primary';
      case 'fulfilled': return 'success';
      case 'pending_invoice': return 'warning';
      default: return 'default';
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'issued': return 'Issued';
      case 'fulfilled': return 'Fulfilled';
      case 'pending_invoice': return 'Pending Invoice';
      default: return status;
    }
  };

  const filteredPos = pos.filter(po => {
    const matchesSearch = po.id.toLowerCase().includes(search.toLowerCase()) || 
                          po.vendor.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter ? po.status === statusFilter : true;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="animate-in fade-in duration-500 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">Purchase Orders</h1>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">Track and manage issued purchase orders.</p>
        </div>
      </div>

      <div className="glass-card overflow-hidden">
        {/* Toolbar */}
        <div className="p-4 border-b border-light-border dark:border-dark-border flex flex-col sm:flex-row gap-4 bg-gray-50/50 dark:bg-[#0F1117]/50">
          <div className="relative flex-1">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
              <Search className="h-4 w-4 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search by PO Number or Vendor..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="block w-full rounded-xl border border-gray-200 dark:border-dark-border bg-white dark:bg-dark-card py-2 pl-10 pr-3 text-sm focus:border-primary focus:ring-1 focus:ring-primary dark:text-white transition-all"
            />
          </div>
          <div className="relative w-full sm:w-56">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
              <Filter className="h-4 w-4 text-gray-400" />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="block w-full rounded-xl border border-gray-200 dark:border-dark-border bg-white dark:bg-dark-card py-2 pl-10 pr-3 text-sm focus:border-primary focus:ring-1 focus:ring-primary dark:text-white transition-all appearance-none"
            >
              <option value="">All Statuses</option>
              <option value="issued">Issued</option>
              <option value="pending_invoice">Pending Invoice</option>
              <option value="fulfilled">Fulfilled</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          {loading ? (
            <TableSkeleton rows={3} columns={6} />
          ) : filteredPos.length === 0 ? (
            <EmptyState 
              icon={Package}
              title="No Purchase Orders found"
              description="We couldn't find any POs matching your search criteria."
            />
          ) : (
            <table className="min-w-full divide-y divide-light-border dark:divide-dark-border">
              <thead className="bg-gray-50/50 dark:bg-[#0F1117]/50 text-gray-500 dark:text-gray-400 border-b border-light-border dark:border-dark-border uppercase text-xs tracking-wider">
                <tr>
                  <th className="px-6 py-4 font-medium text-left">PO Number</th>
                  <th className="px-6 py-4 font-medium text-left">Vendor</th>
                  <th className="px-6 py-4 font-medium text-left">Date Issued</th>
                  <th className="px-6 py-4 font-medium text-left">Total Amount</th>
                  <th className="px-6 py-4 font-medium text-left">Status</th>
                  <th className="px-6 py-4 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-light-border dark:divide-dark-border">
                {filteredPos.map((po) => (
                  <tr key={po.id} className="hover:bg-gray-50/50 dark:hover:bg-white/[0.02] transition-colors group">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-primary dark:text-primary-400">{po.id}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900 dark:text-white flex items-center">
                      <div className="h-8 w-8 rounded-full bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-900/50 dark:to-purple-900/50 flex items-center justify-center text-primary font-bold mr-3 text-xs">
                        {po.vendor.charAt(0)}
                      </div>
                      {po.vendor}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{po.date}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900 dark:text-white">${po.amount.toLocaleString()}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge variant={getStatusVariant(po.status)}>
                        {getStatusLabel(po.status)}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <Link to={`/pos/${po.id}`} className="inline-flex items-center justify-center p-2 text-gray-400 hover:text-primary dark:hover:text-primary transition-colors rounded-lg hover:bg-primary/10">
                        <Eye className="h-4 w-4" />
                      </Link>
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

export default PurchaseOrders;
