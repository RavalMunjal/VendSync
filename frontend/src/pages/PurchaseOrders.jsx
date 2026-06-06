import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Filter, Eye, FileText, CheckCircle, Clock } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

const MOCK_POS = [
  { id: 'PO-2026-001', vendor: 'TechCorp Solutions', date: '2026-06-16', amount: 65000, status: 'issued' },
  { id: 'PO-2026-002', vendor: 'Office Depot', date: '2026-05-22', amount: 4500, status: 'fulfilled' },
  { id: 'PO-2026-003', vendor: 'Global Software Inc', date: '2026-06-10', amount: 12000, status: 'pending_invoice' },
];

const PurchaseOrders = () => {
  const { user } = useAuth();
  const [pos, setPos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPOs = async () => {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 800));
      setPos(MOCK_POS);
      setLoading(false);
    };
    fetchPOs();
  }, []);

  const getStatusBadge = (status) => {
    switch (status) {
      case 'issued':
        return <span className="px-2.5 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400">Issued</span>;
      case 'fulfilled':
        return <span className="px-2.5 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400">Fulfilled</span>;
      case 'pending_invoice':
        return <span className="px-2.5 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400">Pending Invoice</span>;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Purchase Orders</h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Track and manage issued purchase orders.</p>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
        <div className="p-4 border-b border-gray-100 dark:border-gray-700 flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search by PO Number or Vendor..."
              className="block w-full rounded-lg border border-gray-300 bg-white py-2 pl-10 pr-3 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-900/50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">PO Number</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">Vendor</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">Date Issued</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">Total Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">Status</th>
                <th className="relative px-6 py-3"><span className="sr-only">Actions</span></th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-800 dark:divide-gray-700">
              {loading ? (
                <tr><td colSpan="6" className="px-6 py-4 text-center">Loading...</td></tr>
              ) : (
                pos.map((po) => (
                  <tr key={po.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-primary dark:text-primary-400">{po.id}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{po.vendor}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{po.date}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">${po.amount.toLocaleString()}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{getStatusBadge(po.status)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <Link to={`/pos/${po.id}`} className="text-primary hover:text-primary/80 flex items-center justify-end">
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

export default PurchaseOrders;
