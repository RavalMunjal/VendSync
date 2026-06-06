import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Mail, Lock, User, Briefcase, Loader2, Eye, EyeOff } from 'lucide-react';

const registerSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string(),
  role: z.enum(['procurement_officer', 'vendor', 'manager', 'admin'], {
    required_error: "Role is required",
  }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

const Register = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(registerSchema)
  });

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      // Simulating API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success('Registration successful! Please sign in.');
      navigate('/login');
    } catch (error) {
      toast.error('Registration failed.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-light-bg dark:bg-dark-bg">
      {/* Left Pane - Animated Gradient */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-dark-bg">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 to-purple-900 opacity-90"></div>
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-20"></div>
        
        <div className="relative z-10 flex flex-col justify-center px-16 text-white w-full">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/10 backdrop-blur-md mb-8 border border-white/20 shadow-xl">
            <span className="text-3xl font-extrabold text-white">B</span>
          </div>
          <h1 className="text-5xl font-extrabold tracking-tight mb-6 leading-tight">
            Join the <br />
            <span className="text-indigo-300">BidFlow</span> Network
          </h1>
          <p className="text-lg text-indigo-100 max-w-lg leading-relaxed">
            Create an account to start managing your procurement workflows or submit bids as a vendor on our modern platform.
          </p>
        </div>
      </div>

      {/* Right Pane - Form */}
      <div className="flex flex-1 items-center justify-center p-8 sm:p-12 overflow-y-auto">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center lg:text-left">
            <div className="lg:hidden flex h-12 w-12 mx-auto items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-indigo-700 text-white mb-6">
              <span className="text-2xl font-bold">B</span>
            </div>
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
              Create an account
            </h2>
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              Sign up to get started.
            </p>
          </div>

          <div className="flex rounded-xl bg-gray-100 p-1 dark:bg-gray-800/50 mb-8">
            <Link to="/login" className="w-1/2 flex items-center justify-center rounded-lg py-2 text-sm font-medium text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-all">
              Sign In
            </Link>
            <div className="w-1/2 flex items-center justify-center rounded-lg bg-white py-2 text-sm font-medium shadow dark:bg-gray-700 dark:text-white text-gray-900 transition-all">
              Sign Up
            </div>
          </div>
          
          <form className="mt-8 space-y-5" onSubmit={handleSubmit(onSubmit)}>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Full Name</label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
                  <User className="h-5 w-5 text-gray-400" aria-hidden="true" />
                </div>
                <input
                  type="text"
                  {...register('name')}
                  className="block w-full rounded-xl border border-gray-200 dark:border-dark-border bg-white dark:bg-dark-card py-2.5 pl-11 pr-4 text-sm focus:border-primary focus:ring-1 focus:ring-primary dark:text-white transition-all"
                  placeholder="John Doe"
                />
              </div>
              {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Email address</label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
                  <Mail className="h-5 w-5 text-gray-400" aria-hidden="true" />
                </div>
                <input
                  type="email"
                  {...register('email')}
                  className="block w-full rounded-xl border border-gray-200 dark:border-dark-border bg-white dark:bg-dark-card py-2.5 pl-11 pr-4 text-sm focus:border-primary focus:ring-1 focus:ring-primary dark:text-white transition-all"
                  placeholder="name@company.com"
                />
              </div>
              {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Select Role</label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
                  <Briefcase className="h-5 w-5 text-gray-400" aria-hidden="true" />
                </div>
                <select
                  {...register('role')}
                  className="block w-full rounded-xl border border-gray-200 dark:border-dark-border bg-white dark:bg-dark-card py-2.5 pl-11 pr-4 text-sm focus:border-primary focus:ring-1 focus:ring-primary dark:text-white transition-all appearance-none"
                >
                  <option value="">Select a role...</option>
                  <option value="procurement_officer">Procurement Officer</option>
                  <option value="vendor">Vendor</option>
                  <option value="manager">Manager</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              {errors.role && <p className="mt-1 text-sm text-red-500">{errors.role.message}</p>}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Password</label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
                    <Lock className="h-5 w-5 text-gray-400" aria-hidden="true" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    {...register('password')}
                    className="block w-full rounded-xl border border-gray-200 dark:border-dark-border bg-white dark:bg-dark-card py-2.5 pl-11 pr-3 text-sm focus:border-primary focus:ring-1 focus:ring-primary dark:text-white transition-all"
                    placeholder="••••••••"
                  />
                </div>
                {errors.password && <p className="mt-1 text-sm text-red-500">{errors.password.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Confirm</label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
                    <Lock className="h-5 w-5 text-gray-400" aria-hidden="true" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    {...register('confirmPassword')}
                    className="block w-full rounded-xl border border-gray-200 dark:border-dark-border bg-white dark:bg-dark-card py-2.5 pl-11 pr-3 text-sm focus:border-primary focus:ring-1 focus:ring-primary dark:text-white transition-all"
                    placeholder="••••••••"
                  />
                </div>
                {errors.confirmPassword && <p className="mt-1 text-sm text-red-500">{errors.confirmPassword.message}</p>}
              </div>
            </div>

            <div className="flex items-center justify-end">
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="text-xs text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 flex items-center">
                {showPassword ? <><EyeOff className="h-3 w-3 mr-1" /> Hide Passwords</> : <><Eye className="h-3 w-3 mr-1" /> Show Passwords</>}
              </button>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isLoading}
                className="flex w-full justify-center items-center rounded-xl bg-gradient-to-r from-primary to-primary-dark py-3 px-4 text-sm font-semibold text-white shadow-lg shadow-primary/30 hover:shadow-primary/50 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-70 disabled:cursor-not-allowed transition-all hover:-translate-y-0.5"
              >
                {isLoading ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  'Create Account'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
