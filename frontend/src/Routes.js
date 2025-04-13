import React from 'react';
import { Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import LoginSignup from './pages/LoginSignup';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/login-signup" element={<LoginSignup />} /> 
    </Routes>
  );
};

export default AppRoutes;
