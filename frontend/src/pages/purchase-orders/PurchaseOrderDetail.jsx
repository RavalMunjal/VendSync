import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Printer, Mail } from 'lucide-react';
import toast from 'react-hot-toast';

const MOCK_PO_DETAIL = {
  id: 'PO-2026-001',
  date: '2026-06-16',
  status: 'issued',
  vendor: {
    name: 'TechCorp Solutions',
    address: '123 Tech Park, Silicon Valley, CA 94025',
    email: 'contact@techcorp.com',
    phone: '+1 234-567-8900'
  },
  company: {
    name: 'BidFlow Corp',
    address: '456 Business Ave, New York, NY 10001',
    email: 'procurement@bidflow.com',
    taxId: 'US-987654321'
  },
  items: [
    { id: 1, description: 'Developer Laptops (16GB RAM, 512GB SSD)', quantity: 50, unitPrice: 1200 },
    { id: 2, description: 'Wireless Mouse', quantity: 50, unitPrice: 25 },
    { id: 3, description: 'Laptop Sleeves', quantity: 50, unitPrice: 25 },
  ],
  subtotal: 62500,
  taxRate: 0.10, // 10%
  taxAmount: 6250,
  total: 68750,
  notes: 'Payment terms: Net 30. Please include PO number on all invoices and correspondence.'
};

const PurchaseOrderDetail = () => {
  const { id } = useParams();
  const [po, setPo] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPO = async () => {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 800));
      setPo(MOCK_PO_DETAIL);
      setLoading(false);
    };
    fetchPO();
  }, [id]);

  const handlePrint = () => {
    window.print();
  };

  const handleSendEmail = () => {
    toast.success('Purchase Order sent to vendor via email!');
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    );
  }

  if (!po) return <div>Purchase Order Not Found</div>;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Non-printable Action Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 print:hidden">
        <div className="flex items-center gap-4">
          <Link 
            to="/pos"
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            <ArrowLeft className="h-5 w-5 text-gray-500 dark:text-gray-400" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Purchase Order: {po.id}</h1>
          </div>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={handleSendEmail}
            className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700 transition-colors"
          >
            <Mail className="mr-2 h-4 w-4" /> Email Vendor
          </button>
          <button 
            onClick={handlePrint}
            className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary hover:bg-primary/90 transition-colors"
          >
            <Printer className="mr-2 h-4 w-4" /> Print / PDF
          </button>
        </div>
      </div>

      {/* Printable Invoice / PO Document */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 sm:p-12 print:shadow-none print:border-0 print:p-0">
        
        {/* Header */}
        <div className="flex justify-between items-start border-b border-gray-200 pb-8 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-primary text-white rounded-lg flex items-center justify-center text-xl font-bold">B</div>
              <span className="text-2xl font-bold text-gray-900">BidFlow</span>
            </div>
            <h2 className="text-gray-900 font-semibold">{po.company.name}</h2>
            <p className="text-gray-500 text-sm whitespace-pre-line">{po.company.address}</p>
            <p className="text-gray-500 text-sm mt-1">{po.company.email}</p>
            <p className="text-gray-500 text-sm">Tax ID: {po.company.taxId}</p>
          </div>
          <div className="text-right">
            <h1 className="text-4xl font-bold text-gray-200 uppercase tracking-wider mb-2">Purchase Order</h1>
            <p className="text-gray-900 font-medium text-lg">{po.id}</p>
            <p className="text-gray-500 text-sm mt-1">Date: {po.date}</p>
          </div>
        </div>

        {/* Vendor Info */}
        <div className="mb-8">
          <h3 className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-2">Vendor Details</h3>
          <h2 className="text-gray-900 font-semibold">{po.vendor.name}</h2>
          <p className="text-gray-500 text-sm whitespace-pre-line">{po.vendor.address}</p>
          <p className="text-gray-500 text-sm mt-1">{po.vendor.email} • {po.vendor.phone}</p>
        </div>

        {/* Line Items */}
        <div className="mb-8">
          <table className="min-w-full">
            <thead>
              <tr className="border-b-2 border-gray-300">
                <th className="py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider w-1/2">Description</th>
                <th className="py-3 text-center text-xs font-bold text-gray-700 uppercase tracking-wider">Qty</th>
                <th className="py-3 text-right text-xs font-bold text-gray-700 uppercase tracking-wider">Unit Price</th>
                <th className="py-3 text-right text-xs font-bold text-gray-700 uppercase tracking-wider">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {po.items.map((item) => (
                <tr key={item.id}>
                  <td className="py-4 text-sm text-gray-900">{item.description}</td>
                  <td className="py-4 text-sm text-gray-900 text-center">{item.quantity}</td>
                  <td className="py-4 text-sm text-gray-900 text-right">${item.unitPrice.toLocaleString(undefined, {minimumFractionDigits: 2})}</td>
                  <td className="py-4 text-sm text-gray-900 text-right">${(item.quantity * item.unitPrice).toLocaleString(undefined, {minimumFractionDigits: 2})}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Totals */}
        <div className="flex justify-end mb-12">
          <div className="w-1/2 sm:w-1/3 space-y-3">
            <div className="flex justify-between text-sm text-gray-600">
              <span>Subtotal</span>
              <span>${po.subtotal.toLocaleString(undefined, {minimumFractionDigits: 2})}</span>
            </div>
            <div className="flex justify-between text-sm text-gray-600">
              <span>Tax ({(po.taxRate * 100).toFixed(0)}%)</span>
              <span>${po.taxAmount.toLocaleString(undefined, {minimumFractionDigits: 2})}</span>
            </div>
            <div className="flex justify-between text-lg font-bold text-gray-900 border-t border-gray-300 pt-3">
              <span>Total</span>
              <span>${po.total.toLocaleString(undefined, {minimumFractionDigits: 2})}</span>
            </div>
          </div>
        </div>

        {/* Footer Notes */}
        <div className="border-t border-gray-200 pt-8 mt-8 text-sm text-gray-500">
          <h3 className="font-semibold text-gray-700 mb-1">Notes & Terms</h3>
          <p>{po.notes}</p>
        </div>

      </div>
    </div>
  );
};

export default PurchaseOrderDetail;
