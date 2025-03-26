import React from 'react';
import { Link } from 'react-router-dom';
import Lottie from 'lottie-react';
import '../styles/NotFound.css';
import notFoundAnimation from '../assets/notfound.json';

const NotFound = () => {
  return (
    <div className="not-found">
      <Lottie animationData={notFoundAnimation} loop={true} className="lottie-animation" />
      <h1>404 - Page Not Found</h1>
      <p>Oops! The page you are looking for does not exist.</p>
      <Link to="/" className="home-link">Go Back to Home</Link>
    </div>
  );
};

export default NotFound;
