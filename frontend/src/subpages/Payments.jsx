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
  const [loading, setLoading] = useState(true); // To handle loading state
  const [error, setError] = useState(null); // To handle error state

  useEffect(() => {
    // Fetch payments from the backend API
    axios.get('http://localhost:8080/api/payments') // Replace with your actual backend API URL
      .then(response => {
        setPayments(response.data); // Set the payments data from the response
        setLoading(false); // Stop loading once data is fetched
      })
      .catch(error => {
        setError('Error fetching payments, please try again later.');
        setLoading(false); // Stop loading if there's an error
        console.error('Error fetching payments:', error);
      });
  }, []); // Empty dependency array ensures the effect runs once on mount

  // Render a loading spinner if the data is still being fetched
  if (loading) {
    return <div>Loading...</div>;
  }

  // Render an error message if there was an issue fetching data
  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="section-wrapper">
      <header className="dashboard-header">
        <h1>Payments</h1>
        {/* <p>Track recent transactions and their statuses</p> */}
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
            {payments.length === 0 ? (
              <tr>
                <td colSpan="6">No payments available</td>
              </tr>
            ) : (
              payments.map(payment => (
                <tr key={payment.paymentId}>
                  <td>{payment.paymentId}</td>
                  <td>{payment.bookingId}</td>
                  <td>₹{Number(payment.amount).toFixed(2)}</td>
                  <td style={{ color: statusColors[payment.paymentStatus], fontWeight: 'bold' }}>
                    {payment.paymentStatus}
                  </td>
                  <td>{payment.paymentMethod}</td>
                  <td>{new Date(payment.transactionDate).toLocaleString('en-GB')}</td> {/* dd-mm-yyyy HH:mm:ss */}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Payments;
