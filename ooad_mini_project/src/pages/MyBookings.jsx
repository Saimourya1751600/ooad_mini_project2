import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faChevronLeft, 
  faCalendar, 
  faCheck, 
  faTimes, 
  faClock, 
  faMapMarkerAlt, 
  faFilter,
  faSort,
  faUser,
  faComment
} from '@fortawesome/free-solid-svg-icons';
import ChatComponent from '../pages/ChatComponent';
import '../styles/MyBookings.css';

const MyBookings = () => {
  const [activeTab, setActiveTab] = useState('upcoming');
  const [bookings, setBookings] = useState({
    upcoming: [],
    completed: [],
    cancelled: []
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterMenu, setFilterMenu] = useState(false);
  const [sortOption, setSortOption] = useState('date-desc');
  const [dateFilter, setDateFilter] = useState('');
  const [serviceFilter, setServiceFilter] = useState('');
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [activeChatBooking, setActiveChatBooking] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchBookings();
  }, [refreshTrigger]);

  const fetchBookings = async () => {
    try {
      setIsLoading(true);
      const userData = localStorage.getItem('user');
      
      if (!userData) {
        navigate('/login');
        return;
      }
      
      const parsedUser = JSON.parse(userData);
      
      const response = await fetch(`http://localhost:8080/api/bookings/customer/${parsedUser.userId}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch bookings');
      }
      
      const allBookings = await response.json();
      
      const categorizedBookings = {
        upcoming: allBookings.filter(booking => booking.status === 'CONFIRMED'),
        completed: allBookings.filter(booking => booking.status === 'COMPLETED'),
        cancelled: allBookings.filter(booking => booking.status === 'CANCELLED')
      };
      
      setBookings(categorizedBookings);
      setIsLoading(false);
    } catch (err) {
      console.error('Error fetching bookings:', err);
      setError('Failed to load your bookings. Please try again later.');
      setIsLoading(false);
    }
  };

  const handleCancelBooking = async (bookingId) => {
    if (window.confirm('Are you sure you want to cancel this booking?')) {
      try {
        const response = await fetch(`http://localhost:8080/api/bookings/${bookingId}/status?status=CANCELLED`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          }
        });
        
        if (!response.ok) {
          throw new Error('Failed to cancel booking');
        }
        
        setRefreshTrigger(prev => prev + 1);
      } catch (err) {
        console.error('Error cancelling booking:', err);
        alert('Failed to cancel booking. Please try again.');
      }
    }
  };

  const handleConfirmCompletion = async (bookingId) => {
    if (window.confirm('Are you sure you want to confirm this service as completed?')) {
      try {
        const response = await fetch(`http://localhost:8080/api/bookings/${bookingId}/status?status=COMPLETED`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          }
        });
        
        if (!response.ok) {
          throw new Error('Failed to confirm completion');
        }
        
        setRefreshTrigger(prev => prev + 1);
      } catch (err) {
        console.error('Error confirming completion:', err);
        alert('Failed to confirm completion. Please try again.');
      }
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric',
      year: 'numeric' 
    });
  };

  const formatTime = (timeString) => {
    let formattedTime;
    if (timeString.includes('T')) {
      formattedTime = new Date(timeString).toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit'
      });
    } else {
      const [hours, minutes] = timeString.split(':');
      const date = new Date();
      date.setHours(parseInt(hours, 10));
      date.setMinutes(parseInt(minutes, 10));
      formattedTime = date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit'
      });
    }
    return formattedTime;
  };

  const getFilteredAndSortedBookings = (bookingList) => {
    let filteredBookings = [...bookingList];
    
    if (dateFilter) {
      const filterDate = new Date(dateFilter);
      filteredBookings = filteredBookings.filter(booking => {
        const bookingDate = new Date(booking.bookingDate);
        return bookingDate.toDateString() === filterDate.toDateString();
      });
    }
    
    if (serviceFilter) {
      filteredBookings = filteredBookings.filter(booking => 
        booking.serviceName && booking.serviceName.toLowerCase().includes(serviceFilter.toLowerCase())
      );
    }
    
    switch (sortOption) {
      case 'date-asc':
        filteredBookings.sort((a, b) => new Date(a.bookingDate) - new Date(b.bookingDate));
        break;
      case 'date-desc':
        filteredBookings.sort((a, b) => new Date(b.bookingDate) - new Date(a.bookingDate));
        break;
      case 'service-asc':
        filteredBookings.sort((a, b) => (a.serviceName || '').localeCompare(b.serviceName || ''));
        break;
      case 'service-desc':
        filteredBookings.sort((a, b) => (b.serviceName || '').localeCompare(a.serviceName || ''));
        break;
      default:
        break;
    }
    
    return filteredBookings;
  };

  const handleRefresh = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  const clearFilters = () => {
    setDateFilter('');
    setServiceFilter('');
    setFilterMenu(false);
  };

  const handleChatClick = (booking) => {
    setActiveChatBooking(booking);
  };

  const closeChatModal = () => {
    setActiveChatBooking(null);
  };

  const renderBookings = (bookingList) => {
    const filteredAndSortedBookings = getFilteredAndSortedBookings(bookingList);
    
    if (filteredAndSortedBookings.length === 0) {
      return <div className="no-bookings">No bookings found</div>;
    }

    return filteredAndSortedBookings.map(booking => (
      <div className="booking-card" key={booking.bookingId}>
        <div className="booking-header">
          <h3>{booking.serviceName || 'Service'}</h3>
          <span className={`booking-status ${booking.status.toLowerCase()}`}>
            {booking.status}
          </span>
        </div>
        <div className="booking-details">
          <div className="booking-detail">
            <FontAwesomeIcon icon={faCalendar} />
            <span>{formatDate(booking.bookingDate)}</span>
          </div>
          <div className="booking-detail">
            <FontAwesomeIcon icon={faClock} />
            <span>{formatTime(booking.bookingTime)}</span>
          </div>
          <div className="booking-detail">
            <FontAwesomeIcon icon={faUser} />
            <span>Provider: {booking.providerName || 'Unknown'}</span>
          </div>
          <div className="booking-detail">
            <FontAwesomeIcon icon={faMapMarkerAlt} />
            <span>Location: {booking.customerLocation}</span>
          </div>
        </div>
        <div className="booking-actions">
          {booking.status === 'CONFIRMED' && (
            <>
              <button 
                className="cancel-btn" 
                onClick={() => handleCancelBooking(booking.bookingId)}
              >
                Cancel Booking
              </button>
              <button 
                className="complete-btn" 
                onClick={() => handleConfirmCompletion(booking.bookingId)}
              >
                <FontAwesomeIcon icon={faCheck} /> Confirm Completion
              </button>
              <button 
                className="chat-btn" 
                onClick={() => handleChatClick(booking)}
              >
                <FontAwesomeIcon icon={faComment} /> Message Provider
              </button>
            </>
          )}
          <button 
            className="details-btn" 
            onClick={() => navigate(`/booking-details/${booking.bookingId}`)}
          >
            View Details
          </button>
        </div>
      </div>
    ));
  };

  return (
    <div className="my-bookings-container">
      <div className="bookings-header">
        <button className="back-btn" onClick={() => navigate('/customer-dashboard')}>
          <FontAwesomeIcon icon={faChevronLeft} /> Back to Dashboard
        </button>
        <h1>My Bookings</h1>
        <div className="header-actions">
          <button className="refresh-btn" onClick={handleRefresh}>
            Refresh
          </button>
          <button 
            className={`filter-btn ${filterMenu ? 'active' : ''}`} 
            onClick={() => setFilterMenu(!filterMenu)}
          >
            <FontAwesomeIcon icon={faFilter} /> Filter
          </button>
        </div>
      </div>

      {filterMenu && (
        <div className="filter-container">
          <div className="filter-section">
            <h3>Filter Options</h3>
            <div className="filter-group">
              <label>Service Name:</label>
              <input 
                type="text" 
                value={serviceFilter} 
                onChange={(e) => setServiceFilter(e.target.value)} 
                placeholder="Filter by service name..."
              />
            </div>
            <div className="filter-group">
              <label>Booking Date:</label>
              <input 
                type="date" 
                value={dateFilter} 
                onChange={(e) => setDateFilter(e.target.value)}
              />
            </div>
            <div className="filter-group">
              <label>Sort By:</label>
              <select value={sortOption} onChange={(e) => setSortOption(e.target.value)}>
                <option value="date-desc">Date (Newest First)</option>
                <option value="date-asc">Date (Oldest First)</option>
                <option value="service-asc">Service (A-Z)</option>
                <option value="service-desc">Service (Z-A)</option>
              </select>
            </div>
            <div className="filter-buttons">
              <button className="clear-filters-btn" onClick={clearFilters}>
                Clear Filters
              </button>
              <button className="apply-filters-btn" onClick={() => setFilterMenu(false)}>
                Apply
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="bookings-tabs">
        <button 
          className={activeTab === 'upcoming' ? 'active' : ''} 
          onClick={() => setActiveTab('upcoming')}
        >
          Upcoming ({bookings.upcoming.length})
        </button>
        <button 
          className={activeTab === 'completed' ? 'active' : ''} 
          onClick={() => setActiveTab('completed')}
        >
          Completed ({bookings.completed.length})
        </button>
        <button 
          className={activeTab === 'cancelled' ? 'active' : ''} 
          onClick={() => setActiveTab('cancelled')}
        >
          Cancelled ({bookings.cancelled.length})
        </button>
      </div>

      <div className="bookings-content">
        {isLoading ? (
          <div className="loading">Loading your bookings...</div>
        ) : error ? (
          <div className="error">
            <p>{error}</p>
            <button className="retry-btn" onClick={handleRefresh}>Try Again</button>
          </div>
        ) : (
          <div className="bookings-list">
            {activeTab === 'upcoming' && renderBookings(bookings.upcoming)}
            {activeTab === 'completed' && renderBookings(bookings.completed)}
            {activeTab === 'cancelled' && renderBookings(bookings.cancelled)}
          </div>
        )}
      </div>
      
      {activeChatBooking && (
        <div className="chat-modal-overlay">
          <div className="chat-modal">
            <ChatComponent 
              bookingId={activeChatBooking.bookingId}
              providerId={activeChatBooking.providerId}
              providerName={activeChatBooking.providerName || 'Service Provider'}
              onClose={closeChatModal}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default MyBookings;