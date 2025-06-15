import React, { useState } from 'react';
import '../styles/AdminDashboard.css';
import DashboardOverview from '../subpages/DashboardOverview';
import ServiceProviders from '../subpages/ServiceProviders';
import Customers from '../subpages/Customers';
import Bookings from '../subpages/Bookings';
import Services from '../subpages/Services';
// import Notifications from '../subpages/Notifications';
import Payments from '../subpages/Payments';
import Feedback from '../subpages/Feedback';
// import Reports from '../subpages/Reports';
// import Settings from '../subpages/Settings';
import HelpQueries from '../subpages/HelpQueries';

const AdminDashboard = () => {
  const [activeSection, setActiveSection] = useState('Dashboard');

  const handleLogout = () => {
    // Clear auth/token if implemented
    console.log('Admin logged out');
    window.location.href = '/login'; // Redirect to login page (adjust path if needed)
  };

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
      // case 'Notifications':
      //   return <Notifications />;
      case 'Payments':
        return <Payments />;
      // case 'Feedback':
      //   return <Feedback />;
      // case 'Invoices':
      //   return <Reports />;
      // case 'Settings':
      //   return <Settings />;
      case 'HelpQueries':
        return <HelpQueries />;
      default:
        return <div>Welcome to the Admin Panel!</div>;
    }
  };

  return (
    <div className="dashboard-container">
      <aside className="sidebar">
        <div className="sidebar-content">
          <h2>Admin Panel</h2>
          <ul>
            {[
              'Dashboard',
              'Service Providers',
              'Customers',
              'Bookings',
              'Services',
              // 'Notifications',
              'Payments',
              // 'Feedback',
              // 'Invoices',
              // 'Settings',
              'HelpQueries',
            ].map(section => (
              <li
                key={section}
                onClick={() => setActiveSection(section)}
                className={activeSection === section ? 'active' : ''}
              >
                {section}
              </li>
            ))}
          </ul>
        </div>
        <button className="logout-button" onClick={handleLogout}>
          Logout
        </button>
      </aside>
      <main className="main-content">{renderSection()}</main>
    </div>
  );
};

export default AdminDashboard;
