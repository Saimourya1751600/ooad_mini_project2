import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import '../styles/Profile.css'; // You'll need to create this CSS file

const Profile = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const profile = location.state?.profile;

  if (!profile) {
    return (
      <div className="profile-container">
        <h2>Profile Not Found</h2>
        <p>Unable to load profile information. Please try again.</p>
        <button onClick={() => navigate('/customer-dashboard')}>Back to Dashboard</button>
      </div>
    );
  }

  return (
    <div className="profile-container">
      <h2>My Profile</h2>
      
      <div className="detail-item">
            <span className="label">Name:</span>
            <span className="value">{profile.name || 'Not provided'}</span>
          </div>
          
        
        <div className="profile-details">
          <div className="detail-item">
            <span className="label">Email:</span>
            <span className="value">{profile.email}</span>
          </div>
          
          <div className="detail-item">
            <span className="label">Phone:</span>
            <span className="value">{profile.phone || 'Not provided'}</span>
          </div>
          
          <div className="detail-item">
            <span className="label">Address:</span>
            <span className="value">{profile.address || 'Not provided'}</span>
          </div>
          
          {/* Add more user details as needed */}
        </div>
        
        <div className="profile-actions">
          <button onClick={() => navigate('/edit-profile', { state: { profile } })}>
            Edit Profile
          </button>
          <button onClick={() => navigate('/customer-dashboard')}>
            Back to Dashboard
          </button>
        </div>
      </div>
   
  );
};

export default Profile;