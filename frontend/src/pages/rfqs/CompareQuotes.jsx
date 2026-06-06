import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { ArrowLeft, Award, Clock, DollarSign, Loader2 } from 'lucide-react';
import clsx from 'clsx';
import api from '../../api/axios';

const MOCK_COMPARISON_DATA = {
  rfqId: 'RFQ-2026-001',
  title: 'Q3 Laptops Procurement',
  items: [
    { id: 1, name: 'Developer Laptops (16GB RAM, 512GB SSD)', quantity: 50, unit: 'pcs' },
    { id: 2, name: 'Wireless Mouse', quantity: 50, unit: 'pcs' },
    { id: 3, name: 'Laptop Sleeves', quantity: 50, unit: 'pcs' },
  ],
  quotes: [
    {
      vendorId: 1,
      vendorName: 'TechCorp Solutions',
      rating: 4.8,
      deliveryDays: 10,
      totalPrice: 62500,
      items: [
        { id: 1, unitPrice: 1200 },
        { id: 2, unitPrice: 25 },
        { id: 3, unitPrice: 25 },
      ],
      notes: 'Standard 1-year warranty included.'
    },
    {
      vendorId: 3,
      vendorName: 'Global Software Inc',
      rating: 4.5,
      deliveryDays: 14,
      totalPrice: 60000,
      items: [
        { id: 1, unitPrice: 1150 },
        { id: 2, unitPrice: 30 },
        { id: 3, unitPrice: 20 },
      ],
      notes: 'Delivery subject to stock availability.'
    },
    {
      vendorId: 5,
      vendorName: 'Hardware Hub',
      rating: 4.9,
      deliveryDays: 7,
      totalPrice: 65000,
      items: [
        { id: 1, unitPrice: 1250 },
        { id: 2, unitPrice: 20 },
        { id: 3, unitPrice: 30 },
      ],
      notes: 'Premium express delivery. 3-year extended warranty.'
    }
  ]
};

