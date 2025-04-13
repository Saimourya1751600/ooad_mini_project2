import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faChevronDown,
  faMoneyBillWave,
  faSearch,
  faArrowLeft,
  faFilter,
  faCircleCheck,
  faCircleXmark,
  faCircleQuestion,
} from '@fortawesome/free-solid-svg-icons';
import '../styles/VendorPayments.css';

const VendorPayments = () => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  const toggleDropdown = () => setShowDropdown(!showDropdown);

  const fetchPayments = async () => {
    try {
      setLoading(true);
      const userData = localStorage.getItem('user');
      if (!userData) throw new Error('User not logged in');

      const parsedUser = JSON.parse(userData);
      const response = await fetch(`http://localhost:8080/api/payments/provider/${parsedUser.userId}?status=${filterStatus}&search=${searchTerm}`);
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('No payments found for this provider');
        }
        throw new Error('Failed to fetch payments');
      }
      const paymentData = await response.json();
      setPayments(paymentData);
    } catch (err) {
      console.error('Error fetching payments:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchVendorProfile = async () => {
    try {
      const userData = localStorage.getItem('user');
      if (!userData) throw new Error('User not logged in');

      const parsedUser = JSON.parse(userData);
      const response = await fetch(`http://localhost:8080/api/users/${parsedUser.userId}`);
      if (!response.ok) throw new Error(`Failed to fetch vendor profile: ${response.statusText}`);

      const profileData = await response.json();
      navigate('/profile-vendor', { state: { profile: profileData } });
    } catch (err) {
      console.error('Error fetching vendor profile:', err.message);
      alert(`Failed to load profile information: ${err.message}. Please try again.`);
    }
  };

  const goToDashboard = () => navigate('/vendor-dashboard');
  const goToServices = () => navigate('/vendor-services');
  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/login');
  };

  const formatDateTime = (date, time) => {
    if (!date || !time) return 'N/A';
    const dateTime = new Date(`${date}T${time}`);
    const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return dateTime.toLocaleString('en-US', options);
  };

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case 'success': return <FontAwesomeIcon icon={faCircleCheck} className="status-icon success" />;
      case 'failed': return <FontAwesomeIcon icon={faCircleXmark} className="status-icon failed" />;
      case 'pending': return <FontAwesomeIcon icon={faCircleQuestion} className="status-icon pending" />;
      default: return <FontAwesomeIcon icon={faCircleQuestion} className="status-icon pending" />;
    }
  };

  const filteredPayments = payments.filter(payment => {
    const statusMatch = filterStatus === 'ALL' || 
      (payment.paymentStatus && payment.paymentStatus.toLowerCase() === filterStatus.toLowerCase());
    const searchMatch = searchTerm === '' || 
      (payment.bookingId && payment.bookingId.toString().includes(searchTerm)) ||
      (payment.customerName && payment.customerName.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (payment.serviceName && payment.serviceName.toLowerCase().includes(searchTerm.toLowerCase()));
    return statusMatch && searchMatch;
  });

  useEffect(() => {
    fetchPayments();
  }, [filterStatus, searchTerm]);

  return (
    <div className="vendor-payments">
      <nav className="vendor-navbar">
        <div className="logo">Urban<span>Connect_</span></div>
        <div className="profile-nav-wrapper" onClick={toggleDropdown}>
          <span className="profile-link">Profile <FontAwesomeIcon icon={faChevronDown} /></span>
          {showDropdown && (
            <div className="dropdown-menu">
              <button onClick={fetchVendorProfile}>Account</button>
              <button onClick={goToServices}>Services</button>
              <button onClick={goToDashboard}>Dashboard</button>
              <button onClick={handleLogout}>Logout</button>
            </div>
          )}
        </div>
      </nav>

      <div className="payments-header">
        <button onClick={goToDashboard} className="back-button">
          <FontAwesomeIcon icon={faArrowLeft} /> Back to Dashboard
        </button>
        <h1><FontAwesomeIcon icon={faMoneyBillWave} /> Received Payments</h1>
      </div>

      <div className="payments-controls">
        <div className="search-bar">
          <FontAwesomeIcon icon={faSearch} />
          <input
            type="text"
            placeholder="Search by booking ID, customer name, or service..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="filter-options">
          <FontAwesomeIcon icon={faFilter} />
          <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
            <option value="ALL">All Payments</option>
            <option value="SUCCESS">Successful</option>
            <option value="PENDING">Pending</option>
            <option value="FAILED">Failed</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="loading-spinner">Loading payment data...</div>
      ) : error ? (
        <div className="error-message">{error}</div>
      ) : (
        <div className="payments-list">
          {filteredPayments.length > 0 ? (
            filteredPayments.map((payment) => (
              <div className="payment-card" key={payment.paymentId || payment.bookingId}>
                <div className="payment-header">
                  <div className="payment-id">Booking #{payment.bookingId}</div>
                  <div className={`payment-status ${payment.paymentStatus?.toLowerCase()}`}>
                    {getStatusIcon(payment.paymentStatus)} {payment.paymentStatus || 'Pending'}
                  </div>
                </div>

                <div className="payment-customer-info">
                  <div className="customer-name">{payment.customerName || 'Customer'}</div>
                  <div className="service-name">{payment.serviceName || 'Service'}</div>
                </div>

                <div className="payment-details">
                  <div className="payment-date">
                    <span className="detail-label">Service Date:</span>
                    <span className="detail-value">{formatDateTime(payment.bookingDate, payment.bookingTime)}</span>
                  </div>
                  <div className="payment-method">
                    <span className="detail-label">Payment Method:</span>
                    <span className="detail-value">{payment.paymentMethod || 'N/A'}</span>
                  </div>
                  <div className="payment-amount">
                    <span className="detail-label">Amount:</span>
                    <span className="detail-value">₹{payment.amount || 'N/A'}</span>
                  </div>
                  <div className="transaction-date">
                    <span className="detail-label">Transaction Date:</span>
                    <span className="detail-value">{payment.transactionDate ? new Date(payment.transactionDate).toLocaleString() : 'N/A'}</span>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="no-payments">
              <p>No payments found matching your criteria.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default VendorPayments;