import React, { useState, useEffect, useRef } from 'react';
import Lottie from 'lottie-react';
import loaderAnimation from '../assets/loader1.json';
import heroImage2 from '../assets/hero2.jpg'; 
import '../styles/HomePage.css';

const HomePage = () => {
  const [loading, setLoading] = useState(true);
  const servicesRef = useRef(null); // ✅ Reference for services section

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  // ✅ Scroll to services section
  const handleScrollToServices = () => {
    servicesRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="homepage">
      {loading ? (
        <Lottie animationData={loaderAnimation} loop={true} className="lottie-loader" />
      ) : (
        <>
          {/* Hero Section */}
          <section className="hero">
            <div className="hero-content">
              <h1>Welcome to Urban-Connect</h1>
              <p>Your one-stop solution for all household services!</p>
              <button className="hero-btn" onClick={handleScrollToServices}>Book a Service</button>
            </div>
            <img src={heroImage2} alt="UrbanConnect" className="hero-image" />
          </section>

          {/* Services Section */}
          <section className="services" ref={servicesRef}>
            <h2>Our Services</h2>
            <div className="service-grid">
              {[ 
                { img: '/images/electrical.jpg', title: 'Electrical Services' },
                { img: '/images/plumber.jpg', title: 'Plumbing Services' },
                { img: '/images/cleaning.jpg', title: 'Cleaning Services' },
                { img: '/images/beauty.webp', title: 'Beauty Services' },
                { img: '/images/otherservices.jpg', title: 'Other Services' },
              ].map((service, index) => (
                <div className="service-card" key={index}>
                  <img src={service.img} alt={service.title} />
                  <h3>{service.title}</h3>
                </div>
              ))}
            </div>
          </section>

          {/* Footer */}
          <footer className="footer">
            <p>© 2025 Urban-Connect | All Rights Reserved</p>
          </footer>
        </>
      )}
    </div>
  );
};

export default HomePage;
