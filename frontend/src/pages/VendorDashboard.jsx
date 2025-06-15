import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/VendorDashboard.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faChevronDown,
  faCalendarCheck,
  faHistory,
  faCheckCircle,
  faClock,
  faExclamationCircle,
  faMapMarkerAlt,
  faComments
} from '@fortawesome/free-solid-svg-icons';
import VendorChatComponent from './VendorChatComponent';

const VendorDashboard = () => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [confirmedBookings, setConfirmedBookings] = useState([]);
  const [historyBookings, setHistoryBookings] = useState([]);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [activeChatBooking, setActiveChatBooking] = useState(null);
  const navigate = useNavigate();

  const toggleDropdown = () => setShowDropdown(!showDropdown);
  const toggleHistoryModal = () => setShowHistoryModal(!showHistoryModal);

  const fetchVendorProfile = async () => {
    try {
      const userData = localStorage.getItem('user');
      if (!userData) {
        console.error('No user data found in localStorage');
        throw new Error('User not logged in');
      }
      const parsedUser = JSON.parse(userData);
      if (!parsedUser.userId) {
        console.error('userId missing in user data:', parsedUser);
        throw new Error('Invalid user data');
      }
      const response = await fetch(`http://localhost:8080/api/users/${parsedUser.userId}`);
      if (!response.ok) {
        console.error('Fetch profile response:', response.status, response.statusText);
        throw new Error(`Failed to fetch vendor profile: ${response.statusText}`);
      }
      const profileData = await response.json();
      navigate('/profile-vendor', { state: { profile: profileData } });
    } catch (err) {
      console.error('Error fetching vendor profile:', err.message);
      alert(`Failed to load profile information: ${err.message}. Please try again.`);
    }
  };

  const fetchBookings = async () => {
    try {
      const userData = localStorage.getItem('user');
      if (!userData) throw new Error('User not logged in');
      const parsedUser = JSON.parse(userData);
      const response = await fetch(`http://localhost:8080/api/bookings/provider/${parsedUser.userId}`);
      if (!response.ok) throw new Error('Failed to fetch bookings');
      const bookings = await response.json();
      console.log('Bookings:', bookings); // Debug: Inspect API response
      
      // Ensure all booking objects have an ID property
      const processedBookings = bookings.map(booking => {
        // Copy the booking object to avoid mutating the original
        const processedBooking = {...booking};
        
        // If booking.id is missing but booking.bookingId exists, use that
        if (!processedBooking.id && processedBooking.bookingId) {
          processedBooking.id = processedBooking.bookingId;
        }
        
        return processedBooking;
      });
      
      setConfirmedBookings(processedBookings.filter(booking => booking.status.toLowerCase() === 'confirmed'));
      setHistoryBookings(processedBookings.filter(booking => 
        booking.status.toLowerCase() === 'completed' || 
        booking.status.toLowerCase() === 'cancelled'
      ));
    } catch (err) {
      console.error('Error fetching bookings:', err);
      alert('Failed to load bookings. Please try again.');
    }
  };

  const goToServices = () => navigate('/vendor-services');
  const goToPayments = () => navigate('/vendor-payments');
  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/login');
  };

  const getStatusIcon = (status) => {
    switch (status.toLowerCase()) {
      case 'completed':
        return <FontAwesomeIcon icon={faCheckCircle} className="status-icon completed" />;
      case 'confirmed':
        return <FontAwesomeIcon icon={faClock} className="status-icon confirmed" />;
      case 'cancelled':
        return <FontAwesomeIcon icon={faExclamationCircle} className="status-icon cancelled" />;
      default:
        return <FontAwesomeIcon icon={faClock} className="status-icon confirmed" />;
    }
  };

  const formatDateTime = (date, time) => {
    const dateTime = new Date(`${date}T${time}`);
    const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return dateTime.toLocaleString('en-US', options);
  };

  const handleLetsGo = async (location) => {
    if (location) {
      try {
        // Copy location to clipboard
        await navigator.clipboard.writeText(location);
        // Open Google Maps
        const encodedLocation = encodeURIComponent(location);
        const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodedLocation}`;
        window.open(googleMapsUrl, '_blank');
      } catch (err) {
        console.error('Failed to copy location:', err);
        alert('Location copied, but failed to open Google Maps. Please try again.');
      }
    } else {
      alert('Location not available for this booking.');
    }
  };

  const openChat = (booking) => {
    console.log("Opening chat for booking:", booking);
    if (!booking.id) {
      console.error("Booking is missing ID:", booking);
      alert("Unable to open chat: booking information is incomplete.");
      return;
    }
    setActiveChatBooking(booking);
  };

  const closeChat = () => {
    setActiveChatBooking(null);
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  return (
    <div className="vendor-dashboard">
      <nav className="vendor-navbar">
        <div className="logo">
          Urban<span>Connect_</span>
        </div>
        <div className="profile-nav-wrapper" onClick={toggleDropdown}>
          <span className="profile-link">
            Profile <FontAwesomeIcon icon={faChevronDown} />
          </span>
          {showDropdown && (
            <div className="dropdown-menu">
              <button onClick={fetchVendorProfile}>Account</button>
              <button onClick={goToServices}>Services</button>
              <button onClick={goToPayments}>Received Payments</button>
              <button onClick={handleLogout}>Logout</button>
            </div>
          )}
        </div>
      </nav>

      <header className="vendor-hero">
        <div className="vendor-hero-text">
          <h2>Welcome, Service Provider!</h2>
          <p>Manage your services, view bookings, and keep your profile updated.</p>
        </div>
        <img src="./images/sp.png" alt="Service Illustration" className="vendor-hero-img" />
      </header>

      <section className="bookings-container">
        <div className="bookings-header">
          <h2>
            <FontAwesomeIcon icon={faCalendarCheck} /> Confirmed Bookings
          </h2>
          <button onClick={toggleHistoryModal} className="view-history-btn">
            <FontAwesomeIcon icon={faHistory} /> View Booking History
          </button>
        </div>

        <div className="bookings-list">
          {confirmedBookings.length > 0 ? (
            confirmedBookings.map((booking) => (
              <div className="booking-card" key={booking.id}>
                <div className="booking-card-header">
                  <div className="booking-customer">{booking.customerName || 'Customer'}</div>
                  <div className={`booking-status ${booking.status.toLowerCase()}`}>
                    {getStatusIcon(booking.status)} {booking.status}
                  </div>
                </div>
                <div className="booking-service-name">{booking.serviceName || 'Service'}</div>
                <div className="booking-details">
                  <div className="booking-date">
                    <span className="detail-label">Scheduled for:</span>
                    <span className="detail-value">{formatDateTime(booking.bookingDate, booking.bookingTime)}</span>
                  </div>
                  <div className="booking-price">
                    <span className="detail-label">Price:</span>
                    <span className="detail-value price">₹{booking.price || 'N/A'}</span>
                  </div>
                  <div className="booking-location">
                    <span className="detail-label">Location:</span>
                    <span className="detail-value">{booking.customerLocation || 'Not provided'}</span>
                  </div>
                </div>
                <div className="booking-actions">
                  <button className="action-btn view">View Details</button>
                  <button
                    className="action-btn chat"
                    onClick={() => openChat(booking)}
                  >
                    <FontAwesomeIcon icon={faComments} /> Chat
                  </button>
                  <button
                    className="action-btn lets-go"
                    onClick={() => handleLetsGo(booking.customerLocation)}
                  >
                    <FontAwesomeIcon icon={faMapMarkerAlt} /> Let's Go
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p>No confirmed bookings found.</p>
          )}
        </div>
      </section>

      {showHistoryModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Booking History</h3>
            <button className="close-modal-btn" onClick={toggleHistoryModal}>✖</button>
            <div className="bookings-list">
              {historyBookings.length > 0 ? (
                historyBookings.map((booking) => (
                  <div className="booking-card" key={booking.id}>
                    <div className="booking-card-header">
                      <div className="booking-customer">{booking.customerName || 'Customer'}</div>
                      <div className={`booking-status ${booking.status.toLowerCase()}`}>
                        {getStatusIcon(booking.status)} {booking.status}
                      </div>
                    </div>
                    <div className="booking-service-name">{booking.serviceName || 'Service'}</div>
                    <div className="booking-details">
                      <div className="booking-date">
                        <span className="detail-label">
                          {booking.status.toLowerCase() === 'completed' ? 'Completed on:' : 'Cancelled on:'}
                        </span>
                        <span className="detail-value">{formatDateTime(booking.bookingDate, booking.bookingTime)}</span>
                      </div>
                      <div className="booking-price">
                        <span className="detail-label">Price:</span>
                        <span className="detail-value price">₹{booking.price || 'N/A'}</span>
                      </div>
                      <div className="booking-location">
                        <span className="detail-label">Location:</span>
                        <span className="detail-value">{booking.customerLocation || 'Not provided'}</span>
                      </div>
                    </div>
                    <div className="booking-actions">
                      <button
                        className="action-btn chat"
                        onClick={() => openChat(booking)}
                      >
                        <FontAwesomeIcon icon={faComments} /> View Chat
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <p>No booking history found.</p>
              )}
            </div>
          </div>
        </div>
      )}

      {activeChatBooking && (
        <div className="chat-overlay">
          <VendorChatComponent
            bookingId={activeChatBooking.id}
            customerId={activeChatBooking.customerId}
            customerName={activeChatBooking.customerName || 'Customer'}
            onClose={closeChat}
          />
        </div>
      )}
    </div>
  );
};

export default VendorDashboard;