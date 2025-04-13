import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../styles/AdminDashboard.css';

const statusColors = {
  SUCCESS: '#2ecc71',
  PENDING: '#f1c40f',
  FAILED: '#e74c3c',
};

const Payments = () => {
  const [payments, setPayments] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:8080/api/payments') // Replace with your API endpoint
      .then(response => {
        setPayments(response.data);
      })
      .catch(error => {
        console.error('Error fetching payments:', error);
      });
  }, []);

  return (
    <div className="section-wrapper">
      <header className="dashboard-header">
        <h1>Payments</h1>
        <p>Track recent transactions and their statuses</p>
      </header>

      <div className="table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Payment ID</th>
              <th>Booking ID</th>
              <th>Amount (₹)</th>
              <th>Status</th>
              <th>Method</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {payments.map(payment => (
              <tr key={payment.payment_id}>
                <td>{payment.payment_id}</td>
                <td>{payment.booking_id}</td>
                <td>₹{Number(payment.amount).toFixed(2)}</td>
                <td style={{ color: statusColors[payment.payment_status], fontWeight: 'bold' }}>
                  {payment.payment_status}
                </td>
                <td>{payment.payment_method}</td>
                <td>{new Date(payment.transaction_date).toLocaleDateString('en-GB')}</td> {/* dd-mm-yyyy */}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Payments;
