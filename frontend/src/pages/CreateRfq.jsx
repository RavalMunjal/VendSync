import React, { useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { ArrowLeft, ArrowRight, Check, Plus, Trash2, FileUp } from 'lucide-react';

const MOCK_VENDORS = [
  { id: 1, name: 'TechCorp Solutions', category: 'IT Hardware' },
  { id: 2, name: 'Global Software Inc', category: 'Software' },
  { id: 5, name: 'Hardware Hub', category: 'IT Hardware' },
];

const rfqSchema = z.object({
  title: z.string().min(5, 'Title is required'),
  deadline: z.string().min(1, 'Deadline is required'),
  description: z.string().min(10, 'Description is required'),
  items: z.array(z.object({
    product: z.string().min(1, 'Product is required'),
    quantity: z.coerce.number().min(1, 'Quantity must be at least 1'),
    unit: z.string().min(1, 'Unit is required'),
  })).min(1, 'At least one item is required'),
  vendors: z.array(z.string()).min(1, 'Select at least one vendor')
});

const CreateRfq = () => {
  const [step, setStep] = useState(1);
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register, control, handleSubmit, watch, formState: { errors }, trigger } = useForm({
    resolver: zodResolver(rfqSchema),
    defaultValues: {
      items: [{ product: '', quantity: 1, unit: 'pcs' }],
      vendors: []
    }
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "items"
  });

  const selectedVendors = watch('vendors');

  const nextStep = async () => {
    let isValid = false;
    if (step === 1) {
      isValid = await trigger(['title', 'deadline', 'description']);
    } else if (step === 2) {
      isValid = await trigger(['items']);
    }
    
    if (isValid) {
      setStep(step + 1);
    }
  };

  const prevStep = () => {
    setStep(step - 1);
  };

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      toast.success('RFQ Created Successfully!');
      navigate('/rfqs');
    } catch (error) {
      toast.error('Failed to create RFQ');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex items-center gap-4">
        <button 
          onClick={() => navigate('/rfqs')}
          className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        >
          <ArrowLeft className="h-5 w-5 text-gray-500 dark:text-gray-400" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Create Request for Quotation</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">Fill out the details to request quotes from vendors.</p>
        </div>
      </div>

      {/* Stepper */}
      <div className="mb-8">
        <div className="flex items-center justify-between relative">
          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-gray-200 dark:bg-gray-700 -z-10"></div>
          <div className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-primary -z-10 transition-all duration-300" style={{ width: `${((step - 1) / 2) * 100}%` }}></div>
          
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex flex-col items-center">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm transition-colors shadow-sm ${
                step >= i ? 'bg-primary text-white' : 'bg-gray-200 text-gray-500 dark:bg-gray-700 dark:text-gray-400'
              }`}>
                {step > i ? <Check className="h-5 w-5" /> : i}
              </div>
              <span className="mt-2 text-xs font-medium text-gray-500 dark:text-gray-400">
                {i === 1 ? 'Details' : i === 2 ? 'Items' : 'Vendors'}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Form Area */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 sm:p-8">
        <form onSubmit={handleSubmit(onSubmit)}>
          
          {/* Step 1: Details */}
          {step === 1 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white border-b pb-4 dark:border-gray-700">RFQ Details</h2>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">RFQ Title</label>
                <input type="text" {...register('title')} placeholder="e.g. Q3 Laptop Procurement" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white border px-3 py-2" />
                {errors.title && <p className="mt-1 text-sm text-red-500">{errors.title.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Submission Deadline</label>
                <input type="date" {...register('deadline')} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white border px-3 py-2" />
                {errors.deadline && <p className="mt-1 text-sm text-red-500">{errors.deadline.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Description / Scope of Work</label>
                <textarea {...register('description')} rows={4} placeholder="Describe the requirements in detail..." className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white border px-3 py-2" />
                {errors.description && <p className="mt-1 text-sm text-red-500">{errors.description.message}</p>}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Attachments (Optional)</label>
                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md dark:border-gray-600">
                  <div className="space-y-1 text-center">
                    <FileUp className="mx-auto h-12 w-12 text-gray-400" />
                    <div className="flex text-sm text-gray-600 dark:text-gray-400 justify-center">
                      <label htmlFor="file-upload" className="relative cursor-pointer bg-white dark:bg-gray-800 rounded-md font-medium text-primary hover:text-primary/80 focus-within:outline-none">
                        <span>Upload a file</span>
                        <input id="file-upload" name="file-upload" type="file" className="sr-only" />
                      </label>
                      <p className="pl-1">or drag and drop</p>
                    </div>
                    <p className="text-xs text-gray-500">PDF, DOCX, XLSX up to 10MB</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Items */}
          {step === 2 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
              <div className="flex justify-between items-center border-b pb-4 dark:border-gray-700">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Line Items</h2>
                <button type="button" onClick={() => append({ product: '', quantity: 1, unit: 'pcs' })} className="inline-flex items-center text-sm font-medium text-primary hover:text-primary/80">
                  <Plus className="h-4 w-4 mr-1" /> Add Item
                </button>
              </div>

              {fields.map((field, index) => (
                <div key={field.id} className="flex flex-col sm:flex-row gap-4 items-start sm:items-end bg-gray-50 dark:bg-gray-700/30 p-4 rounded-lg">
                  <div className="flex-1 w-full">
                    <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Product/Service Name</label>
                    <input type="text" {...register(`items.${index}.product`)} className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white border px-3 py-2" />
                    {errors.items?.[index]?.product && <p className="mt-1 text-xs text-red-500">{errors.items[index].product.message}</p>}
                  </div>
                  <div className="w-full sm:w-32">
                    <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Quantity</label>
                    <input type="number" min="1" {...register(`items.${index}.quantity`)} className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white border px-3 py-2" />
                  </div>
                  <div className="w-full sm:w-32">
                    <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Unit</label>
                    <select {...register(`items.${index}.unit`)} className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white border px-3 py-2">
                      <option value="pcs">Pieces</option>
                      <option value="kg">Kg</option>
                      <option value="liters">Liters</option>
                      <option value="hours">Hours</option>
                      <option value="licenses">Licenses</option>
                    </select>
                  </div>
                  <button type="button" onClick={() => remove(index)} disabled={fields.length === 1} className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
              ))}
              {errors.items?.root && <p className="text-sm text-red-500">{errors.items.root.message}</p>}
            </div>
          )}

          {/* Step 3: Assign Vendors */}
          {step === 3 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white border-b pb-4 dark:border-gray-700">Assign Vendors</h2>
              
              <div className="space-y-3">
                {MOCK_VENDORS.map((vendor) => (
                  <label key={vendor.id} className={`flex items-center p-4 border rounded-lg cursor-pointer transition-colors ${selectedVendors.includes(vendor.id.toString()) ? 'border-primary bg-primary/5 dark:bg-primary/10' : 'border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50'}`}>
                    <input type="checkbox" value={vendor.id} {...register('vendors')} className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded dark:border-gray-600 dark:bg-gray-700" />
                    <div className="ml-3 flex flex-col">
                      <span className="text-sm font-medium text-gray-900 dark:text-white">{vendor.name}</span>
                      <span className="text-xs text-gray-500 dark:text-gray-400">{vendor.category}</span>
                    </div>
                  </label>
                ))}
              </div>
              {errors.vendors && <p className="mt-1 text-sm text-red-500">{errors.vendors.message}</p>}
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="mt-8 flex justify-between pt-6 border-t border-gray-100 dark:border-gray-700">
            <button
              type="button"
              onClick={prevStep}
              disabled={step === 1 || isSubmitting}
              className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700 transition-colors"
            >
              Back
            </button>
            
            {step < 3 ? (
              <button
                type="button"
                onClick={nextStep}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors"
              >
                Next Step <ArrowRight className="ml-2 h-4 w-4" />
              </button>
            ) : (
              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 disabled:opacity-70 transition-colors"
              >
                {isSubmitting ? 'Submitting...' : 'Create RFQ'} <Check className="ml-2 h-4 w-4" />
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateRfq;
