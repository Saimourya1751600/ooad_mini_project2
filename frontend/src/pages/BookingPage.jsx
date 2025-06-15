import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/BookingPage.css';

const BookingPage = () => {
  const { category } = useParams();
  const navigate = useNavigate();
  const [services, setServices] = useState([]);
  const [selectedService, setSelectedService] = useState(null);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [location, setLocation] = useState('');
  const [providers, setProviders] = useState([]);
  const [selectedProvider, setSelectedProvider] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [addressLoaded, setAddressLoaded] = useState(false);
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('UPI');
  const [paymentProcessing, setPaymentProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [paymentError, setPaymentError] = useState(null);
  const [bookingData, setBookingData] = useState(null);
  const [bookingId, setBookingId] = useState(null);

  // Get current user from localStorage on component mount
  useEffect(() => {
    const fetchUserAndAddress = async () => {
      try {
        // Get user data from localStorage
        const userData = localStorage.getItem('user');
        
        if (!userData) {
          console.log('No user found in localStorage');
          return; // Exit if no user data
        }
        
        try {
          const parsedUser = JSON.parse(userData);
          console.log('Parsed user data:', parsedUser);
          setCurrentUser(parsedUser);
          
          // Check if we already have an address in localStorage first
          if (parsedUser.address) {
            setLocation(parsedUser.address);
            setAddressLoaded(true);
            console.log('Using address from localStorage:', parsedUser.address);
            return; // Exit early if we have the address
          }
          
          // If no address in localStorage, try API
          if (parsedUser.userId) {
            const token = localStorage.getItem('token');
            if (!token) {
              console.log('No auth token found, cannot fetch user details');
              return;
            }
            
            try {
              const response = await axios.get(`http://localhost:8080/api/users/${parsedUser.userId}`, {
                headers: {
                  'Authorization': `Bearer ${token}`
                }
              });
              
              if (response.data && response.data.address) {
                setLocation(response.data.address);
                setAddressLoaded(true);
                
                // Also update in localStorage for future use
                const updatedUser = {...parsedUser, address: response.data.address};
                localStorage.setItem('user', JSON.stringify(updatedUser));
                console.log('Address loaded from API and saved to localStorage');
              } else {
                console.log('API response has no address:', response.data);
              }
            } catch (fetchError) {
              console.error('Error fetching user details:', fetchError);
              // Show error message to user
              setError('Could not load your address. You may need to enter it manually.');
            }
          }
        } catch (parseError) {
          console.error('Error parsing user data:', parseError);
          // Clear corrupt data and redirect to login
          localStorage.removeItem('user');
          localStorage.removeItem('token');
          alert('Your session appears to be corrupted. Please login again.');
          navigate('/login', { state: { redirectTo: `/booking/${category}` } });
        }
      } catch (err) {
        console.error('Error in fetchUserAndAddress:', err);
      }
    };
    
    fetchUserAndAddress();
  }, [category, navigate]);

  useEffect(() => {
    setLoading(true);
    setError(null);

    // Load services based on category
    const fetchServices = async () => {
      try {
        // For now using mock data, but you can replace with API call
        setTimeout(() => {
          const allServices = {
            electrical: [
              { serviceId: 1, name: 'AC Repair', description: 'Fix air conditioner issues', basePrice: 150 },
              { serviceId: 2, name: 'Wiring Installation', description: 'New electrical wiring setup', basePrice: 200 },
              { serviceId: 3, name: 'Circuit Troubleshooting', description: 'Diagnose electrical circuits', basePrice: 120 }
            ],
            plumbing: [
              { serviceId: 4, name: 'Pipe Repair', description: 'Fix water leaks and pipes', basePrice: 100 },
              { serviceId: 5, name: 'Drain Cleaning', description: 'Clear blocked drains', basePrice: 80 },
              { serviceId: 6, name: 'Water Heater Installation', description: 'Install new water heaters', basePrice: 250 }
            ],
            cleaning: [
              { serviceId: 7, name: 'House Cleaning', description: 'Full home cleaning service', basePrice: 120 },
              { serviceId: 8, name: 'Carpet Cleaning', description: 'Deep carpet cleaning', basePrice: 90 },
              { serviceId: 9, name: 'Window Washing', description: 'Clean all windows', basePrice: 70 }
            ],
            beauty: [
              { serviceId: 10, name: 'Haircut', description: 'Professional haircut service', basePrice: 40 },
              { serviceId: 11, name: 'Manicure', description: 'Nail care service', basePrice: 30 },
              { serviceId: 12, name: 'Facial Treatment', description: 'Relaxing facial care', basePrice: 60 }
            ],
            other: [
              { serviceId: 13, name: 'Handyman Services', description: 'General home repairs', basePrice: 150 },
              { serviceId: 14, name: 'Furniture Assembly', description: 'Assemble furniture pieces', basePrice: 100 },
              { serviceId: 15, name: 'Painting', description: 'Interior wall painting', basePrice: 200 }
            ]
          };

          const categoryLower = category?.toLowerCase() || 'other';
          const filteredServices = allServices[categoryLower] || allServices['other'];
          setServices(filteredServices);
          setLoading(false);
        }, 500);
      } catch (err) {
        console.error('Error fetching services:', err);
        setError('Failed to load services. Please try again.');
        setLoading(false);
      }
    };

    fetchServices();
  }, [category]);

  // Load providers when a service is selected
  useEffect(() => {
    if (selectedService) {
      const fetchProviders = async () => {
        try {
          setLoading(true);
          // Fetch service providers who offer this service from backend
          const response = await axios.get(`http://localhost:8080/api/providers/service/${selectedService.serviceId}`);
          
          console.log('Providers response:', response.data);
          
          if (response.data && Array.isArray(response.data)) {
            // Map response data to provider objects with consistent property names
            const formattedProviders = response.data.map(provider => ({
              userId: provider.user_id,
              name: provider.name,
              price: provider.price,
              rating: 0 // Default rating since we removed it from the backend
            }));
            
            setProviders(formattedProviders);
          } else {
            setProviders([]);
            console.warn('No providers available for this service');
          }
        } catch (err) {
          console.error('Error fetching providers:', err);
          setError('Failed to load service providers.');
          setProviders([]); // Set empty array on error
        } finally {
          setLoading(false);
        }
      };
      
      fetchProviders();
    }
  }, [selectedService]);

  const handleServiceSelect = (service) => {
    setSelectedService(service);
    setSelectedProvider(null);
  };

  const handleProviderSelect = (provider) => {
    setSelectedProvider(provider);
  };

  const handleBookingSubmit = async (e) => {
    e.preventDefault();

    if (!currentUser) {
      // Store booking details in sessionStorage before redirecting
      sessionStorage.setItem('pendingBooking', JSON.stringify({
        category,
        serviceId: selectedService?.serviceId,
        date: selectedDate,
        time: selectedTime,
        location
      }));
      
      navigate('/login', { state: { redirectTo: `/booking/${category}` } });
      return;
    }

    if (!selectedService || !selectedProvider || !selectedDate || !selectedTime || !location) {
      setError('Please fill in all required fields');
      return;
    }

    const booking = {
      customerId: currentUser.userId,
      providerId: selectedProvider.userId,
      serviceId: selectedService.serviceId,
      bookingDate: selectedDate,
      bookingTime: selectedTime,
      customerLocation: location,
      status: 'CONFIRMED'
    };

    setBookingData(booking);
    // Show payment form instead of immediately submitting
    setShowPaymentForm(true);
  };

  const handlePaymentSubmit = async (e) => {
    e.preventDefault();
  
    if (!bookingData) {
      setPaymentError('Booking information is missing');
      return;
    }
  
    try {
      setPaymentProcessing(true);
      setPaymentError(null);
  
      // Step 1: Create the booking without token
      const bookingResponse = await axios.post('http://localhost:8080/api/bookings', bookingData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      console.log('Booking successful:', bookingResponse.data);
      const createdBookingId = bookingResponse.data.bookingId;
      setBookingId(createdBookingId);
  
      // Step 2: Process payment without token
      const paymentData = {
        bookingId: createdBookingId,
        amount: selectedProvider.price || selectedService.basePrice,
        paymentMethod: paymentMethod,
        paymentStatus: 'SUCCESS', // Confirm payment immediately
      };
  
      const paymentResponse = await axios.post('http://localhost:8080/api/payments', paymentData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      console.log('Payment successful:', paymentResponse.data);
      setPaymentSuccess(true);
      setBookingSuccess(true);
  
      // Update local state and storage
      setSelectedService(null);
      setSelectedProvider(null);
      setSelectedDate('');
      setSelectedTime('');
      setLocation('');
      setPaymentMethod('UPI');
      setShowPaymentForm(false);
  
      if (currentUser && location) {
        const updatedUser = { ...currentUser, address: location };
        localStorage.setItem('user', JSON.stringify(updatedUser));
      }
  
      // Redirect after success
      setTimeout(() => {
        navigate('/customer-dashboard');
      }, 3000);
    } catch (err) {
      console.error('Payment error:', err);
      setPaymentError(`Payment failed: ${err.response?.data?.message || err.message}`);
    } finally {
      setPaymentProcessing(false);
    }
  };

  const cancelPayment = () => {
    setShowPaymentForm(false);
    setPaymentError(null);
  };

  // Restore pending booking details from sessionStorage after login redirect
  useEffect(() => {
    if (currentUser) {
      const pendingBooking = sessionStorage.getItem('pendingBooking');
      if (pendingBooking) {
        try {
          const bookingDetails = JSON.parse(pendingBooking);
          
          // Restore booking details
          if (bookingDetails.date) setSelectedDate(bookingDetails.date);
          if (bookingDetails.time) setSelectedTime(bookingDetails.time);
          if (bookingDetails.location) setLocation(bookingDetails.location);
          
          // Find and select the service
          if (bookingDetails.serviceId) {
            const service = services.find(s => s.serviceId === bookingDetails.serviceId);
            if (service) setSelectedService(service);
          }
          
          // Remove from sessionStorage once restored
          sessionStorage.removeItem('pendingBooking');
        } catch (err) {
          console.error('Error restoring booking details:', err);
        }
      }
    }
  }, [currentUser, services]);

  if (loading && services.length === 0) return <div className="loading">Loading services...</div>;
  if (error && !bookingSuccess) return <div className="error-message">{error}</div>;
  if (bookingSuccess) {
    return (
      <div className="success-message">
        <h2>Booking Successful!</h2>
        <p>Your payment has been processed and your service has been booked successfully.</p>
        <p>Redirecting to dashboard...</p>
      </div>
    );
  }

  // Payment form overlay
  const renderPaymentForm = () => {
    if (!showPaymentForm) return null;

    const servicePrice = selectedProvider?.price || selectedService?.basePrice || 0;

    return (
      <div className="payment-overlay">
        <div className="payment-modal">
          <h3>Complete Payment</h3>
          <div className="booking-summary">
            <h4>Booking Summary</h4>
            <p><strong>Service:</strong> {selectedService?.name}</p>
            <p><strong>Provider:</strong> {selectedProvider?.name}</p>
            <p><strong>Date:</strong> {selectedDate}</p>
            <p><strong>Time:</strong> {selectedTime}</p>
            <p><strong>Location:</strong> {location}</p>
            <p className="total-amount"><strong>Total Amount:</strong> ₹{servicePrice}</p>
          </div>

          <form onSubmit={handlePaymentSubmit} className="payment-form">
            <div className="form-group">
              <label>Select Payment Method:</label>
              <div className="payment-methods">
                <div className="payment-method">
                  <input
                    type="radio"
                    id="upi"
                    name="paymentMethod"
                    value="UPI"
                    checked={paymentMethod === 'UPI'}
                    onChange={() => setPaymentMethod('UPI')}
                  />
                  <label htmlFor="upi">UPI</label>
                </div>
                <div className="payment-method">
                  <input
                    type="radio"
                    id="card"
                    name="paymentMethod"
                    value="CARD"
                    checked={paymentMethod === 'CARD'}
                    onChange={() => setPaymentMethod('CARD')}
                  />
                  <label htmlFor="card">Card</label>
                </div>
                <div className="payment-method">
                  <input
                    type="radio"
                    id="cash"
                    name="paymentMethod"
                    value="CASH"
                    checked={paymentMethod === 'CASH'}
                    onChange={() => setPaymentMethod('CASH')}
                  />
                  <label htmlFor="cash">Cash on Service</label>
                </div>
              </div>
            </div>
            
            {paymentMethod === 'UPI' && (
              <div className="payment-details">
                <p>Please enter your UPI ID to complete the payment</p>
                <input type="text" placeholder="username@upi" className="upi-input" />
              </div>
            )}
            
            {paymentMethod === 'CARD' && (
              <div className="payment-details">
                <input type="text" placeholder="Card Number" className="card-input" />
                <div className="card-row">
                  <input type="text" placeholder="MM/YY" className="card-date" />
                  <input type="text" placeholder="CVV" className="card-cvv" />
                </div>
                <input type="text" placeholder="Cardholder Name" className="card-name" />
              </div>
            )}
            
            {paymentMethod === 'CASH' && (
              <div className="payment-details">
                <p>You'll pay ₹{servicePrice} in cash after the service is completed.</p>
              </div>
            )}
            
            {paymentError && <div className="payment-error">{paymentError}</div>}
            
            <div className="payment-actions">
              <button type="button" className="cancel-payment" onClick={cancelPayment}>Cancel</button>
              <button type="submit" className="confirm-payment" disabled={paymentProcessing}>
                {paymentProcessing ? 'Processing Payment...' : `Pay ₹${servicePrice}`}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  return (
    <div className="booking-page-container">
      <div className="booking-header">
        <h2>{category.charAt(0).toUpperCase() + category.slice(1).toLowerCase()} Services</h2>
        {/* {currentUser && <p>Welcome, {currentUser.name}</p>} */}
      </div>

      <div className="booking-content">
        <div className="services-list">
          <h3>Available Services</h3>
          {services.length === 0 ? (
            <p>No services available for this category</p>
          ) : (
            <ul>
              {services.map((service) => (
                <li
                  key={service.serviceId}
                  className={selectedService?.serviceId === service.serviceId ? 'selected' : ''}
                  onClick={() => handleServiceSelect(service)}
                >
                  <div className="service-item">
                    <span className="service-name">{service.name}</span>
                    <span className="service-price">₹{service.basePrice}</span>
                  </div>
                  <p className="service-description">{service.description}</p>
                </li>
              ))}
            </ul>
          )}
        </div>

        {selectedService && (
          <div className="booking-form-container">
            <h3>Book Service</h3>
            {!currentUser && (
              <div className="login-prompt">
                <p>You need to log in to book a service</p>
                <button 
                  className="login-btn"
                  onClick={() => navigate('/login', { state: { redirectTo: `/booking/${category}` } })}
                >
                  Log In
                </button>
              </div>
            )}
            <form className="booking-form" onSubmit={handleBookingSubmit}>
              <div className="form-group">
                <label>Selected Service:</label>
                <span>{selectedService.name} - ₹{selectedService.basePrice}</span>
              </div>

              <div className="form-group">
                <label htmlFor="provider">Select Service Provider:</label>
                {providers.length === 0 ? (
                  <p className="no-providers-message">No service providers available for this service</p>
                ) : (
                  <select
                    id="provider"
                    value={selectedProvider?.userId || ''}
                    onChange={(e) => {
                      const selectedProviderId = e.target.value;
                      const provider = providers.find(p => p.userId.toString() === selectedProviderId);
                      handleProviderSelect(provider);
                    }}
                    required
                  >
                    <option value="">-- Select a Provider --</option>
                    {providers.map(provider => (
                      <option key={provider.userId} value={provider.userId}>
                        {provider.name} - Price: ₹{provider.price}
                      </option>
                    ))}
                  </select>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="date">Select Date:</label>
                <input
                  type="date"
                  id="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="time">Select Time:</label>
                <input
                  type="time"
                  id="time"
                  value={selectedTime}
                  onChange={(e) => setSelectedTime(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="location">Your Location:</label>
                <textarea
                  id="location"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="Enter your address"
                  rows="3"
                  required
                />
                {addressLoaded && (
                  <small className="address-info">
                    Your saved address has been loaded. You may edit it for this booking if needed.
                  </small>
                )}
              </div>

              <button 
                type="submit" 
                className="booking-submit-btn"
                disabled={loading || providers.length === 0}
              >
                {loading ? 'Processing...' : 'Proceed to Payment'}
              </button>
            </form>
          </div>
        )}
      </div>
      
      {renderPaymentForm()}
    </div>
  );
};

export default BookingPage;