import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/VendorServices.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';

const VendorServices = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAvailable, setIsAvailable] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userData = localStorage.getItem('user');
        if (!userData) throw new Error('User not logged in');
        const parsedUser = JSON.parse(userData);
        const providerId = parsedUser.userId;

        // Fetch services
        const servicesResponse = await fetch(`http://localhost:8080/api/providers/${providerId}/services`);
        if (!servicesResponse.ok) throw new Error('Failed to fetch services');
        const servicesData = await servicesResponse.json();
        setServices(servicesData);

        // Fetch availability
        const availabilityResponse = await fetch(`http://localhost:8080/api/providers/${providerId}/availability`);
        if (!availabilityResponse.ok) throw new Error('Failed to fetch availability');
        const availabilityData = await availabilityResponse.json();
        setIsAvailable(availabilityData.is_available || false);

        setLoading(false);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load data. Please try again.');
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const toggleAvailability = async () => {
    try {
      const userData = localStorage.getItem('user');
      if (!userData) throw new Error('User not logged in');
      const parsedUser = JSON.parse(userData);
      const providerId = parsedUser.userId;

      const newAvailability = !isAvailable;
      const response = await fetch(`http://localhost:8080/api/providers/${providerId}/availability`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isAvailable: newAvailability }),
      });

      if (!response.ok) throw new Error('Failed to update availability');
      setIsAvailable(newAvailability);
      alert(`Availability set to ${newAvailability ? 'Available' : 'Unavailable'}`);
    } catch (err) {
      console.error('Error updating availability:', err);
      alert('Failed to update availability. Please try again.');
    }
  };

  const goBack = () => navigate('/vendor');

  return (
    <div className="vendor-services">
      <header className="services-header">
        <button onClick={goBack} className="back-btn">
          <FontAwesomeIcon icon={faArrowLeft} /> Back
        </button>
        <h2>My Services</h2>
      </header>

      <section className="availability-section">
        <h3>Availability Status</h3>
        <button
          onClick={toggleAvailability}
          className={`availability-btn ${isAvailable ? 'available' : 'unavailable'}`}
        >
          {isAvailable ? 'Available' : 'Unavailable'}
        </button>
      </section>

      <section className="services-container">
        {loading && <p>Loading services...</p>}
        {error && <p className="error-message">{error}</p>}
        {!loading && !error && services.length === 0 && (
          <p>No services found. Add services to start offering them.</p>
        )}
        {!loading && !error && services.length > 0 && (
          <div className="services-list">
            {services.map((service) => (
              <div className="service-card" key={service.service_id}>
                <h3>{service.name}</h3>
                <p className="service-description">{service.description || 'No description available'}</p>
                <p className="service-price">
                  Price: ₹{service.provider_price || service.base_price}
                </p>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default VendorServices;