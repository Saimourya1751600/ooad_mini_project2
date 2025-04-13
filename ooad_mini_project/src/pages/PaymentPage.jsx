import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/PaymentPage.css'; // Create this CSS file for styling

const PaymentPage = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { bookingId, amount, serviceName } = state || {};
  const [paymentMethod, setPaymentMethod] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handlePaymentSubmit = async (e) => {
    e.preventDefault();

    if (!paymentMethod) {
      setError('Please select a payment method');
      return;
    }

    const paymentData = {
      bookingId,
      amount,
      paymentMethod,
      paymentStatus: 'SUCCESS', // Simulate success and update database
    };

    try {
      setLoading(true);
      setError(null);

      // Remove Authorization header
      await axios.post('http://localhost:8080/api/payments', paymentData, {
        headers: {
          'Content-Type': 'application/json',
          // Removed 'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
      });

      // Redirect to customer dashboard or success page
      navigate('/customer-dashboard', {
        state: { paymentSuccess: true, serviceName },
      });
    } catch (err) {
      console.error('Payment error:', err);
      setError(`Payment failed: ${err.response?.data?.message || err.message}`);
    } finally {
      setLoading(false);
    }
  };

  if (!bookingId || !amount) {
    return <div className="error-message">Invalid payment details. Please try booking again.</div>;
  }

  return (
    <div className="payment-page-container">
      <h2>Payment for {serviceName}</h2>
      <div className="payment-details">
        <p>Booking ID: {bookingId}</p>
        <p>Amount: ₹{amount}</p>
      </div>

      {error && <div className="error-message">{error}</div>}

      <form className="payment-form" onSubmit={handlePaymentSubmit}>
        <div className="form-group">
          <label>Select Payment Method:</label>
          <select
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value)}
            required
          >
            <option value="">-- Select --</option>
            <option value="UPI">UPI</option>
            <option value="CARD">Credit/Debit Card</option>
            <option value="CASH">Cash on Service</option>
          </select>
        </div>

        <button
          type="submit"
          className="payment-submit-btn"
          disabled={loading}
        >
          {loading ? 'Processing...' : 'Confirm Payment'}
        </button>
      </form>
    </div>
  );
};

export default PaymentPage;