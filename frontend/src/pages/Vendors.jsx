import React, { useState, useEffect } from 'react';
import { Search, Filter, Plus, Edit2, CheckCircle, XCircle, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import toast from 'react-hot-toast';

// Mock Data
const MOCK_VENDORS = [
  { id: 1, name: 'TechCorp Solutions', email: 'contact@techcorp.com', phone: '+1 234-567-8900', category: 'IT Hardware', status: 'active', rating: 4.8 },
  { id: 2, name: 'Global Software Inc', email: 'sales@globalsoft.com', phone: '+1 987-654-3210', category: 'Software', status: 'active', rating: 4.5 },
  { id: 3, name: 'Office Depot', email: 'b2b@officedepot.com', phone: '+1 555-123-4567', category: 'Office Supplies', status: 'inactive', rating: 3.9 },
  { id: 4, name: 'CloudNet Services', email: 'support@cloudnet.net', phone: '+1 444-987-6543', category: 'Services', status: 'active', rating: 4.9 },
  { id: 5, name: 'Hardware Hub', email: 'info@hardwarehub.com', phone: '+1 222-333-4444', category: 'IT Hardware', status: 'active', rating: 4.2 },
];

const vendorSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  email: z.string().email('Invalid email'),
  phone: z.string().min(10, 'Phone is required'),
  category: z.string().min(1, 'Category is required'),
  address: z.string().min(5, 'Address is required'),
});

