import React from 'react';
import '../styles/AdminDashboard.css';

const mockNotifications = [
  {
    id: 1,
    type: 'Booking',
    message: 'New booking received from user Ramesh.',
    timestamp: 'Just now',
  },
  {
    id: 2,
    type: 'Feedback',
    message: 'New feedback submitted for Electrician service.',
    timestamp: '10 mins ago',
  },
  {
    id: 3,
    type: 'Payment',
    message: 'Payment of ₹750 received from booking #BKG1254.',
    timestamp: '1 hour ago',
  },
  {
    id: 4,
    type: 'Alert',
    message: 'Service provider Ajay Kumar has updated profile.',
    timestamp: 'Yesterday',
  },
];

const Notifications = () => {
  return (
    <div className="section-wrapper">
      <header className="dashboard-header">
        <h1>Notifications</h1>
        <p>Stay up to date with recent activities and updates</p>
      </header>

      <div className="notifications-list">
        {mockNotifications.map((notif) => (
          <div className="notification-card" key={notif.id}>
            <div className="notification-type">{notif.type}</div>
            <div className="notification-message">{notif.message}</div>
            <div className="notification-time">{notif.timestamp}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Notifications;
