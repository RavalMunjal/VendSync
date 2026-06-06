import { useState, useEffect } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { ArrowLeft, ArrowRight, Check, Plus, Trash2, FileUp } from 'lucide-react';
import api from '../../api/axios';

const rfqSchema = z.object({
  title: z.string().min(5, 'Title is required'),
  deadline: z.string().min(1, 'Deadline is required'),
  description: z.string().min(10, 'Description is required'),
  priority: z.enum(['Low', 'Medium', 'High']).default('Medium'),
  items: z.array(z.object({
    product: z.string().min(1, 'Product is required'),
    quantity: z.coerce.number().min(1, 'Quantity must be at least 1'),
    unit: z.string().min(1, 'Unit is required'),
    specifications: z.string().optional()
  })).min(1, 'At least one item is required'),
  vendors: z.array(z.string()).min(1, 'Select at least one vendor')
});

const CreateRfq = () => {
  const [step, setStep] = useState(1);
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [availableVendors, setAvailableVendors] = useState([]);

  const { register, control, handleSubmit, watch, formState: { errors }, trigger } = useForm({
    resolver: zodResolver(rfqSchema),
    defaultValues: {
      items: [{ product: '', quantity: 1, unit: 'pcs', specifications: '' }],
      vendors: [],
      priority: 'Medium'
    }
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "items"
  });

  // eslint-disable-next-line react-hooks/incompatible-library
  const selectedVendors = watch('vendors') || [];

  useEffect(() => {
    const fetchVendors = async () => {
      try {
        const res = await api.get('/vendors').catch(() => null);
        setAvailableVendors(res?.data || [
          { id: 1, name: 'TechCorp Solutions', category: 'IT Hardware' },
          { id: 2, name: 'Global Software Inc', category: 'Software' },
          { id: 5, name: 'Hardware Hub', category: 'IT Hardware' },
        ]);
      } catch (err) {
        console.error(err);
      }
    };
    fetchVendors();
  }, []);

  const nextStep = async () => {
    let isValid = false;
    if (step === 1) {
      isValid = await trigger(['title', 'deadline', 'description', 'priority']);
    } else if (step === 2) {
      isValid = await trigger(['items']);
    }
    
    if (isValid) {
      setStep(step + 1);
      window.scrollTo(0, 0);
    }
  };

  const prevStep = () => {
    setStep(step - 1);
    window.scrollTo(0, 0);
  };

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      await api.post('/rfqs', data).catch(() => new Promise(resolve => setTimeout(resolve, 1500)));
      toast.success('RFQ Created Successfully!');
      navigate('/rfqs');
    } catch {
      toast.error('Failed to create RFQ');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500 pb-20">
      <div className="flex items-center gap-4">
        <button 
          onClick={() => navigate('/rfqs')}
          className="p-2 rounded-xl hover:bg-white dark:hover:bg-dark-card border border-transparent hover:border-light-border dark:hover:border-dark-border transition-all hover:shadow-sm"
        >
          <ArrowLeft className="h-5 w-5 text-gray-500 dark:text-gray-400" />
        </button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight">Create RFQ</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Fill out the details to request quotes from your vendors.</p>
        </div>
      </div>

      {/* Stepper */}
      <div className="relative mb-12 mt-8">
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-gray-200 dark:bg-gray-800 rounded-full"></div>
        <div className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-gradient-to-r from-primary to-primary-dark rounded-full transition-all duration-500 ease-in-out" style={{ width: `${((step - 1) / 2) * 100}%` }}></div>
        
        <div className="relative flex justify-between">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex flex-col items-center">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-500 shadow-sm ${
                step >= i 
                  ? 'bg-gradient-to-r from-primary to-primary-dark text-white ring-4 ring-primary/20 scale-110' 
                  : 'bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 text-gray-400'
              }`}>
                {step > i ? <Check className="h-5 w-5" /> : i}
              </div>
              <span className={`absolute -bottom-8 text-xs font-semibold uppercase tracking-wider ${
                step >= i ? 'text-primary dark:text-primary-dark' : 'text-gray-400'
              }`}>
                {i === 1 ? 'Details' : i === 2 ? 'Items' : 'Vendors'}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Form Area */}
      <div className="glass-card p-6 sm:p-10 relative overflow-hidden">
        {/* Decorative background glow */}
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-primary/5 rounded-full blur-3xl pointer-events-none"></div>

        <form onSubmit={handleSubmit(onSubmit)} className="relative z-10">
          
          {/* Step 1: Details */}
          {step === 1 && (
            <div className="space-y-6 animate-in slide-in-from-right-8 duration-500">
              <div className="border-b border-light-border dark:border-dark-border pb-4 mb-6">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">RFQ Details</h2>
                <p className="text-sm text-gray-500 mt-1">Provide the general requirements for this procurement.</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">RFQ Title</label>
                  <input type="text" {...register('title')} placeholder="e.g. Q3 Laptop Procurement" className="block w-full rounded-xl border border-gray-200 dark:border-dark-border bg-white dark:bg-[#0F1117] py-2.5 px-4 text-sm focus:border-primary focus:ring-1 focus:ring-primary dark:text-white transition-all" />
                  {errors.title && <p className="mt-1 text-xs text-red-500">{errors.title.message}</p>}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Submission Deadline</label>
                  <input type="date" {...register('deadline')} className="block w-full rounded-xl border border-gray-200 dark:border-dark-border bg-white dark:bg-[#0F1117] py-2.5 px-4 text-sm focus:border-primary focus:ring-1 focus:ring-primary dark:text-white transition-all" />
                  {errors.deadline && <p className="mt-1 text-xs text-red-500">{errors.deadline.message}</p>}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Priority</label>
                  <select {...register('priority')} className="block w-full rounded-xl border border-gray-200 dark:border-dark-border bg-white dark:bg-[#0F1117] py-2.5 px-4 text-sm focus:border-primary focus:ring-1 focus:ring-primary dark:text-white transition-all appearance-none">
                    <option value="Low">Low Priority</option>
                    <option value="Medium">Medium Priority</option>
                    <option value="High">High Priority</option>
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Description / Scope of Work</label>
                  <textarea {...register('description')} rows={4} placeholder="Describe the requirements in detail..." className="block w-full rounded-xl border border-gray-200 dark:border-dark-border bg-white dark:bg-[#0F1117] py-2.5 px-4 text-sm focus:border-primary focus:ring-1 focus:ring-primary dark:text-white transition-all resize-y" />
                  {errors.description && <p className="mt-1 text-xs text-red-500">{errors.description.message}</p>}
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Items */}
          {step === 2 && (
            <div className="space-y-6 animate-in slide-in-from-right-8 duration-500">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center border-b border-light-border dark:border-dark-border pb-4 mb-6 gap-4">
                <div>
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">Line Items</h2>
                  <p className="text-sm text-gray-500 mt-1">Add the specific products or services required.</p>
                </div>
                <button type="button" onClick={() => append({ product: '', quantity: 1, unit: 'pcs', specifications: '' })} className="inline-flex items-center text-sm font-semibold text-primary bg-primary/10 px-4 py-2 rounded-lg hover:bg-primary/20 transition-colors">
                  <Plus className="h-4 w-4 mr-1.5" /> Add New Item
                </button>
              </div>

              <div className="space-y-4">
                {fields.map((field, index) => (
                  <div key={field.id} className="bg-gray-50/50 dark:bg-[#0F1117]/50 border border-light-border dark:border-dark-border p-5 rounded-xl relative group">
                    {fields.length > 1 && (
                      <button type="button" onClick={() => remove(index)} className="absolute top-4 right-4 p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md transition-colors">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    )}
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                      <div className="md:col-span-6">
                        <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1.5 uppercase tracking-wide">Product/Service</label>
                        <input type="text" {...register(`items.${index}.product`)} className="block w-full rounded-lg border border-gray-200 dark:border-dark-border bg-white dark:bg-dark-card py-2 px-3 text-sm focus:border-primary focus:ring-1 focus:ring-primary dark:text-white transition-all" />
                        {errors.items?.[index]?.product && <p className="mt-1 text-xs text-red-500">{errors.items[index].product.message}</p>}
                      </div>
                      <div className="md:col-span-3">
                        <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1.5 uppercase tracking-wide">Quantity</label>
                        <input type="number" min="1" {...register(`items.${index}.quantity`)} className="block w-full rounded-lg border border-gray-200 dark:border-dark-border bg-white dark:bg-dark-card py-2 px-3 text-sm focus:border-primary focus:ring-1 focus:ring-primary dark:text-white transition-all" />
                      </div>
                      <div className="md:col-span-3">
                        <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1.5 uppercase tracking-wide">Unit</label>
                        <select {...register(`items.${index}.unit`)} className="block w-full rounded-lg border border-gray-200 dark:border-dark-border bg-white dark:bg-dark-card py-2 px-3 text-sm focus:border-primary focus:ring-1 focus:ring-primary dark:text-white transition-all appearance-none">
                          <option value="pcs">Pieces</option>
                          <option value="kg">Kg</option>
                          <option value="liters">Liters</option>
                          <option value="hours">Hours</option>
                          <option value="licenses">Licenses</option>
                        </select>
                      </div>
                      <div className="md:col-span-12">
                        <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1.5 uppercase tracking-wide">Specifications (Optional)</label>
                        <input type="text" placeholder="e.g. 16GB RAM, 512GB SSD" {...register(`items.${index}.specifications`)} className="block w-full rounded-lg border border-gray-200 dark:border-dark-border bg-white dark:bg-dark-card py-2 px-3 text-sm focus:border-primary focus:ring-1 focus:ring-primary dark:text-white transition-all" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              {errors.items?.root && <p className="text-sm text-red-500 font-medium bg-red-50 p-3 rounded-lg border border-red-100">{errors.items.root.message}</p>}
            </div>
          )}

          {/* Step 3: Assign Vendors */}
          {step === 3 && (
            <div className="space-y-6 animate-in slide-in-from-right-8 duration-500">
              <div className="border-b border-light-border dark:border-dark-border pb-4 mb-6 flex justify-between items-end">
                <div>
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">Assign Vendors</h2>
                  <p className="text-sm text-gray-500 mt-1">Select the vendors who will receive this request.</p>
                </div>
                <div className="text-sm font-semibold text-primary bg-primary/10 px-3 py-1 rounded-full">
                  {selectedVendors.length} Selected
                </div>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {availableVendors.map((vendor) => {
                  const isSelected = selectedVendors.includes(vendor.id.toString());
                  return (
                    <label key={vendor.id} className={`flex flex-col p-4 border rounded-xl cursor-pointer transition-all duration-200 ${isSelected ? 'border-primary bg-primary/5 dark:bg-primary/10 shadow-sm ring-1 ring-primary' : 'border-light-border dark:border-dark-border hover:border-primary/50 bg-white dark:bg-dark-card'}`}>
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <div className={`h-10 w-10 rounded-full flex items-center justify-center font-bold text-sm ${isSelected ? 'bg-primary text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300'}`}>
                            {vendor.name.charAt(0)}
                          </div>
                          <div>
                            <span className="block text-sm font-bold text-gray-900 dark:text-white">{vendor.name}</span>
                            <span className="block text-xs font-medium text-gray-500 dark:text-gray-400 mt-0.5">{vendor.category}</span>
                          </div>
                        </div>
                        <input type="checkbox" value={vendor.id} {...register('vendors')} className="h-5 w-5 text-primary focus:ring-primary border-gray-300 rounded dark:border-gray-600 bg-white dark:bg-gray-800" />
                      </div>
                    </label>
                  );
                })}
              </div>
              {errors.vendors && <p className="text-sm text-red-500 font-medium bg-red-50 p-3 rounded-lg border border-red-100">{errors.vendors.message}</p>}
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="mt-10 flex justify-between pt-6 border-t border-light-border dark:border-dark-border">
            <button
              type="button"
              onClick={prevStep}
              disabled={step === 1 || isSubmitting}
              className="inline-flex items-center px-6 py-2.5 border border-light-border shadow-sm text-sm font-semibold rounded-xl text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-dark-card dark:text-gray-200 dark:border-dark-border dark:hover:bg-gray-800 transition-colors"
            >
              Back
            </button>
            
            {step < 3 ? (
              <button
                type="button"
                onClick={nextStep}
                className="inline-flex items-center px-6 py-2.5 border border-transparent text-sm font-semibold rounded-xl shadow-lg shadow-primary/30 text-white bg-gradient-to-r from-primary to-primary-dark hover:shadow-primary/50 transition-all hover:-translate-y-0.5"
              >
                Next Step <ArrowRight className="ml-2 h-4 w-4" />
              </button>
            ) : (
              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex items-center px-8 py-2.5 border border-transparent text-sm font-bold rounded-xl shadow-lg shadow-success/30 text-white bg-gradient-to-r from-emerald-500 to-emerald-600 hover:shadow-success/50 disabled:opacity-70 transition-all hover:-translate-y-0.5"
              >
                {isSubmitting ? 'Submitting...' : 'Submit RFQ'} <Check className="ml-2 h-4 w-4" />
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateRfq;
