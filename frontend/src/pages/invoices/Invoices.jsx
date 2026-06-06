import { useState, useEffect } from 'react';
import { Search, FileText, Download, Printer } from 'lucide-react';
import { Badge } from '../../components/ui/Badge';
import { TableSkeleton } from '../../components/ui/Skeleton';
import api from '../../api/axios';

const MOCK_INVOICES = [
  { id: 'INV-2026-001', vendor: 'TechCorp Solutions', date: '2026-06-16', amount: 65000, status: 'paid', poId: 'PO-2026-001' },
  { id: 'INV-2026-002', vendor: 'Global Software Inc', date: '2026-06-18', amount: 12000, status: 'pending', poId: 'PO-2026-003' },
];

const Invoices = () => {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        const response = await api.get('/invoices').catch(() => null);
        setInvoices(response?.data || MOCK_INVOICES);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchInvoices();
  }, []);

  return (
    <div className="animate-in fade-in duration-500 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">Invoices</h1>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">Manage and track vendor payments.</p>
        </div>
      </div>

      <div className="glass-card overflow-hidden">
        <div className="p-4 border-b border-light-border dark:border-dark-border flex bg-gray-50/50 dark:bg-[#0F1117]/50">
          <div className="relative flex-1 max-w-md">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
              <Search className="h-4 w-4 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search invoices..."
              className="block w-full rounded-xl border border-gray-200 dark:border-dark-border bg-white dark:bg-dark-card py-2 pl-10 pr-3 text-sm focus:border-primary focus:ring-1 focus:ring-primary dark:text-white transition-all"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          {loading ? (
            <TableSkeleton rows={3} columns={5} />
          ) : (
            <table className="min-w-full divide-y divide-light-border dark:divide-dark-border">
              <thead className="bg-gray-50/50 dark:bg-[#0F1117]/50 uppercase text-xs tracking-wider text-gray-500 dark:text-gray-400">
                <tr>
                  <th className="px-6 py-4 font-medium text-left">Invoice ID</th>
                  <th className="px-6 py-4 font-medium text-left">Vendor & PO</th>
                  <th className="px-6 py-4 font-medium text-left">Date</th>
                  <th className="px-6 py-4 font-medium text-left">Amount</th>
                  <th className="px-6 py-4 font-medium text-left">Status</th>
                  <th className="px-6 py-4 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-light-border dark:divide-dark-border">
                {invoices.map((inv) => (
                  <tr key={inv.id} className="hover:bg-gray-50/50 dark:hover:bg-white/[0.02] transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900 dark:text-white">{inv.id}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <div className="font-bold text-gray-900 dark:text-white">{inv.vendor}</div>
                      <div className="text-gray-500 text-xs">Ref: {inv.poId}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{inv.date}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900 dark:text-white">${inv.amount.toLocaleString()}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge variant={inv.status === 'paid' ? 'success' : 'warning'}>{inv.status.toUpperCase()}</Badge>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right space-x-2">
                      <button className="p-2 text-gray-400 hover:text-primary rounded-lg hover:bg-primary/10 transition-colors inline-flex">
                        <Download className="h-4 w-4" />
                      </button>
                      <button className="p-2 text-gray-400 hover:text-primary rounded-lg hover:bg-primary/10 transition-colors inline-flex">
                        <Printer className="h-4 w-4" />
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

export default Invoices;
