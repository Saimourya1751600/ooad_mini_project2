import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import LoginSignup from './pages/LoginSignup';
import AdminDashboard from './pages/AdminDashboard';
import UserDashboard from './pages/CustomerDashboard';
import VendorDashboard from './pages/VendorDashboard';
import WaitingPage from './pages/WaitingPage';
import NotFound from './pages/NotFound';
import BookingPage from './pages/BookingPage';
import ProfileVendor from './pages/ProfileVendor';
import VendorServices from './pages/VendorServices';
import MyBookings from './pages/MyBookings';
import ChatComponent from './pages/ChatComponent';
import VendorChatComponent from './pages/VendorChatComponent';
import VendorPayments from './pages/VendorPayments';


import Profile from './pages/Profile';

import Help from './pages/Help'; // 👈 NEW IMPORT

function AppWrapper() {
  const location = useLocation();
  const showNavbar = location.pathname === '/';
  
  return (
    <>
      {showNavbar && <Navbar />}
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginSignup />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/customer-dashboard" element={<UserDashboard />} />
        <Route path="/user" element={<UserDashboard />} />
        <Route path="/vendor" element={<VendorDashboard />} />
        <Route path="/waiting" element={<WaitingPage />} />
        <Route path="/profile" element={<Profile/>} />
        <Route path="/profile-vendor" element={<ProfileVendor/>} />
        <Route path="/my-bookings" element={<MyBookings/>} />
        <Route path="/ChatComponent" element={<ChatComponent/>} />
        <Route path="/vendor-payments" element={<VendorPayments/>} />
      
        <Route path="/help" element={<Help/>} />
        <Route path="/vendor-services" element={<VendorServices/>} />
        <Route path="/booking/:category" element={<BookingPage />} />
        <Route path="/VendorChatComponent" element={<VendorChatComponent/>} />

      
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}

function App() {
  return (
    <Router>
      <AppWrapper />
    </Router>
  );
}

export default App;