import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Filter, Plus, Eye, Clock, FileText } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { Badge } from '../../components/ui/Badge';
import { TableSkeleton } from '../../components/ui/Skeleton';
import { EmptyState } from '../../components/ui/EmptyState';
import api from '../../api/axios';

const MOCK_RFQS = [
  { id: 'RFQ-2026-001', title: 'Q3 Laptops Procurement', date: '2026-06-01', deadline: '2026-06-15', status: 'open', vendorsCount: 3, quotesReceived: 2 },
  { id: 'RFQ-2026-002', title: 'Office Furniture for New Branch', date: '2026-05-20', deadline: '2026-05-30', status: 'closed', vendorsCount: 5, quotesReceived: 5 },
  { id: 'RFQ-2026-003', title: 'Cloud Infrastructure Services', date: '2026-06-05', deadline: '2026-06-25', status: 'draft', vendorsCount: 0, quotesReceived: 0 },
  { id: 'RFQ-2026-004', title: 'Marketing Software Licenses', date: '2026-04-10', deadline: '2026-04-20', status: 'awarded', vendorsCount: 4, quotesReceived: 4 },
];

const getStatusVariant = (status) => {
  switch (status) {
    case 'open': return 'primary';
    case 'closed': return 'default';
    case 'awarded': return 'success';
    case 'draft': return 'warning';
    default: return 'default';
  }
};

const Rfqs = () => {
  const { user } = useAuth();
  const [rfqs, setRfqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  useEffect(() => {
    const fetchRfqs = async () => {
      setLoading(true);
      try {
        const response = await api.get('/rfqs').catch(() => null);
        setRfqs(response?.data || MOCK_RFQS);
      } catch (error) {
        console.error('Failed to fetch RFQs', error);
      } finally {
        setLoading(false);
      }
    };
    fetchRfqs();
  }, []);

  const filteredRfqs = rfqs.filter(r => {
    const matchesSearch = r.title.toLowerCase().includes(search.toLowerCase()) || r.id.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter ? r.status === statusFilter : true;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="animate-in fade-in duration-500 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">Requests for Quotation</h1>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">Manage and track your procurement requests</p>
        </div>
        {(user?.role === 'procurement_officer' || user?.role === 'admin') && (
          <Link 
            to="/rfqs/create"
            className="inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-primary to-primary-dark px-4 py-2.5 text-sm font-medium text-white shadow-lg shadow-primary/30 hover:shadow-primary/50 hover:-translate-y-0.5 transition-all"
          >
            <Plus className="mr-2 h-4 w-4" />
            Create RFQ
          </Link>
        )}
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
              placeholder="Search by RFQ ID or Title..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="block w-full rounded-xl border border-gray-200 dark:border-dark-border bg-white dark:bg-dark-card py-2 pl-10 pr-3 text-sm focus:border-primary focus:ring-1 focus:ring-primary dark:text-white transition-all"
            />
          </div>
          <div className="relative w-full sm:w-48">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
              <Filter className="h-4 w-4 text-gray-400" />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="block w-full rounded-xl border border-gray-200 dark:border-dark-border bg-white dark:bg-dark-card py-2 pl-10 pr-3 text-sm focus:border-primary focus:ring-1 focus:ring-primary dark:text-white transition-all appearance-none"
            >
              <option value="">All Statuses</option>
              <option value="open">Open</option>
              <option value="closed">Closed</option>
              <option value="awarded">Awarded</option>
              <option value="draft">Draft</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          {loading ? (
            <TableSkeleton rows={4} columns={5} />
          ) : filteredRfqs.length === 0 ? (
            <EmptyState 
              icon={FileText}
              title="No RFQs found"
              description="There are no Request for Quotations matching your search criteria."
              actionLabel={user?.role === 'procurement_officer' || user?.role === 'admin' ? "Create RFQ" : null}
              onAction={() => window.location.href = '/rfqs/create'}
            />
          ) : (
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-gray-50/50 dark:bg-[#0F1117]/50 text-gray-500 dark:text-gray-400 border-b border-light-border dark:border-dark-border uppercase text-xs tracking-wider">
                <tr>
                  <th className="px-6 py-4 font-medium">RFQ ID / Title</th>
                  <th className="px-6 py-4 font-medium">Timeline</th>
                  <th className="px-6 py-4 font-medium">Status</th>
                  <th className="px-6 py-4 font-medium">Responses</th>
                  <th className="px-6 py-4 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-light-border dark:divide-dark-border">
                {filteredRfqs.map((rfq) => (
                  <tr key={rfq.id} className="hover:bg-gray-50/50 dark:hover:bg-white/[0.02] transition-colors group">
                    <td className="px-6 py-4">
                      <div className="font-semibold text-gray-900 dark:text-white">{rfq.title}</div>
                      <div className="text-xs text-gray-500 mt-0.5">{rfq.id}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center text-gray-900 dark:text-white">
                        <Clock className="h-3.5 w-3.5 mr-1.5 text-primary" />
                        Deadline: {rfq.deadline}
                      </div>
                      <div className="text-xs text-gray-500 mt-1">Created: {rfq.date}</div>
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant={getStatusVariant(rfq.status)}>
                        {rfq.status.charAt(0).toUpperCase() + rfq.status.slice(1)}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-gray-600 dark:text-gray-400">
                      {rfq.status === 'draft' ? (
                        <span className="text-gray-400 italic">Not Sent</span>
                      ) : (
                        <div className="flex items-center gap-2">
                          <div className="w-16 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-primary" 
                              style={{ width: `${rfq.vendorsCount > 0 ? (rfq.quotesReceived / rfq.vendorsCount) * 100 : 0}%` }}
                            />
                          </div>
                          <span className="text-xs font-medium">{rfq.quotesReceived}/{rfq.vendorsCount}</span>
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Link 
                        to={`/rfqs/${rfq.id}`}
                        className="inline-flex items-center justify-center p-2 text-gray-400 hover:text-primary dark:hover:text-primary transition-colors rounded-lg hover:bg-primary/10"
                      >
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

export default Rfqs;
