import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import toast from 'react-hot-toast';
import { ArrowLeft, Send, Save, Package } from 'lucide-react';

const MOCK_RFQ_DETAIL = {
  id: 'RFQ-2026-001',
  title: 'Q3 Laptops Procurement',
  deadline: '2026-06-15',
  description: 'We are looking to procure 50 high-performance laptops for our new engineering team. The laptops must have at least 16GB RAM and 512GB SSD.',
  items: [
    { id: 1, product: 'Developer Laptops (16GB RAM, 512GB SSD)', quantity: 50, unit: 'pcs' },
    { id: 2, product: 'Wireless Mouse', quantity: 50, unit: 'pcs' },
    { id: 3, product: 'Laptop Sleeves', quantity: 50, unit: 'pcs' },
  ],
};

const quoteSchema = z.object({
  deliveryDays: z.coerce.number().min(1, 'Delivery days required'),
  validUntil: z.string().min(1, 'Validity date required'),
  notes: z.string().optional(),
  items: z.array(z.object({
    id: z.number(),
    unitPrice: z.coerce.number().min(0.01, 'Price must be greater than 0'),
  }))
});

const SubmitQuote = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [rfq, setRfq] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register, handleSubmit, control, watch, formState: { errors }, reset } = useForm({
    resolver: zodResolver(quoteSchema)
  });

  const { fields } = useFieldArray({
    control,
    name: "items"
  });

  const watchItems = watch('items');

  useEffect(() => {
    const fetchRfq = async () => {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 800));
      setRfq(MOCK_RFQ_DETAIL);
      
      // Initialize form with items
      reset({
        deliveryDays: 14,
        validUntil: '2026-07-15',
        notes: '',
        items: MOCK_RFQ_DETAIL.items.map(item => ({ id: item.id, unitPrice: 0 }))
      });
      setLoading(false);
    };
    fetchRfq();
  }, [id, reset]);

  const calculateTotal = () => {
    if (!watchItems || !rfq) return 0;
    return watchItems.reduce((total, item, index) => {
      const quantity = rfq.items[index]?.quantity || 0;
      return total + (item.unitPrice * quantity);
    }, 0);
  };

  const onSubmit = async (data, isDraft = false) => {
    setIsSubmitting(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      if (isDraft) {
        toast.success('Draft saved successfully!');
      } else {
        toast.success('Quotation submitted successfully!');
        navigate('/rfqs');
      }
    } catch (error) {
      toast.error('Failed to save quotation');
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

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <button 
          onClick={() => navigate('/rfqs')}
          className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        >
          <ArrowLeft className="h-5 w-5 text-gray-500 dark:text-gray-400" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Submit Quotation</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">For {rfq.id}: {rfq.title}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit((data) => onSubmit(data, false))}>
        <div className="space-y-6">
          {/* RFQ Context */}
          <div className="bg-primary/5 border border-primary/20 rounded-xl p-6 dark:bg-primary/10 dark:border-primary/30">
            <h3 className="font-semibold text-primary dark:text-primary-400 mb-2">Requirement Details</h3>
            <p className="text-sm text-gray-700 dark:text-gray-300">{rfq.description}</p>
            <div className="mt-4 text-sm font-medium text-red-600 dark:text-red-400">
              Deadline: {rfq.deadline}
            </div>
          </div>

          {/* Quotation Pricing */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center mb-4">
              <Package className="h-5 w-5 mr-2 text-primary" />
              Pricing Details
            </h2>
            
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-900/50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">Item Name</th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">Quantity</th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">Unit Price ($)</th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">Total Price ($)</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-800 dark:divide-gray-700">
                  {fields.map((field, index) => {
                    const item = rfq.items[index];
                    const unitPrice = watchItems?.[index]?.unitPrice || 0;
                    const totalPrice = unitPrice * item.quantity;
                    return (
                      <tr key={field.id}>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                          {item.product}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400 text-right">
                          {item.quantity} {item.unit}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-right">
                          <input type="hidden" {...register(`items.${index}.id`)} />
                          <input 
                            type="number" 
                            step="0.01"
                            {...register(`items.${index}.unitPrice`)} 
                            className="block w-32 ml-auto rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white border px-3 py-1.5 text-right" 
                          />
                          {errors.items?.[index]?.unitPrice && <p className="mt-1 text-xs text-red-500">{errors.items[index].unitPrice.message}</p>}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white text-right">
                          ${totalPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </td>
                      </tr>
                    );
                  })}
                  <tr className="bg-gray-50 dark:bg-gray-900/50">
                    <td colSpan="3" className="px-4 py-4 text-right text-sm font-bold text-gray-900 dark:text-white">Grand Total:</td>
                    <td className="px-4 py-4 text-right text-lg font-bold text-primary dark:text-primary-400">
                      ${calculateTotal().toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Terms & Conditions */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Terms & Conditions</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Estimated Delivery (Days)</label>
                <input 
                  type="number" 
                  {...register('deliveryDays')} 
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white border px-3 py-2" 
                />
                {errors.deliveryDays && <p className="mt-1 text-sm text-red-500">{errors.deliveryDays.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Quote Valid Until</label>
                <input 
                  type="date" 
                  {...register('validUntil')} 
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white border px-3 py-2" 
                />
                {errors.validUntil && <p className="mt-1 text-sm text-red-500">{errors.validUntil.message}</p>}
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Additional Notes</label>
                <textarea 
                  {...register('notes')} 
                  rows={3} 
                  placeholder="Any terms, warranties, or special conditions..."
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white border px-3 py-2" 
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={handleSubmit((data) => onSubmit(data, true))}
              disabled={isSubmitting}
              className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700 transition-colors"
            >
              <Save className="mr-2 h-4 w-4" /> Save as Draft
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary hover:bg-primary/90 disabled:opacity-70 transition-colors"
            >
              {isSubmitting ? 'Submitting...' : 'Submit Quotation'} <Send className="ml-2 h-4 w-4" />
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default SubmitQuote;
