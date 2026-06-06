import React, { useState, useEffect } from 'react';
import { Check, X, Clock, FileText, Building2, UserCircle } from 'lucide-react';
import toast from 'react-hot-toast';

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
      await new Promise(resolve => setTimeout(resolve, 800));
      setApprovals(MOCK_APPROVALS);
      setLoading(false);
    };
    fetchApprovals();
  }, []);

  const handleAction = async (id, action) => {
    setProcessingId(id);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setApprovals(approvals.filter(a => a.id !== id));
      if (action === 'approve') {
        toast.success(`Request approved! PO generated automatically.`);
      } else {
        toast.error(`Request rejected.`);
      }
    } catch (error) {
      toast.error('Failed to process request');
    } finally {
      setProcessingId(null);
    }
  };

  const handleRemarkChange = (id, value) => {
    setRemarks(prev => ({ ...prev, [id]: value }));
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Approval Queue</h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Review and approve procurement requests.</p>
      </div>

      {loading ? (
        <div className="space-y-4">
          {[1, 2].map(i => (
            <div key={i} className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-100 dark:border-gray-700 animate-pulse">
              <div className="h-6 w-1/3 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
              <div className="h-4 w-1/2 bg-gray-200 dark:bg-gray-700 rounded"></div>
            </div>
          ))}
        </div>
      ) : approvals.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 rounded-xl p-12 text-center border border-gray-100 dark:border-gray-700 shadow-sm">
          <Check className="mx-auto h-12 w-12 text-gray-300 dark:text-gray-600 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">All caught up!</h3>
          <p className="text-gray-500 dark:text-gray-400 mt-2">There are no pending requests requiring your approval.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {approvals.map((approval) => (
            <div key={approval.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden transition-all hover:shadow-md">
              <div className="p-6">
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                  
                  {/* Left Info */}
                  <div className="flex-1 space-y-4">
                    <div>
                      <div className="flex items-center gap-3 mb-1">
                        <h2 className="text-lg font-bold text-gray-900 dark:text-white">{approval.title}</h2>
                        <span className="px-2.5 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400 border border-amber-200 dark:border-amber-800">
                          <Clock className="h-3.5 w-3.5 mr-1" /> Pending Review
                        </span>
                      </div>
                      <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center">
                        <FileText className="h-4 w-4 mr-1.5" /> {approval.rfqId} • {approval.itemsCount} Items
                      </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-gray-50 dark:bg-gray-900/50 p-4 rounded-lg border border-gray-100 dark:border-gray-700/50">
                      <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider font-semibold mb-1">Selected Vendor</p>
                        <p className="text-sm font-medium text-gray-900 dark:text-white flex items-center">
                          <Building2 className="h-4 w-4 mr-1.5 text-primary" /> {approval.vendorName}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider font-semibold mb-1">Submitted By</p>
                        <p className="text-sm font-medium text-gray-900 dark:text-white flex items-center">
                          <UserCircle className="h-4 w-4 mr-1.5 text-primary" /> {approval.submittedBy}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Right Actions */}
                  <div className="md:w-72 flex flex-col justify-between">
                    <div className="text-right mb-4">
                      <p className="text-sm text-gray-500 dark:text-gray-400">Total Value</p>
                      <p className="text-3xl font-bold text-primary dark:text-primary-400">
                        ${approval.totalAmount.toLocaleString()}
                      </p>
                    </div>

                    <div className="space-y-3">
                      <textarea
                        placeholder="Add remarks (optional)..."
                        value={remarks[approval.id] || ''}
                        onChange={(e) => handleRemarkChange(approval.id, e.target.value)}
                        className="w-full text-sm rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary dark:bg-gray-700 dark:border-gray-600 dark:text-white border px-3 py-2"
                        rows="2"
                      />
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleAction(approval.id, 'reject')}
                          disabled={processingId === approval.id}
                          className="flex-1 inline-flex justify-center items-center px-4 py-2 border border-red-200 text-sm font-medium rounded-md text-red-700 bg-red-50 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800 dark:hover:bg-red-900/40 transition-colors"
                        >
                          <X className="mr-1.5 h-4 w-4" /> Reject
                        </button>
                        <button
                          onClick={() => handleAction(approval.id, 'approve')}
                          disabled={processingId === approval.id}
                          className="flex-1 inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 disabled:opacity-50 transition-colors"
                        >
                          <Check className="mr-1.5 h-4 w-4" /> Approve
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
