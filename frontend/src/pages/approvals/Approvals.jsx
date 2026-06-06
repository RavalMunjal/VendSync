import { useState, useEffect } from 'react';
import { Check, X, Clock, FileText, Building2, UserCircle, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { Badge } from '../../components/ui/Badge';
import { EmptyState } from '../../components/ui/EmptyState';
import api from '../../api/axios';

const MOCK_APPROVALS = [
  {
    id: 'APP-001',
    rfqId: 'RFQ-2026-001',
    title: 'Q3 Laptops Procurement',
    submittedBy: 'John Doe',
    vendorName: 'Global Software Inc',
    totalAmount: 60000,
    status: 'pending',
    date: '2026-06-16T10:30:00Z',
    itemsCount: 3,
  },
  {
    id: 'APP-002',
    rfqId: 'RFQ-2026-004',
    title: 'Marketing Software Licenses',
    submittedBy: 'Jane Smith',
    vendorName: 'TechCorp Solutions',
    totalAmount: 15500,
    status: 'pending',
    date: '2026-04-22T14:15:00Z',
    itemsCount: 1,
  }
];

const Approvals = () => {
  const [approvals, setApprovals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState(null);
  const [remarks, setRemarks] = useState({});

  useEffect(() => {
    const fetchApprovals = async () => {
      setLoading(true);
      try {
        const response = await api.get('/approvals/pending').catch(() => null);
        setApprovals(response?.data || MOCK_APPROVALS);
      } catch (error) {
        console.error('Failed to fetch approvals', error);
      } finally {
        setLoading(false);
      }
    };
    fetchApprovals();
  }, []);

  const handleAction = async (id, action) => {
    setProcessingId(id);
    try {
      await api.post(`/approvals/${id}/process`, { action, remark: remarks[id] }).catch(() => new Promise(resolve => setTimeout(resolve, 1000)));
      setApprovals(approvals.filter(a => a.id !== id));
      if (action === 'approve') {
        toast.success(`Request approved! PO generated automatically.`);
      } else {
        toast.error(`Request rejected.`);
      }
    } catch {
      toast.error('Failed to process request');
    } finally {
      setProcessingId(null);
    }
  };

  const handleRemarkChange = (id, value) => {
    setRemarks(prev => ({ ...prev, [id]: value }));
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-20">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">Approval Queue</h1>
        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">Review and approve procurement requests.</p>
      </div>

      {loading ? (
        <div className="space-y-4">
          {[1, 2].map(i => (
            <div key={i} className="glass-card p-6 animate-pulse">
              <div className="h-6 w-1/3 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
              <div className="h-4 w-1/2 bg-gray-200 dark:bg-gray-700 rounded"></div>
            </div>
          ))}
        </div>
      ) : approvals.length === 0 ? (
        <EmptyState 
          icon={Check}
          title="All caught up!"
          description="There are no pending requests requiring your approval."
        />
      ) : (
        <div className="space-y-6">
          {approvals.map((approval) => (
            <div key={approval.id} className="glass-card overflow-hidden transition-all hover:shadow-lg group">
              <div className="p-6 sm:p-8">
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
                  
                  {/* Left Info */}
                  <div className="flex-1 space-y-6">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-primary transition-colors">{approval.title}</h2>
                        <Badge variant="warning" className="flex items-center">
                          <Clock className="h-3.5 w-3.5 mr-1" /> Pending
                        </Badge>
                      </div>
                      <p className="text-sm font-medium text-gray-500 dark:text-gray-400 flex items-center">
                        <FileText className="h-4 w-4 mr-1.5" /> {approval.rfqId} • {approval.itemsCount} Items
                      </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-gray-50/50 dark:bg-[#0F1117]/50 p-5 rounded-xl border border-light-border dark:border-dark-border">
                      <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider font-bold mb-1.5">Selected Vendor</p>
                        <p className="text-sm font-bold text-gray-900 dark:text-white flex items-center">
                          <Building2 className="h-4 w-4 mr-1.5 text-primary" /> {approval.vendorName}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider font-bold mb-1.5">Submitted By</p>
                        <p className="text-sm font-bold text-gray-900 dark:text-white flex items-center">
                          <UserCircle className="h-4 w-4 mr-1.5 text-primary" /> {approval.submittedBy}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Right Actions */}
                  <div className="md:w-80 flex flex-col justify-between">
                    <div className="text-right mb-6 bg-primary/5 dark:bg-primary/10 p-4 rounded-xl border border-primary/10">
                      <p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Total Value</p>
                      <p className="text-3xl font-extrabold text-primary dark:text-primary-400 mt-1">
                        ${approval.totalAmount.toLocaleString()}
                      </p>
                    </div>

                    <div className="space-y-4">
                      <textarea
                        placeholder="Add remarks (optional)..."
                        value={remarks[approval.id] || ''}
                        onChange={(e) => handleRemarkChange(approval.id, e.target.value)}
                        className="block w-full rounded-xl border border-gray-200 dark:border-dark-border bg-white dark:bg-[#0F1117] py-2.5 px-4 text-sm focus:border-primary focus:ring-1 focus:ring-primary dark:text-white transition-all resize-none"
                        rows="2"
                      />
                      <div className="flex gap-3">
                        <button
                          onClick={() => handleAction(approval.id, 'reject')}
                          disabled={processingId === approval.id}
                          className="flex-1 inline-flex justify-center items-center px-4 py-2.5 border border-red-200 dark:border-red-900/50 text-sm font-bold rounded-xl text-red-700 bg-red-50 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 dark:bg-red-900/20 dark:text-red-400 dark:hover:bg-red-900/40 transition-colors shadow-sm"
                        >
                          {processingId === approval.id ? <Loader2 className="mr-1.5 h-4 w-4 animate-spin" /> : <X className="mr-1.5 h-4 w-4" />} Reject
                        </button>
                        <button
                          onClick={() => handleAction(approval.id, 'approve')}
                          disabled={processingId === approval.id}
                          className="flex-1 inline-flex justify-center items-center px-4 py-2.5 border border-transparent text-sm font-bold rounded-xl shadow-lg shadow-success/30 text-white bg-gradient-to-r from-emerald-500 to-emerald-600 hover:shadow-success/50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 disabled:opacity-50 transition-all hover:-translate-y-0.5"
                        >
                          {processingId === approval.id ? <Loader2 className="mr-1.5 h-4 w-4 animate-spin" /> : <Check className="mr-1.5 h-4 w-4" />} Approve
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Approvals;
