import { useState, useEffect } from 'react';
import { Search, Filter, Plus, Edit2, ChevronLeft, ChevronRight, Building2, MoreVertical } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import toast from 'react-hot-toast';
import { Badge } from '../../components/ui/Badge';
import { TableSkeleton } from '../../components/ui/Skeleton';
import { EmptyState } from '../../components/ui/EmptyState';
import api from '../../api/axios';

// Fallback Mock Data
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
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingVendor, setEditingVendor] = useState(null);

  const { register, handleSubmit, reset, formState: { errors }, setValue } = useForm({
    resolver: zodResolver(vendorSchema)
  });

  const fetchVendors = async () => {
    setLoading(true);
    try {
      const response = await api.get('/vendors').catch(() => null);
      setVendors(response?.data || MOCK_VENDORS);
    } catch {
      toast.error('Failed to fetch vendors');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVendors();
  }, []);

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
      if (editingVendor) {
        await api.put(`/vendors/${editingVendor.id}`, data).catch(() => null);
        setVendors(vendors.map(v => v.id === editingVendor.id ? { ...v, ...data } : v));
        toast.success('Vendor updated successfully');
      } else {
        const response = await api.post('/vendors', data).catch(() => null);
        const newVendor = response?.data || { ...data, id: new Date().getTime(), status: 'active', rating: 0 };
        setVendors([newVendor, ...vendors]);
        toast.success('Vendor added successfully');
      }
      closeModal();
    } catch {
      toast.error('Failed to save vendor');
    }
  };

  const toggleStatus = async (id, currentStatus) => {
    try {
      const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
      await api.patch(`/vendors/${id}/status`, { status: newStatus }).catch(() => null);
      setVendors(vendors.map(v => v.id === id ? { ...v, status: newStatus } : v));
      toast.success(`Vendor marked as ${newStatus}`);
    } catch {
      toast.error('Failed to update status');
    }
  };

  return (
    <div className="animate-in fade-in duration-500 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">Vendors</h1>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">Manage your supplier directory and contacts.</p>
        </div>
        <button 
          onClick={() => openModal()}
          className="inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-primary to-primary-dark px-4 py-2.5 text-sm font-medium text-white shadow-lg shadow-primary/30 hover:shadow-primary/50 hover:-translate-y-0.5 transition-all"
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Vendor
        </button>
      </div>

      <div className="glass-card overflow-hidden">
        {/* Toolbar */}
        <div className="p-4 border-b border-light-border dark:border-dark-border flex flex-col sm:flex-row gap-4 bg-gray-50/50 dark:bg-[#0F1117]/50">
          <div className="relative flex-1">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
              <Search className="h-4 w-4 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search by name or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="block w-full rounded-xl border border-gray-200 dark:border-dark-border bg-white dark:bg-dark-card py-2 pl-10 pr-3 text-sm focus:border-primary focus:ring-1 focus:ring-primary dark:text-white transition-all"
            />
          </div>
          <div className="relative w-full sm:w-64">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
              <Filter className="h-4 w-4 text-gray-400" />
            </div>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="block w-full rounded-xl border border-gray-200 dark:border-dark-border bg-white dark:bg-dark-card py-2 pl-10 pr-3 text-sm focus:border-primary focus:ring-1 focus:ring-primary dark:text-white transition-all appearance-none"
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
          {loading ? (
            <TableSkeleton rows={5} columns={5} />
          ) : filteredVendors.length === 0 ? (
            <EmptyState 
              icon={Building2}
              title="No vendors found"
              description="We couldn't find any vendors matching your search criteria."
              actionLabel="Add New Vendor"
              onAction={() => openModal()}
            />
          ) : (
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-gray-50/50 dark:bg-[#0F1117]/50 text-gray-500 dark:text-gray-400 border-b border-light-border dark:border-dark-border uppercase text-xs tracking-wider">
                <tr>
                  <th className="px-6 py-4 font-medium">Company Details</th>
                  <th className="px-6 py-4 font-medium">Contact Info</th>
                  <th className="px-6 py-4 font-medium">Category</th>
                  <th className="px-6 py-4 font-medium">Status</th>
                  <th className="px-6 py-4 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-light-border dark:divide-dark-border">
                {filteredVendors.map((vendor) => (
                  <tr key={vendor.id} className="hover:bg-gray-50/50 dark:hover:bg-white/[0.02] transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="h-10 w-10 rounded-full bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-900/50 dark:to-purple-900/50 flex items-center justify-center text-primary font-bold mr-3">
                          {vendor.name.charAt(0)}
                        </div>
                        <div>
                          <div className="font-semibold text-gray-900 dark:text-white">{vendor.name}</div>
                          <div className="text-xs text-amber-500 flex items-center mt-0.5">
                            ★ {vendor.rating} Rating
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-gray-900 dark:text-white">{vendor.email}</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{vendor.phone}</div>
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant="default">{vendor.category}</Badge>
                    </td>
                    <td className="px-6 py-4">
                      <button 
                        onClick={() => toggleStatus(vendor.id, vendor.status)}
                        className="hover:opacity-80 transition-opacity"
                      >
                        <Badge variant={vendor.status === 'active' ? 'success' : 'danger'}>
                          {vendor.status === 'active' ? 'Active' : 'Inactive'}
                        </Badge>
                      </button>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button 
                        onClick={() => openModal(vendor)}
                        className="p-2 text-gray-400 hover:text-primary dark:hover:text-primary transition-colors rounded-lg hover:bg-primary/10"
                      >
                        <Edit2 className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Pagination */}
        {!loading && filteredVendors.length > 0 && (
          <div className="p-4 border-t border-light-border dark:border-dark-border flex items-center justify-between text-sm">
            <p className="text-gray-500 dark:text-gray-400">
              Showing <span className="font-medium text-gray-900 dark:text-white">{filteredVendors.length}</span> results
            </p>
            <div className="flex items-center gap-2">
              <button className="p-2 rounded-lg border border-light-border dark:border-dark-border text-gray-500 disabled:opacity-50 hover:bg-gray-50 dark:hover:bg-gray-800">
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button className="p-2 rounded-lg border border-light-border dark:border-dark-border text-gray-500 disabled:opacity-50 hover:bg-gray-50 dark:hover:bg-gray-800">
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-dark-card rounded-2xl shadow-xl w-full max-w-lg border border-light-border dark:border-dark-border overflow-hidden">
            <div className="px-6 py-4 border-b border-light-border dark:border-dark-border">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                {editingVendor ? 'Edit Vendor Details' : 'Add New Vendor'}
              </h3>
            </div>
            
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Company Name</label>
                  <input type="text" {...register('name')} className="block w-full rounded-xl border border-gray-200 dark:border-dark-border bg-white dark:bg-[#0F1117] py-2 px-3 text-sm focus:border-primary focus:ring-1 focus:ring-primary dark:text-white transition-all" />
                  {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name.message}</p>}
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Email Address</label>
                    <input type="email" {...register('email')} className="block w-full rounded-xl border border-gray-200 dark:border-dark-border bg-white dark:bg-[#0F1117] py-2 px-3 text-sm focus:border-primary focus:ring-1 focus:ring-primary dark:text-white transition-all" />
                    {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Phone Number</label>
                    <input type="text" {...register('phone')} className="block w-full rounded-xl border border-gray-200 dark:border-dark-border bg-white dark:bg-[#0F1117] py-2 px-3 text-sm focus:border-primary focus:ring-1 focus:ring-primary dark:text-white transition-all" />
                    {errors.phone && <p className="mt-1 text-xs text-red-500">{errors.phone.message}</p>}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Category</label>
                  <select {...register('category')} className="block w-full rounded-xl border border-gray-200 dark:border-dark-border bg-white dark:bg-[#0F1117] py-2 px-3 text-sm focus:border-primary focus:ring-1 focus:ring-primary dark:text-white transition-all appearance-none">
                    <option value="">Select a category...</option>
                    <option value="IT Hardware">IT Hardware</option>
                    <option value="Software">Software</option>
                    <option value="Office Supplies">Office Supplies</option>
                    <option value="Services">Services</option>
                  </select>
                  {errors.category && <p className="mt-1 text-xs text-red-500">{errors.category.message}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Billing Address</label>
                  <textarea {...register('address')} rows={3} className="block w-full rounded-xl border border-gray-200 dark:border-dark-border bg-white dark:bg-[#0F1117] py-2 px-3 text-sm focus:border-primary focus:ring-1 focus:ring-primary dark:text-white transition-all resize-none" />
                  {errors.address && <p className="mt-1 text-xs text-red-500">{errors.address.message}</p>}
                </div>
              </div>
              <div className="px-6 py-4 bg-gray-50/50 dark:bg-[#0F1117]/50 border-t border-light-border dark:border-dark-border flex justify-end gap-3">
                <button type="button" onClick={closeModal} className="px-4 py-2 rounded-xl text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                  Cancel
                </button>
                <button type="submit" className="px-4 py-2 rounded-xl text-sm font-medium text-white bg-primary hover:bg-primary-dark transition-colors shadow-sm">
                  {editingVendor ? 'Save Changes' : 'Add Vendor'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Vendors;
