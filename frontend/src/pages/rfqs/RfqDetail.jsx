import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Clock, FileText, CheckCircle, Package, Building2 } from 'lucide-react';

const MOCK_RFQ_DETAIL = {
  id: 'RFQ-2026-001',
  title: 'Q3 Laptops Procurement',
  date: '2026-06-01',
  deadline: '2026-06-15',
  status: 'open',
  description: 'We are looking to procure 50 high-performance laptops for our new engineering team. The laptops must have at least 16GB RAM and 512GB SSD.',
  items: [
    { id: 1, product: 'Developer Laptops (16GB RAM, 512GB SSD)', quantity: 50, unit: 'pcs' },
    { id: 2, product: 'Wireless Mouse', quantity: 50, unit: 'pcs' },
    { id: 3, product: 'Laptop Sleeves', quantity: 50, unit: 'pcs' },
  ],
  vendors: [
    { id: 1, name: 'TechCorp Solutions', status: 'submitted', price: 65000, date: '2026-06-05' },
    { id: 2, name: 'Hardware Hub', status: 'pending', price: null, date: null },
    { id: 3, name: 'Global Software Inc', status: 'submitted', price: 68000, date: '2026-06-08' },
  ]
};

const RfqDetail = () => {
  const { id } = useParams();
  const [rfq, setRfq] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API fetch
    const fetchRfq = async () => {
      setLoading(true);
      setRfq(MOCK_RFQ_DETAIL);
      setLoading(false);
    };
    fetchRfq();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    );
  }

  if (!rfq) return <div>RFQ Not Found</div>;

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Link 
          to="/rfqs"
          className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        >
          <ArrowLeft className="h-5 w-5 text-gray-500 dark:text-gray-400" />
        </Link>
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{rfq.title}</h1>
            <span className="px-2.5 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400 border border-blue-200 dark:border-blue-800 uppercase tracking-wider">
              {rfq.status}
            </span>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{rfq.id} • Created on {rfq.date}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Details & Items */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center mb-4">
              <FileText className="h-5 w-5 mr-2 text-primary" />
              Description
            </h2>
            <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
              {rfq.description}
            </p>
            
            <div className="mt-6 flex items-center p-4 bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-100 dark:border-amber-800/50">
              <Clock className="h-5 w-5 text-amber-600 dark:text-amber-500 mr-3" />
              <div>
                <p className="text-sm font-medium text-amber-800 dark:text-amber-400">Submission Deadline</p>
                <p className="text-sm text-amber-700 dark:text-amber-500">{rfq.deadline}</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center mb-4">
              <Package className="h-5 w-5 mr-2 text-primary" />
              Line Items
            </h2>
            <div className="overflow-hidden border border-gray-200 dark:border-gray-700 rounded-lg">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-900/50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">Item</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">Quantity</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">Unit</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-800 dark:divide-gray-700">
                  {rfq.items.map((item) => (
                    <tr key={item.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{item.product}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400 text-right">{item.quantity}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{item.unit}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Column - Assigned Vendors */}
        <div className="space-y-6">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center mb-4">
              <Building2 className="h-5 w-5 mr-2 text-primary" />
              Invited Vendors
            </h2>
            
            <div className="space-y-4">
              {rfq.vendors.map((vendor) => (
                <div key={vendor.id} className="p-4 border border-gray-100 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-900/50">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-sm font-medium text-gray-900 dark:text-white">{vendor.name}</h3>
                    {vendor.status === 'submitted' ? (
                      <span className="inline-flex items-center text-xs font-medium text-emerald-600 dark:text-emerald-400">
                        <CheckCircle className="h-3.5 w-3.5 mr-1" /> Submitted
                      </span>
                    ) : (
                      <span className="inline-flex items-center text-xs font-medium text-gray-500 dark:text-gray-400">
                        <Clock className="h-3.5 w-3.5 mr-1" /> Pending
                      </span>
                    )}
                  </div>
                  
                  {vendor.status === 'submitted' && (
                    <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700 flex justify-between items-center">
                      <div className="text-xs text-gray-500 dark:text-gray-400">Total Quote:</div>
                      <div className="text-sm font-bold text-gray-900 dark:text-white">${vendor.price.toLocaleString()}</div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
              <Link 
                to="/compare"
                className="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors"
              >
                Compare Quotations
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RfqDetail;
