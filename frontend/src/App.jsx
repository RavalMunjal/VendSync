import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './routes/ProtectedRoute';
import Layout from './components/layout/Layout';

// Lazy load pages
const Login = lazy(() => import('./pages/auth/Login'));
const Register = lazy(() => import('./pages/auth/Register'));
const Dashboard = lazy(() => import('./pages/dashboard/Dashboard'));
const Vendors = lazy(() => import('./pages/vendors/Vendors'));
const Rfqs = lazy(() => import('./pages/rfqs/Rfqs'));
const CreateRfq = lazy(() => import('./pages/rfqs/CreateRfq'));
const RfqDetail = lazy(() => import('./pages/rfqs/RfqDetail'));
const SubmitQuote = lazy(() => import('./pages/quotations/SubmitQuote'));
const CompareQuotes = lazy(() => import('./pages/rfqs/CompareQuotes'));
const Approvals = lazy(() => import('./pages/approvals/Approvals'));
const ActivityLogs = lazy(() => import('./pages/logs/ActivityLogs'));
const PurchaseOrders = lazy(() => import('./pages/purchase-orders/PurchaseOrders'));
const PurchaseOrderDetail = lazy(() => import('./pages/purchase-orders/PurchaseOrderDetail'));

// New Phase 5 Pages
const UserManagement = lazy(() => import('./pages/users/UserManagement'));
const Analytics = lazy(() => import('./pages/analytics/Analytics'));
const Settings = lazy(() => import('./pages/settings/Settings'));
const Invoices = lazy(() => import('./pages/invoices/Invoices'));

// Loading Fallback
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-light-bg dark:bg-dark-bg">
    <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
  </div>
);

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            
            <Route element={<ProtectedRoute />}>
              <Route element={<Layout />}>
                <Route path="/" element={<Dashboard />} />
                <Route path="/vendors" element={<Vendors />} />
                <Route path="/rfqs" element={<Rfqs />} />
                <Route path="/rfqs/create" element={<CreateRfq />} />
                <Route path="/rfqs/:id" element={<RfqDetail />} />
                <Route path="/submit-quote/:id" element={<SubmitQuote />} />
                <Route path="/compare" element={<CompareQuotes />} />
                <Route path="/approvals" element={<Approvals />} />
                <Route path="/logs" element={<ActivityLogs />} />
                <Route path="/pos" element={<PurchaseOrders />} />
                <Route path="/pos/:id" element={<PurchaseOrderDetail />} />
                
                {/* Phase 5 Routes */}
                <Route path="/users" element={<UserManagement />} />
                <Route path="/analytics" element={<Analytics />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="/invoices" element={<Invoices />} />

                <Route path="*" element={<Navigate to="/" replace />} />
              </Route>
            </Route>
          </Routes>
        </Suspense>
        <Toaster position="top-right" />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
