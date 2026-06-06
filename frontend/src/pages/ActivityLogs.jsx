import React, { useState, useEffect } from 'react';
import { Clock, FileText, CheckCircle, PlusCircle, AlertCircle, Building2, User } from 'lucide-react';

const MOCK_LOGS = [
  { id: 1, action: 'approved_rfq', description: 'Approved RFQ-2026-004 and generated Purchase Order PO-2026-001', user: 'Admin User', role: 'admin', timestamp: '2 mins ago', icon: CheckCircle, color: 'text-emerald-500 bg-emerald-100 dark:bg-emerald-900/30 dark:text-emerald-400' },
  { id: 2, action: 'submitted_quote', description: 'TechCorp Solutions submitted a quotation for RFQ-2026-001', user: 'TechCorp', role: 'vendor', timestamp: '1 hour ago', icon: FileText, color: 'text-blue-500 bg-blue-100 dark:bg-blue-900/30 dark:text-blue-400' },
  { id: 3, action: 'created_rfq', description: 'Created new RFQ-2026-005 for Office Supplies', user: 'John Doe', role: 'procurement_officer', timestamp: '3 hours ago', icon: PlusCircle, color: 'text-indigo-500 bg-indigo-100 dark:bg-indigo-900/30 dark:text-indigo-400' },
  { id: 4, action: 'added_vendor', description: 'Added new vendor Hardware Hub', user: 'Admin User', role: 'admin', timestamp: '1 day ago', icon: Building2, color: 'text-purple-500 bg-purple-100 dark:bg-purple-900/30 dark:text-purple-400' },
  { id: 5, action: 'rejected_rfq', description: 'Manager rejected quotation for RFQ-2026-002', user: 'Jane Smith', role: 'manager', timestamp: '2 days ago', icon: AlertCircle, color: 'text-red-500 bg-red-100 dark:bg-red-900/30 dark:text-red-400' },
];

const ActivityLogs = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLogs = async () => {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 800));
      setLogs(MOCK_LOGS);
      setLoading(false);
    };
    fetchLogs();
  }, []);

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Activity Logs</h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Track all actions and changes across the procurement system.</p>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
        {loading ? (
          <div className="space-y-8">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="flex gap-4 animate-pulse">
                <div className="h-10 w-10 bg-gray-200 dark:bg-gray-700 rounded-full flex-shrink-0"></div>
                <div className="flex-1 space-y-2 py-1">
                  <div className="h-4 w-3/4 bg-gray-200 dark:bg-gray-700 rounded"></div>
                  <div className="h-3 w-1/4 bg-gray-200 dark:bg-gray-700 rounded"></div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flow-root">
            <ul role="list" className="-mb-8">
              {logs.map((log, logIdx) => {
                const Icon = log.icon;
                return (
                  <li key={log.id}>
                    <div className="relative pb-8">
                      {logIdx !== logs.length - 1 ? (
                        <span className="absolute left-5 top-5 -ml-px h-full w-0.5 bg-gray-200 dark:bg-gray-700" aria-hidden="true" />
                      ) : null}
                      <div className="relative flex items-start space-x-3">
                        <div className="relative">
                          <div className={`h-10 w-10 rounded-full flex items-center justify-center ring-8 ring-white dark:ring-gray-800 ${log.color}`}>
                            <Icon className="h-5 w-5" aria-hidden="true" />
                          </div>
                        </div>
                        <div className="min-w-0 flex-1 py-0">
                          <div className="text-sm leading-8 text-gray-500 dark:text-gray-400">
                            <span className="mr-0.5">
                              <a href="#" className="font-medium text-gray-900 dark:text-white hover:text-primary transition-colors">
                                {log.user}
                              </a>
                            </span>{' '}
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300 capitalize mr-2">
                              {log.role.replace('_', ' ')}
                            </span>
                            <span className="whitespace-nowrap text-xs flex items-center mt-1 sm:mt-0 sm:float-right">
                              <Clock className="h-3.5 w-3.5 mr-1" />
                              {log.timestamp}
                            </span>
                          </div>
                          <div className="mt-2 text-sm text-gray-700 dark:text-gray-300">
                            <p>{log.description}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default ActivityLogs;
