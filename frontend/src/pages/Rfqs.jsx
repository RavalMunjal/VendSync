import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Filter, Plus, Eye, Clock, CheckCircle, XCircle } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

const MOCK_RFQS = [
  { id: 'RFQ-2026-001', title: 'Q3 Laptops Procurement', date: '2026-06-01', deadline: '2026-06-15', status: 'open', vendorsCount: 3, quotesReceived: 2 },
  { id: 'RFQ-2026-002', title: 'Office Furniture for New Branch', date: '2026-05-20', deadline: '2026-05-30', status: 'closed', vendorsCount: 5, quotesReceived: 5 },
  { id: 'RFQ-2026-003', title: 'Cloud Infrastructure Services', date: '2026-06-05', deadline: '2026-06-25', status: 'draft', vendorsCount: 0, quotesReceived: 0 },
  { id: 'RFQ-2026-004', title: 'Marketing Software Licenses', date: '2026-04-10', deadline: '2026-04-20', status: 'awarded', vendorsCount: 4, quotesReceived: 4 },
];

const getStatusBadge = (status) => {
  switch (status) {
    case 'open':
      return <span className="px-2.5 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400 border border-blue-200 dark:border-blue-800">Open</span>;
    case 'closed':
      return <span className="px-2.5 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-600">Closed</span>;
    case 'awarded':
      return <span className="px-2.5 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">Awarded</span>;
    case 'draft':
      return <span className="px-2.5 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400 border border-amber-200 dark:border-amber-800">Draft</span>;
    default:
      return null;
  }
};

const Rfqs = () => {
  const { user } = useAuth();
  const [rfqs, setRfqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  useEffect(() => {
    // Simulate API fetch
    const fetchRfqs = async () => {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 800));
      setRfqs(MOCK_RFQS);
      setLoading(false);
    };
    fetchRfqs();
  }, []);

  const filteredRfqs = rfqs.filter(r => {
    const matchesSearch = r.title.toLowerCase().includes(search.toLowerCase()) || r.id.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter ? r.status === statusFilter : true;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Requests for Quotation</h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Manage and track your procurement requests</p>
        </div>
        {(user?.role === 'procurement_officer' || user?.role === 'admin') && (
          <Link 
            to="/rfqs/create"
            className="inline-flex items-center justify-center rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-primary/90 transition-colors"
          >
            <Plus className="mr-2 h-4 w-4" />
            Create RFQ
          </Link>
        )}
      </div>

      <div className="rounded-xl bg-white shadow-sm border border-gray-100 dark:border-gray-700 dark:bg-gray-800 overflow-hidden">
        {/* Toolbar */}
        <div className="p-4 border-b border-gray-100 dark:border-gray-700 flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search by RFQ ID or Title..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="block w-full rounded-lg border border-gray-300 bg-white py-2 pl-10 pr-3 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            />
          </div>
          <div className="relative w-full sm:w-48">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <Filter className="h-5 w-5 text-gray-400" />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="block w-full rounded-lg border border-gray-300 bg-white py-2 pl-10 pr-3 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary dark:border-gray-600 dark:bg-gray-700 dark:text-white"
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
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-900/50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">RFQ ID / Title</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">Timeline</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">Status</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">Responses</th>
                <th scope="col" className="relative px-6 py-3"><span className="sr-only">Actions</span></th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-800 dark:divide-gray-700">
              {loading ? (
                Array.from({ length: 4 }).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td className="px-6 py-4 whitespace-nowrap"><div className="h-4 w-48 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div><div className="h-3 w-24 bg-gray-200 dark:bg-gray-700 rounded"></div></td>
                    <td className="px-6 py-4 whitespace-nowrap"><div className="h-4 w-32 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div><div className="h-3 w-32 bg-gray-200 dark:bg-gray-700 rounded"></div></td>
                    <td className="px-6 py-4 whitespace-nowrap"><div className="h-6 w-16 bg-gray-200 dark:bg-gray-700 rounded-full"></div></td>
                    <td className="px-6 py-4 whitespace-nowrap"><div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded"></div></td>
                    <td className="px-6 py-4 whitespace-nowrap text-right"><div className="h-4 w-8 bg-gray-200 dark:bg-gray-700 rounded inline-block"></div></td>
                  </tr>
                ))
              ) : filteredRfqs.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-8 text-center text-gray-500 dark:text-gray-400">
                    No RFQs found matching your criteria.
                  </td>
                </tr>
              ) : (
                filteredRfqs.map((rfq) => (
                  <tr key={rfq.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">{rfq.title}</div>
                      <div className="text-sm text-gray-500">{rfq.id}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 dark:text-white flex items-center">
                        <Clock className="h-3.5 w-3.5 mr-1 text-gray-400" />
                        Deadline: {rfq.deadline}
                      </div>
                      <div className="text-xs text-gray-500 mt-1">Created: {rfq.date}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(rfq.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {rfq.status === 'draft' ? (
                        <span className="text-gray-400">Not Sent</span>
                      ) : (
                        <span>{rfq.quotesReceived} / {rfq.vendorsCount} Quotes</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <Link 
                        to={`/rfqs/${rfq.id}`}
                        className="text-primary hover:text-primary/80 dark:text-indigo-400 dark:hover:text-indigo-300 flex items-center justify-end"
                      >
                        <Eye className="h-4 w-4 mr-1" /> View
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Rfqs;
