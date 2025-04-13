import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../styles/AdminDashboard.css';

const Bookings = () => {
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    // Replace with your actual API endpoint to get bookings data
    axios.get('http://localhost:8080/api/bookings')
      .then(response => {
        const bookingData = response.data;
        setBookings(bookingData);
      })
      .catch(error => {
        console.error('Error fetching bookings:', error);
      });
  }, []);

  // Define status colors
  const statusColors = {
    CONFIRMED: '#2ecc71',
    CANCELLED: '#e74c3c',
    COMPLETED: '#3498db',
  };

  return (
    <div className="section-wrapper">
      <header className="dashboard-header">
        <h1>Bookings</h1>
        <p>Overview of service bookings</p>
      </header>

      <div className="table-wrapper">
        <table className="admin-table">
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
            {bookings.map((booking) => (
              <tr key={booking.booking_id}>
                <td>{booking.booking_id}</td>
                <td>{booking.customer_name}</td> {/* Assuming customer_name is provided in the response */}
                <td>{booking.provider_name}</td> {/* Assuming provider_name is provided in the response */}
                <td>{booking.service_name}</td> {/* Assuming service_name is provided in the response */}
                <td>{booking.booking_date}</td> {/* Assuming booking_date is provided in the response */}
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
