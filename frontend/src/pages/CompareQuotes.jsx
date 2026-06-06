import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { ArrowLeft, CheckCircle, Award, Clock, DollarSign } from 'lucide-react';
import clsx from 'clsx';

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
      await new Promise(resolve => setTimeout(resolve, 800));
      setData(MOCK_COMPARISON_DATA);
      setLoading(false);
    };
    fetchData();
  }, []);

  const handleSelectWinner = async (vendorId, vendorName) => {
    if (!window.confirm(`Are you sure you want to select ${vendorName} as the winner and send this for approval?`)) {
      return;
    }

    setIsSubmitting(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      toast.success(`${vendorName} selected as winner! Sent for Manager Approval.`);
      navigate('/rfqs');
    } catch (error) {
      toast.error('Failed to process selection.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    );
  }

  if (!data) return null;

  // Find lowest price and fastest delivery to highlight them
  const lowestPrice = Math.min(...data.quotes.map(q => q.totalPrice));
  const fastestDelivery = Math.min(...data.quotes.map(q => q.deliveryDays));

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <button 
          onClick={() => navigate(-1)}
          className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        >
          <ArrowLeft className="h-5 w-5 text-gray-500 dark:text-gray-400" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Compare Quotations</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">For {data.rfqId}: {data.title}</p>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700 table-fixed">
            <thead className="bg-gray-50 dark:bg-gray-900/50">
              <tr>
                <th className="w-1/4 px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400 border-r dark:border-gray-700">
                  Criteria / Items
                </th>
                {data.quotes.map(quote => (
                  <th key={quote.vendorId} className="px-6 py-4 text-center border-r dark:border-gray-700 last:border-0 relative">
                    <div className="text-lg font-bold text-gray-900 dark:text-white">{quote.vendorName}</div>
                    <div className="text-sm text-gray-500 mt-1 flex items-center justify-center">
                      ★ {quote.rating} Rating
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-800 dark:divide-gray-700">
              
              {/* Summary Metrics */}
              <tr>
                <td className="px-6 py-4 font-semibold text-gray-900 dark:text-white border-r dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50">
                  <div className="flex items-center">
                    <DollarSign className="h-4 w-4 mr-2 text-gray-400" /> Total Price
                  </div>
                </td>
                {data.quotes.map(quote => {
                  const isLowest = quote.totalPrice === lowestPrice;
                  return (
                    <td key={quote.vendorId} className={clsx("px-6 py-4 text-center border-r dark:border-gray-700 last:border-0 font-bold text-lg", isLowest ? "text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/10" : "text-gray-900 dark:text-white")}>
                      ${quote.totalPrice.toLocaleString()}
                      {isLowest && <span className="block text-xs font-medium uppercase tracking-wider mt-1">Lowest Price</span>}
                    </td>
                  );
                })}
              </tr>
              <tr>
                <td className="px-6 py-4 font-semibold text-gray-900 dark:text-white border-r dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50">
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-2 text-gray-400" /> Delivery Time
                  </div>
                </td>
                {data.quotes.map(quote => {
                  const isFastest = quote.deliveryDays === fastestDelivery;
                  return (
                    <td key={quote.vendorId} className={clsx("px-6 py-4 text-center border-r dark:border-gray-700 last:border-0 font-medium", isFastest ? "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/10" : "text-gray-900 dark:text-white")}>
                      {quote.deliveryDays} Days
                      {isFastest && <span className="block text-xs font-medium uppercase tracking-wider mt-1">Fastest</span>}
                    </td>
                  );
                })}
              </tr>

              {/* Line Items Breakdown */}
              <tr>
                <td colSpan={data.quotes.length + 1} className="px-6 py-3 bg-gray-100 dark:bg-gray-900 font-semibold text-gray-700 dark:text-gray-300 uppercase text-xs tracking-wider">
                  Line Items Breakdown
                </td>
              </tr>
              {data.items.map((item, itemIndex) => (
                <tr key={item.id}>
                  <td className="px-6 py-4 border-r dark:border-gray-700">
                    <div className="text-sm font-medium text-gray-900 dark:text-white">{item.name}</div>
                    <div className="text-xs text-gray-500 mt-1">Qty: {item.quantity} {item.unit}</div>
                  </td>
                  {data.quotes.map(quote => {
                    const quoteItem = quote.items.find(qi => qi.id === item.id);
                    const unitPrice = quoteItem?.unitPrice || 0;
                    const itemTotal = unitPrice * item.quantity;
                    return (
                      <td key={quote.vendorId} className="px-6 py-4 text-center border-r dark:border-gray-700 last:border-0">
                        <div className="text-sm text-gray-900 dark:text-white">${itemTotal.toLocaleString()}</div>
                        <div className="text-xs text-gray-500 mt-1">@ ${unitPrice.toLocaleString()} / {item.unit}</div>
                      </td>
                    );
                  })}
                </tr>
              ))}

              {/* Notes */}
              <tr>
                <td colSpan={data.quotes.length + 1} className="px-6 py-3 bg-gray-100 dark:bg-gray-900 font-semibold text-gray-700 dark:text-gray-300 uppercase text-xs tracking-wider">
                  Terms & Notes
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4 font-semibold text-gray-900 dark:text-white border-r dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50">
                  Vendor Notes
                </td>
                {data.quotes.map(quote => (
                  <td key={quote.vendorId} className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400 border-r dark:border-gray-700 last:border-0 text-center italic">
                    {quote.notes || '-'}
                  </td>
                ))}
              </tr>

              {/* Action Row */}
              <tr>
                <td className="px-6 py-6 border-r dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50"></td>
                {data.quotes.map(quote => (
                  <td key={quote.vendorId} className="px-6 py-6 text-center border-r dark:border-gray-700 last:border-0">
                    <button
                      onClick={() => handleSelectWinner(quote.vendorId, quote.vendorName)}
                      disabled={isSubmitting}
                      className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary w-full disabled:opacity-50 transition-colors"
                    >
                      <Award className="mr-2 h-5 w-5" />
                      Select Winner
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