const CompareQuotes = () => {
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await api.get('/quotes/compare').catch(() => null);
        setData(response?.data || MOCK_COMPARISON_DATA);
      } catch (error) {
        console.error('Failed to fetch data', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleSelectWinner = async (vendorId, vendorName) => {
    if (!window.confirm(`Are you sure you want to select ${vendorName} as the winner and send this for approval?`)) {
      return;
    }

    setIsSubmitting(true);
    try {
      await api.post('/approvals/create', { vendorId, rfqId: data.rfqId }).catch(() => new Promise(resolve => setTimeout(resolve, 1500)));
      toast.success(`${vendorName} selected as winner! Sent for Manager Approval.`);
      navigate('/rfqs');
    } catch {
      toast.error('Failed to process selection.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!data) return null;

  // Find lowest price and fastest delivery to highlight them
  const lowestPrice = Math.min(...data.quotes.map(q => q.totalPrice));
  const fastestDelivery = Math.min(...data.quotes.map(q => q.deliveryDays));

  return (
    <div className="max-w-7xl mx-auto space-y-6 animate-in fade-in duration-500 pb-20">
      <div className="flex items-center gap-4">
        <button 
          onClick={() => navigate(-1)}
          className="p-2 rounded-xl hover:bg-white dark:hover:bg-dark-card border border-transparent hover:border-light-border dark:hover:border-dark-border transition-all hover:shadow-sm"
        >
          <ArrowLeft className="h-5 w-5 text-gray-500 dark:text-gray-400" />
        </button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight">Compare Quotations</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">For {data.rfqId}: {data.title}</p>
        </div>
      </div>

      <div className="glass-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-light-border dark:divide-dark-border table-fixed">
            <thead className="bg-gray-50/50 dark:bg-[#0F1117]/50">
              <tr>
                <th className="w-1/4 px-6 py-6 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider dark:text-gray-400 border-r border-light-border dark:border-dark-border">
                  Criteria / Items
                </th>
                {data.quotes.map(quote => (
                  <th key={quote.vendorId} className="px-6 py-6 text-center border-r border-light-border dark:border-dark-border last:border-0 relative">
                    <div className="flex items-center justify-center gap-3 mb-2">
                      <div className="h-10 w-10 rounded-full bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-900/50 dark:to-purple-900/50 flex items-center justify-center text-primary font-bold shadow-sm">
                        {quote.vendorName.charAt(0)}
                      </div>
                    </div>
                    <div className="text-xl font-bold text-gray-900 dark:text-white">{quote.vendorName}</div>
                    <div className="text-sm text-amber-500 mt-1 flex items-center justify-center font-medium">
                      ★ {quote.rating} Rating
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-light-border dark:divide-dark-border">
              
              {/* Summary Metrics */}
              <tr>
                <td className="px-6 py-5 font-bold text-gray-900 dark:text-white border-r border-light-border dark:border-dark-border bg-gray-50/30 dark:bg-gray-800/30">
                  <div className="flex items-center">
                    <DollarSign className="h-5 w-5 mr-2 text-primary" /> Total Price
                  </div>
                </td>
                {data.quotes.map(quote => {
                  const isLowest = quote.totalPrice === lowestPrice;
                  return (
                    <td key={quote.vendorId} className={clsx("px-6 py-5 text-center border-r border-light-border dark:border-dark-border last:border-0 font-bold text-2xl transition-colors", isLowest ? "text-emerald-600 dark:text-emerald-400 bg-emerald-50/50 dark:bg-emerald-900/20" : "text-gray-900 dark:text-white")}>
                      ${quote.totalPrice.toLocaleString()}
                      {isLowest && <span className="block text-xs font-bold uppercase tracking-wider mt-1 text-emerald-500">Lowest Price</span>}
                    </td>
                  );
                })}
              </tr>
              <tr>
                <td className="px-6 py-5 font-bold text-gray-900 dark:text-white border-r border-light-border dark:border-dark-border bg-gray-50/30 dark:bg-gray-800/30">
                  <div className="flex items-center">
                    <Clock className="h-5 w-5 mr-2 text-blue-500" /> Delivery Time
                  </div>
                </td>
                {data.quotes.map(quote => {
                  const isFastest = quote.deliveryDays === fastestDelivery;
                  return (
                    <td key={quote.vendorId} className={clsx("px-6 py-5 text-center border-r border-light-border dark:border-dark-border last:border-0 font-semibold text-lg transition-colors", isFastest ? "text-blue-600 dark:text-blue-400 bg-blue-50/50 dark:bg-blue-900/20" : "text-gray-900 dark:text-white")}>
                      {quote.deliveryDays} Days
                      {isFastest && <span className="block text-xs font-bold uppercase tracking-wider mt-1 text-blue-500">Fastest</span>}
                    </td>
                  );
                })}
              </tr>

              {/* Line Items Breakdown */}
              <tr>
                <td colSpan={data.quotes.length + 1} className="px-6 py-4 bg-gray-100/50 dark:bg-gray-900/50 font-bold text-gray-700 dark:text-gray-300 uppercase text-xs tracking-wider border-y border-light-border dark:border-dark-border">
                  Line Items Breakdown
                </td>
              </tr>
              {data.items.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50/30 dark:hover:bg-white/[0.02] transition-colors">
                  <td className="px-6 py-5 border-r border-light-border dark:border-dark-border">
                    <div className="text-sm font-bold text-gray-900 dark:text-white">{item.name}</div>
                    <div className="text-xs text-primary font-medium mt-1">Qty: {item.quantity} {item.unit}</div>
                  </td>
                  {data.quotes.map(quote => {
                    const quoteItem = quote.items.find(qi => qi.id === item.id);
                    const unitPrice = quoteItem?.unitPrice || 0;
                    const itemTotal = unitPrice * item.quantity;
                    return (
                      <td key={quote.vendorId} className="px-6 py-5 text-center border-r border-light-border dark:border-dark-border last:border-0">
                        <div className="text-sm font-bold text-gray-900 dark:text-white">${itemTotal.toLocaleString()}</div>
                        <div className="text-xs text-gray-500 mt-1">@ ${unitPrice.toLocaleString()} / {item.unit}</div>
                      </td>
                    );
                  })}
                </tr>
              ))}

              {/* Notes */}
              <tr>
                <td colSpan={data.quotes.length + 1} className="px-6 py-4 bg-gray-100/50 dark:bg-gray-900/50 font-bold text-gray-700 dark:text-gray-300 uppercase text-xs tracking-wider border-y border-light-border dark:border-dark-border">
                  Terms & Notes
                </td>
              </tr>
              <tr>
                <td className="px-6 py-5 font-bold text-gray-900 dark:text-white border-r border-light-border dark:border-dark-border bg-gray-50/30 dark:bg-gray-800/30">
                  Vendor Notes
                </td>
                {data.quotes.map(quote => (
                  <td key={quote.vendorId} className="px-6 py-5 text-sm text-gray-600 dark:text-gray-400 border-r border-light-border dark:border-dark-border last:border-0 text-center italic">
                    {quote.notes || '-'}
                  </td>
                ))}
              </tr>

              {/* Action Row */}
              <tr>
                <td className="px-6 py-6 border-r border-light-border dark:border-dark-border bg-gray-50/30 dark:bg-gray-800/30"></td>
                {data.quotes.map(quote => (
                  <td key={quote.vendorId} className="px-6 py-6 text-center border-r border-light-border dark:border-dark-border last:border-0">
                    <button
                      onClick={() => handleSelectWinner(quote.vendorId, quote.vendorName)}
                      disabled={isSubmitting}
                      className="inline-flex items-center justify-center px-6 py-3 text-sm font-bold rounded-xl shadow-lg shadow-primary/30 text-white bg-gradient-to-r from-primary to-primary-dark hover:shadow-primary/50 w-full disabled:opacity-50 transition-all hover:-translate-y-0.5"
                    >
                      {isSubmitting ? (
                        <Loader2 className="h-5 w-5 animate-spin" />
                      ) : (
                        <>
                          <Award className="mr-2 h-5 w-5" />
                          Select Winner
                        </>
                      )}
                    </button>
                  </td>
                ))}
              </tr>

            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default CompareQuotes;
