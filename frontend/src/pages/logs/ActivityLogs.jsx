import { useState, useEffect } from 'react';
import { Shield, Clock, FileText, UserCheck, Package, Trash2, Edit2, AlertTriangle } from 'lucide-react';
import api from '../../api/axios';

const MOCK_LOGS = [
  { id: 1, action: 'User logged in', user: 'Admin', role: 'admin', time: '10 mins ago', type: 'auth', icon: Shield },
  { id: 2, action: 'RFQ "Office Chairs" created', user: 'John Doe', role: 'procurement', time: '2 hours ago', type: 'rfq', icon: FileText },
  { id: 3, action: 'Vendor "TechCorp" approved', user: 'Admin', role: 'admin', time: '3 hours ago', type: 'vendor', icon: UserCheck },
  { id: 4, action: 'PO-2026-001 issued', user: 'Jane Smith', role: 'manager', time: '1 day ago', type: 'po', icon: Package },
  { id: 5, action: 'Settings updated', user: 'Admin', role: 'admin', time: '2 days ago', type: 'system', icon: Edit2 },
];

const getLogColor = (type) => {
  switch(type) {
    case 'auth': return 'bg-blue-500/10 text-blue-500';
    case 'rfq': return 'bg-purple-500/10 text-purple-500';
    case 'vendor': return 'bg-emerald-500/10 text-emerald-500';
    case 'po': return 'bg-amber-500/10 text-amber-500';
    case 'system': return 'bg-gray-500/10 text-gray-500';
    default: return 'bg-primary/10 text-primary';
  }
};

const ActivityLogs = () => {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const response = await api.get('/logs').catch(() => null);
        setLogs(response?.data || MOCK_LOGS);
      } catch (err) {
        console.error(err);
      }
    };
    fetchLogs();
  }, []);

  return (
    <div className="animate-in fade-in duration-500 space-y-6 pb-20">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">Activity Logs</h1>
        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">System-wide audit trail of all actions and events.</p>
      </div>

      <div className="glass-card p-6 sm:p-8">
        <div className="relative border-l border-light-border dark:border-dark-border ml-3 space-y-8 py-4">
          {logs.map((log) => {
            const Icon = log.icon || Clock;
            return (
              <div key={log.id} className="relative pl-8 sm:pl-10 group">
                <div className={`absolute -left-[18px] top-1 h-9 w-9 rounded-full border-4 border-white dark:border-[#0F1117] flex items-center justify-center ${getLogColor(log.type)}`}>
                  <Icon className="h-4 w-4" />
                </div>
                <div className="bg-gray-50/50 dark:bg-[#0F1117]/50 p-4 rounded-xl border border-light-border dark:border-dark-border transition-all hover:shadow-md">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <p className="text-sm font-bold text-gray-900 dark:text-white">{log.action}</p>
                    <span className="text-xs font-medium text-gray-500 flex items-center">
                      <Clock className="h-3 w-3 mr-1" /> {log.time}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                    Performed by <span className="font-semibold text-primary">{log.user}</span> ({log.role})
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ActivityLogs;
