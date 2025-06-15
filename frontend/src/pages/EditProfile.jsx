import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import '../styles/EditProfile.css';

const EditProfile = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const profile = location.state?.profile;

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    // Pre-fill form with profile data
    if (profile) {
      setFormData({
        name: profile.name || '',
        phone: profile.phone || '',
        address: profile.address || '',
      });
    } else {
      // Fetch user data if not provided
      const userData = localStorage.getItem('user');
      if (userData) {
        const parsedUser = JSON.parse(userData);
        fetchUserProfile(parsedUser.userId);
      } else {
        navigate('/login');
      }
    }
  }, [profile, navigate]);

  const fetchUserProfile = async (userId) => {
    try {
      const response = await fetch(`http://localhost:8080/api/users/${userId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch user profile');
      }
      const data = await response.json();
      setFormData({
        name: data.name || '',
        phone: data.phone || '',
        address: data.address || '',
      });
    } catch (err) {
      setError('Unable to load profile data. Please try again.');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    const userData = localStorage.getItem('user');
    if (!userData) {
      navigate('/login');
      return;
    }

    const parsedUser = JSON.parse(userData);
    try {
      const response = await fetch(`http://localhost:8080/api/users/${parsedUser.userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to update profile');
      }

      const updatedProfile = await response.json();
      // Update localStorage with new data
      localStorage.setItem('user', JSON.stringify({
        ...parsedUser,
        name: updatedProfile.name,
        phone: updatedProfile.phone,
        address: updatedProfile.address,
      }));

      setSuccess('Profile updated successfully!');
      setTimeout(() => {
        navigate('/profile', { state: { profile: updatedProfile } });
      }, 2000);
    } catch (err) {
      setError('Error updating profile: ' + err.message);
    }
  };

  if (!profile && !formData.name) {
    return (
      <div className="edit-profile-container">
        <h2>Edit Profile</h2>
        <p>Unable to load profile information. Please try again.</p>
        <button onClick={() => navigate('/profile')}>Back to Profile</button>
      </div>
    );
  }

  return (
    <div className="edit-profile-container">
      <h2>Edit Profile</h2>
      {error && <p className="error">{error}</p>}
      {success && <p className="success">{success}</p>}
      <form className="edit-profile-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">Name:</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="phone">Phone:</label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label htmlFor="address">Address:</label>
          <textarea
            id="address"
            name="address"
            value={formData.address}
            onChange={handleChange}
          />
        </div>
        <div className="form-actions">
          <button type="submit">Save Changes</button>
          <button type="button" onClick={() => navigate('/profile')}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditProfile;