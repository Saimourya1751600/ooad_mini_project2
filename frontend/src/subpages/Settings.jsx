import React, { useState } from 'react';
import '../styles/AdminDashboard.css';

const Settings = () => {
  const [theme, setTheme] = useState('light');
  const [adminName, setAdminName] = useState('John Doe');
  const [email, setEmail] = useState('admin@example.com');

  const handleThemeChange = (e) => {
    setTheme(e.target.value);
    document.body.className = e.target.value;
  };

  const handleInputChange = (e) => {
    if (e.target.name === 'adminName') setAdminName(e.target.value);
    if (e.target.name === 'email') setEmail(e.target.value);
  };

  return (
    <div className="section-wrapper">
      <header className="dashboard-header">
        <h1>Settings</h1>
        <p>Customize your admin panel settings.</p>
      </header>

      <div className="settings-container">
        <div className="settings-section">
          <h3>Theme</h3>
          <div className="theme-selector">
            <label>
              <input
                type="radio"
                name="theme"
                value="light"
                checked={theme === 'light'}
                onChange={handleThemeChange}
              />
              Light
            </label>
            <label>
              <input
                type="radio"
                name="theme"
                value="dark"
                checked={theme === 'dark'}
                onChange={handleThemeChange}
              />
              Dark
            </label>
          </div>
        </div>

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

        <button className="save-button">Save Settings</button>
      </div>
    </div>
  );
};

export default Settings;
