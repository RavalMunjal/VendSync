import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Mail, Lock, Loader2, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required')
});

const Login = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  
  const from = location.state?.from?.pathname || '/';

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(loginSchema)
  });

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      // Simulating API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      let role = 'procurement_officer';
      if (data.email.includes('vendor')) role = 'vendor';
      if (data.email.includes('manager')) role = 'manager';
      if (data.email.includes('admin')) role = 'admin';

      const mockToken = 'mock_jwt_token_for_hackathon';
      const userData = {
        id: '1',
        name: data.email.split('@')[0],
        email: data.email,
        role: role
      };
      
      login(userData, mockToken);
      toast.success('Login successful!');
      navigate(from, { replace: true });
    } catch (error) {
      toast.error('Invalid email or password.');
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
            Next-Generation <br />
            <span className="text-indigo-300">Procurement</span> ERP
          </h1>
          <p className="text-lg text-indigo-100 max-w-lg leading-relaxed">
            BidFlow streamlines your vendor management, RFQ tracking, and purchase order generation in one beautiful, intuitive dashboard.
          </p>
          
          <div className="mt-16 flex gap-4">
            <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full backdrop-blur-sm border border-white/10">
              <div className="w-2 h-2 rounded-full bg-emerald-400"></div>
              <span className="text-sm font-medium text-white">System Operational</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right Pane - Form */}
      <div className="flex flex-1 items-center justify-center p-8 sm:p-12">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center lg:text-left">
            <div className="lg:hidden flex h-12 w-12 mx-auto items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-indigo-700 text-white mb-6">
              <span className="text-2xl font-bold">B</span>
            </div>
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
              Welcome back
            </h2>
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              Please enter your details to sign in.
            </p>
          </div>

          <div className="flex rounded-xl bg-gray-100 p-1 dark:bg-gray-800/50 mb-8">
            <div className="w-1/2 flex items-center justify-center rounded-lg bg-white py-2 text-sm font-medium shadow dark:bg-gray-700 dark:text-white text-gray-900 transition-all">
              Sign In
            </div>
            <Link to="/register" className="w-1/2 flex items-center justify-center rounded-lg py-2 text-sm font-medium text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-all">
              Sign Up
            </Link>
          </div>
          
          <form className="mt-8 space-y-5" onSubmit={handleSubmit(onSubmit)}>
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
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Password</label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
                  <Lock className="h-5 w-5 text-gray-400" aria-hidden="true" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  {...register('password')}
                  className="block w-full rounded-xl border border-gray-200 dark:border-dark-border bg-white dark:bg-dark-card py-2.5 pl-11 pr-11 text-sm focus:border-primary focus:ring-1 focus:ring-primary dark:text-white transition-all"
                  placeholder="••••••••"
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
              {errors.password && <p className="mt-1 text-sm text-red-500">{errors.password.message}</p>}
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary dark:border-gray-600 dark:bg-gray-800"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-600 dark:text-gray-400">
                  Remember me
                </label>
              </div>

              <div className="text-sm">
                <a href="#" className="font-medium text-primary hover:text-primary-dark transition-colors">
                  Forgot password?
                </a>
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="flex w-full justify-center items-center rounded-xl bg-gradient-to-r from-primary to-primary-dark py-3 px-4 text-sm font-semibold text-white shadow-lg shadow-primary/30 hover:shadow-primary/50 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-70 disabled:cursor-not-allowed transition-all hover:-translate-y-0.5"
              >
                {isLoading ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  'Sign In'
                )}
              </button>
            </div>
          </form>
          
          <p className="text-center text-xs text-gray-500 dark:text-gray-500 mt-6">
            Demo hints: <br/>
            admin@test.com | manager@test.com | vendor@test.com
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
