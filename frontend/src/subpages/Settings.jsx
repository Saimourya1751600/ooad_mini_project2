import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../styles/AdminDashboard.css';

const Settings = () => {
  const [adminName, setAdminName] = useState('');
  const [email, setEmail] = useState('');

  useEffect(() => {
    // Fetch the only admin's info from the backend
    axios.get('http://localhost:8080/api/admin')
      .then((response) => {
        setAdminName(response.data.name);
        setEmail(response.data.email);
      })
      .catch((error) => {
        console.error('Error fetching admin info:', error);
      });
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === 'adminName') setAdminName(value);
    if (name === 'email') setEmail(value);
  };

  const handleSave = () => {
    axios.put('http://localhost:8080/api/admin', {
      name: adminName,
      email: email
    })
      .then(() => alert('Admin settings updated successfully!'))
      .catch((error) => {
        console.error('Error updating admin settings:', error);
        alert('Failed to update admin settings');
      });
  };

  return (
    <div className="section-wrapper">
      <header className="dashboard-header">
        <h1>Settings</h1>
        <p>Update admin profile</p>
      </header>

      <div className="settings-container">
        <div className="settings-section">
          <h3>Admin Information</h3>
          <div className="settings-input-group">
            <label>Admin Name</label>
            <input
              type="text"
              name="adminName"
              value={adminName}
              onChange={handleInputChange}
            />
          </div>
          <div className="settings-input-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={email}
              onChange={handleInputChange}
            />
          </div>
        </div>

        <button className="save-button" onClick={handleSave}>Save Settings</button>
      </div>
    </div>
  );
};

export default Settings;
