// src/pages/AdminDashboard.js
import React, { useState } from 'react';
import '../styles/AdminDashboard.css';
import DashboardOverview from '../subpages/DashboardOverview';
import ServiceProviders from '../subpages/ServiceProviders';
import Customers from '../subpages/Customers';
import Bookings from '../subpages/Bookings';
import Services from '../subpages/Services';
import Notifications from '../subpages/Notifications';
import Payments from '../subpages/Payments';
import Feedback from '../subpages/Feedback';
import Reports from '../subpages/Reports';
import Settings from '../subpages/Settings';

const AdminDashboard = () => {
  const [activeSection, setActiveSection] = useState('Dashboard');

  const renderSection = () => {
    switch (activeSection) {
      case 'Dashboard':
        return <DashboardOverview />;
      case 'Service Providers':
        return <ServiceProviders />;
      case 'Customers':
        return <Customers />;
      case 'Bookings':
        return <Bookings />;
      case 'Services':
        return <Services />;
      case 'Notifications':
        return <Notifications />;
      case 'Payments':
        return <Payments />;
      case 'Feedback':
        return <Feedback />;
      case 'Reports':
        return <Reports />;
      case 'Settings':
        return <Settings />;
      default:
        return <div>Welcome to the Admin Panel!</div>;
    }
  };

  return (
    <div className="dashboard-container">
      <aside className="sidebar">
        <h2>Admin Panel</h2>
        <ul>
          {[
            'Dashboard',
            'Service Providers',
            'Customers',
            'Bookings',
            'Services',
            'Notifications',
            'Payments',
            'Feedback',
            'Reports',
            'Settings',
          ].map(section => (
            <li key={section} onClick={() => setActiveSection(section)}>
              {section}
            </li>
          ))}
        </ul>
      </aside>
      <main className="main-content">{renderSection()}</main>
    </div>
  );
};

export default AdminDashboard;
