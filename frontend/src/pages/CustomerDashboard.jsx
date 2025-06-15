import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown } from '@fortawesome/free-solid-svg-icons';
import electricalImg from '../images/electrical.jpg';
import plumberImg from '../images/carpenter.jpg';
import cleaningImg from '../images/cleaning.jpg';
import beautyImg from '../images/beauty.webp';
import otherServicesImg from '../images/otherservices.jpg';
import sp from '../images/sp.png';
import '../styles/CustomerDashboard.css';

const CustomerDashboard = () => {
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();

  const toggleDropdown = () => setShowDropdown(!showDropdown);

  const handleServiceClick = (category) => {
    navigate(`/booking/${category}`);
  };

  const fetchUserProfile = async () => {
    try {
      // Get user data from localStorage
      const userData = localStorage.getItem('user');
      
      if (!userData) {
        throw new Error('User not logged in');
      }
      
      const parsedUser = JSON.parse(userData);
      
      // Fetch user profile data
      const response = await fetch(`http://localhost:8080/api/users/${parsedUser.userId}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch user profile');
      }
      
      const profileData = await response.json();
      
      // Navigate to profile page with data
      navigate('/profile', { state: { profile: profileData } });
      
    } catch (err) {
      console.error('Error fetching user profile:', err);
      alert('Failed to load profile information. Please try again.');
    }
  };

  const viewMyBookings = () => {
    // Directly navigate to the MyBookings component
    navigate('/my-bookings');
  };

  return (
    <div className="customer-dashboard">
      {/* Header */}
      <header className="dashboard-header">
        <div className="logo">
          <span className="urban">Urban</span><span className="connect">Connect_</span>
        </div>
        <nav className="dashboard-nav">
          <div className="profile-nav-wrapper" onClick={toggleDropdown}>
            <span className="profile-link">
              Profile <FontAwesomeIcon icon={faChevronDown} />
            </span>
            {showDropdown && (
              <div className="dropdown-menu">
                <button onClick={fetchUserProfile}>Account</button>
                <button onClick={viewMyBookings}>My Bookings</button>
                <button onClick={() => navigate('/help')}>Help Center</button>
                <button onClick={() => {
                  localStorage.removeItem('user');
                  navigate('/login');
                }}>Logout</button>
              </div>
            )}
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <h1>Welcome, Valued Customer!</h1>
          <p>Book reliable services and manage your appointments with ease.</p>
          {/* <button className="hero-btn" onClick={() => navigate('/booking/ELECTRICAL')}>Book a Service</button> */}
        </div>
        <div className="hero-image">
          <img src={sp} alt="Hero" />
        </div>
      </section>

      {/* Services Section */}
      <section className="services-overview">
        <h2>Explore Our Services</h2>
        <div className="service-grid">
          <div className="service-card" onClick={() => handleServiceClick('ELECTRICAL')}>
            <img src={electricalImg} alt="Electrical" />
            <p>Electrical Services</p>
          </div>
          <div className="service-card" onClick={() => handleServiceClick('PLUMBING')}>
            <img src={plumberImg} alt="Plumbing" />
            <p>Plumbing Services</p>
          </div>
          <div className="service-card" onClick={() => handleServiceClick('CLEANING')}>
            <img src={cleaningImg} alt="Cleaning" />
            <p>Cleaning Services</p>
          </div>
          <div className="service-card" onClick={() => handleServiceClick('BEAUTY')}>
            <img src={beautyImg} alt="Beauty" />
            <p>Beauty Services</p>
          </div>
          <div className="service-card" onClick={() => handleServiceClick('OTHER')}>
            <img src={otherServicesImg} alt="Other" />
            <p>Other Services</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default CustomerDashboard;