const Vendors = () => {
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingVendor, setEditingVendor] = useState(null);

  const { register, handleSubmit, reset, formState: { errors }, setValue } = useForm({
    resolver: zodResolver(vendorSchema)
  });

  useEffect(() => {
    fetchVendors();
  }, []);

  const fetchVendors = async () => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setVendors(MOCK_VENDORS);
    } catch (error) {
      toast.error('Failed to fetch vendors');
    } finally {
      setLoading(false);
    }
  };

  const filteredVendors = vendors.filter(v => {
    const matchesSearch = v.name.toLowerCase().includes(search.toLowerCase()) || 
                          v.email.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = categoryFilter ? v.category === categoryFilter : true;
    return matchesSearch && matchesCategory;
  });

  const openModal = (vendor = null) => {
    if (vendor) {
      setEditingVendor(vendor);
      setValue('name', vendor.name);
      setValue('email', vendor.email);
      setValue('phone', vendor.phone);
      setValue('category', vendor.category);
      setValue('address', vendor.address || '123 Business Rd');
    } else {
      setEditingVendor(null);
      reset();
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingVendor(null);
    reset();
  };

  const onSubmit = async (data) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      if (editingVendor) {
        setVendors(vendors.map(v => v.id === editingVendor.id ? { ...v, ...data } : v));
        toast.success('Vendor updated successfully');
      } else {
        const newVendor = { ...data, id: Date.now(), status: 'active', rating: 0 };
        setVendors([newVendor, ...vendors]);
        toast.success('Vendor added successfully');
      }
      closeModal();
    } catch (error) {
      toast.error('Failed to save vendor');
    }
  };

  const toggleStatus = async (id, currentStatus) => {
    try {
      const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 300));
      
      setVendors(vendors.map(v => v.id === id ? { ...v, status: newStatus } : v));
      toast.success(`Vendor marked as ${newStatus}`);
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Vendors</h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Manage your supplier directory</p>
        </div>
        <button 
          onClick={() => openModal()}
          className="inline-flex items-center justify-center rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-primary/90 transition-colors"
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Vendor
        </button>
      </div>

      <div className="rounded-xl bg-white shadow-sm border border-gray-100 dark:border-gray-700 dark:bg-gray-800 overflow-hidden">
        {/* Toolbar */}
        <div className="p-4 border-b border-gray-100 dark:border-gray-700 flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search vendors..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="block w-full rounded-lg border border-gray-300 bg-white py-2 pl-10 pr-3 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            />
          </div>
          <div className="relative w-full sm:w-64">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <Filter className="h-5 w-5 text-gray-400" />
            </div>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="block w-full rounded-lg border border-gray-300 bg-white py-2 pl-10 pr-3 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            >
              <option value="">All Categories</option>
              <option value="IT Hardware">IT Hardware</option>
              <option value="Software">Software</option>
              <option value="Office Supplies">Office Supplies</option>
              <option value="Services">Services</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-900/50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">Vendor Info</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">Contact</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">Category</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">Status</th>
                <th scope="col" className="relative px-6 py-3"><span className="sr-only">Actions</span></th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-800 dark:divide-gray-700">
              {loading ? (
                // Skeletons
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td className="px-6 py-4 whitespace-nowrap"><div className="h-4 w-32 bg-gray-200 dark:bg-gray-700 rounded"></div></td>
                    <td className="px-6 py-4 whitespace-nowrap"><div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded"></div></td>
                    <td className="px-6 py-4 whitespace-nowrap"><div className="h-4 w-20 bg-gray-200 dark:bg-gray-700 rounded"></div></td>
                    <td className="px-6 py-4 whitespace-nowrap"><div className="h-6 w-16 bg-gray-200 dark:bg-gray-700 rounded-full"></div></td>
                    <td className="px-6 py-4 whitespace-nowrap text-right"><div className="h-4 w-8 bg-gray-200 dark:bg-gray-700 rounded inline-block"></div></td>
                  </tr>
                ))
              ) : filteredVendors.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-8 text-center text-gray-500 dark:text-gray-400">
                    No vendors found matching your criteria.
                  </td>
                </tr>
              ) : (
                filteredVendors.map((vendor) => (
                  <tr key={vendor.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">{vendor.name}</div>
                      <div className="text-sm text-gray-500 flex items-center mt-1">
                        ★ {vendor.rating}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 dark:text-white">{vendor.email}</div>
                      <div className="text-sm text-gray-500">{vendor.phone}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2.5 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300">
                        {vendor.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button 
                        onClick={() => toggleStatus(vendor.id, vendor.status)}
                        className={`px-2.5 py-1 inline-flex text-xs leading-5 font-semibold rounded-full border cursor-pointer hover:opacity-80 transition-opacity ${
                          vendor.status === 'active' 
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-800' 
                            : 'bg-red-50 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800'
                        }`}
                      >
                        {vendor.status === 'active' ? 'Active' : 'Inactive'}
                      </button>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button 
                        onClick={() => openModal(vendor)}
                        className="text-primary hover:text-primary/80 dark:text-indigo-400 dark:hover:text-indigo-300"
                      >
                        <Edit2 className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 dark:bg-gray-800 dark:border-gray-700 sm:px-6">
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700 dark:text-gray-300">
                Showing <span className="font-medium">1</span> to <span className="font-medium">{filteredVendors.length}</span> of <span className="font-medium">{filteredVendors.length}</span> results
              </p>
            </div>
            <div>
              <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                <button className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300 disabled:opacity-50">
                  <span className="sr-only">Previous</span>
                  <ChevronLeft className="h-5 w-5" aria-hidden="true" />
                </button>
                <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-primary text-sm font-medium text-white">
                  1
                </button>
                <button className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300 disabled:opacity-50">
                  <span className="sr-only">Next</span>
                  <ChevronRight className="h-5 w-5" aria-hidden="true" />
                </button>
              </nav>
            </div>
          </div>
        </div>
      </div>

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true" onClick={closeModal}></div>

            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

            <div className="inline-block align-bottom bg-white rounded-xl text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full dark:bg-gray-800">
              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="bg-white dark:bg-gray-800 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <div className="sm:flex sm:items-start">
                    <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                      <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white" id="modal-title">
                        {editingVendor ? 'Edit Vendor' : 'Add New Vendor'}
                      </h3>
                      <div className="mt-4 space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Company Name</label>
                          <input type="text" {...register('name')} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white border px-3 py-2" />
                          {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name.message}</p>}
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
                            <input type="email" {...register('email')} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white border px-3 py-2" />
                            {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email.message}</p>}
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Phone</label>
                            <input type="text" {...register('phone')} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white border px-3 py-2" />
                            {errors.phone && <p className="mt-1 text-sm text-red-500">{errors.phone.message}</p>}
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Category</label>
                          <select {...register('category')} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white border px-3 py-2">
                            <option value="">Select a category...</option>
                            <option value="IT Hardware">IT Hardware</option>
                            <option value="Software">Software</option>
                            <option value="Office Supplies">Office Supplies</option>
                            <option value="Services">Services</option>
                          </select>
                          {errors.category && <p className="mt-1 text-sm text-red-500">{errors.category.message}</p>}
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Address</label>
                          <textarea {...register('address')} rows={2} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white border px-3 py-2" />
                          {errors.address && <p className="mt-1 text-sm text-red-500">{errors.address.message}</p>}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700/50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse border-t border-gray-200 dark:border-gray-700">
                  <button type="submit" className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-primary text-base font-medium text-white hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary sm:ml-3 sm:w-auto sm:text-sm">
                    {editingVendor ? 'Save Changes' : 'Add Vendor'}
                  </button>
                  <button type="button" onClick={closeModal} className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700">
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Vendors;
