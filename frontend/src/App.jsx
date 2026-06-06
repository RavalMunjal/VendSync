import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Vendors from './pages/Vendors';
import Rfqs from './pages/Rfqs';
import CreateRfq from './pages/CreateRfq';
import RfqDetail from './pages/RfqDetail';
import SubmitQuote from './pages/SubmitQuote';
import CompareQuotes from './pages/CompareQuotes';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
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
              {/* Other routes will be added in subsequent phases */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Route>
          </Route>
        </Routes>
        <Toaster position="top-right" />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
