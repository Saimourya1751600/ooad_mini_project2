import React from 'react';
import { Routes, Route } from 'react-router-dom';

// Lazy Loading for Better Performance
import HomePage from '../src/pages/HomePage';
import LoginSignup from '../src/pages/LoginSignup';
import UserDashboard from '../src/pages/UserDashboard';
import VendorDashboard from '../src/pages/VendorDashboard';
import AdminDashboard from '../src/pages/AdminDashboard';
const NotFound = React.lazy(() => import('./pages/NotFound'));

const AppRoutes = () => {
  return (
    <React.Suspense fallback={<div>Loading...</div>}>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginSignup />} />
        <Route path="/user-dashboard" element={<UserDashboard />} />
        <Route path="/vendor-dashboard" element={<VendorDashboard />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="*" element={<NotFound />} /> {/* 404 Route */}
      </Routes>
    </React.Suspense>
  );
};

export default AppRoutes;
