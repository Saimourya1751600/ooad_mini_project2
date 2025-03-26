import React, { useState, useEffect } from 'react';
import Lottie from 'lottie-react';
import loaderAnimation from '../assets/loader1.json';
import heroImage from '../assets/hero2.jpg';
import Navbar from '../components/Navbar';
import '../styles/HomePage.css';

const HomePage = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="homepage">
      {loading ? (
        <Lottie animationData={loaderAnimation} loop={true} className="lottie-loader" />
      ) : (
        <>
          {/* Navbar Section */}
          <Navbar />

          {/* Hero Section */}
          <section className="hero">
            <div className="hero-content">
              <h1>Welcome to Urban-Connect</h1>
              <p>Your one-stop solution for all household services!</p>
              <button className="hero-btn">Book a Service</button>
            </div>
            <img src={heroImage} alt="UrbanConnect" className="hero-image" />
          </section>

          {/* Services Section */}
          <section className="services">
            <h2>Our Services</h2>
            <div className="service-grid">
              {[
                { img: '../assets/hero2.jpg', title: 'Electrical Services' },
                { img: '/assets/plumber.jpg', title: 'Plumbing Services' },
                { img: '/assets/carpenter.jpg', title: 'Carpentry Services' },
                { img: '/assets/cleaning.jpg', title: 'Cleaning Services' },
              ].map((service, index) => (
                <div className="service-card" key={index}>
                  <img src={service.img} alt={service.title} />
                  <h3>{service.title}</h3>
                </div>
              ))}
            </div>
          </section>

          {/* Why Choose Us Section */}
          <section className="why-choose-us">
            <h2>Why Choose Urban-Connect?</h2>
            <div className="features">
              <div className="feature-item">
                <h4>Trusted Professionals</h4>
                <p>Background verified professionals for reliable service.</p>
              </div>
              <div className="feature-item">
                <h4>Affordable Pricing</h4>
                <p>Transparent pricing with no hidden costs.</p>
              </div>
              <div className="feature-item">
                <h4>Timely Service</h4>
                <p>Fast and efficient service, available at your convenience.</p>
              </div>
            </div>
          </section>

          {/* Testimonials Section */}
          <section className="testimonials">
            <h2>Customer Testimonials</h2>
            <div className="testimonial">
              <p>“Urban-Connect made my life so much easier. Great service!”</p>
              <h4>- Aditi Sharma</h4>
            </div>
            <div className="testimonial">
              <p>“Professional service providers at affordable rates. Highly recommend!”</p>
              <h4>- Raj Malhotra</h4>
            </div>
          </section>

          {/* Footer Section */}
          <footer className="footer">
            <p>© 2025 Urban-Connect | All Rights Reserved</p>
          </footer>
        </>
      )}
    </div>
  );
};

export default HomePage;
