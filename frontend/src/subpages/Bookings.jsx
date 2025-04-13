import React from 'react';
import '../styles/AdminDashboard.css';

const mockBookings = [
  {
    id: 'BK101',
    customer: 'Ananya Sharma',
    provider: 'Ravi Kumar',
    service: 'Electrician',
    date: '2025-04-10',
    status: 'Completed',
  },
  {
    id: 'BK102',
    customer: 'Rahul Verma',
    provider: 'Suman Das',
    service: 'Plumber',
    date: '2025-04-11',
    status: 'Pending',
  },
  {
    id: 'BK103',
    customer: 'Meena Kumari',
    provider: 'Ali Khan',
    service: 'Cleaner',
    date: '2025-04-12',
    status: 'In Progress',
  },
  {
    id: 'BK104',
    customer: 'Ravi Gupta',
    provider: 'Kiran Joshi',
    service: 'Carpenter',
    date: '2025-04-13',
    status: 'Cancelled',
  },
];

const statusColors = {
  Completed: '#2ecc71',
  Pending: '#f39c12',
  'In Progress': '#3498db',
  Cancelled: '#e74c3c',
};

const Bookings = () => {
  return (
    <div className="section-wrapper">
      <header className="dashboard-header">
        <h1>Bookings</h1>
        <p>Overview of service bookings</p>
      </header>

      <div className="table-wrapper">
        <table className="data-table">
          <thead>
            <tr>
              <th>Booking ID</th>
              <th>Customer</th>
              <th>Provider</th>
              <th>Service</th>
              <th>Date</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {mockBookings.map((booking) => (
              <tr key={booking.id}>
                <td>{booking.id}</td>
                <td>{booking.customer}</td>
                <td>{booking.provider}</td>
                <td>{booking.service}</td>
                <td>{booking.date}</td>
                <td style={{ color: statusColors[booking.status], fontWeight: 'bold' }}>
                  {booking.status}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Bookings;
