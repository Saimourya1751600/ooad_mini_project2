import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/AdminDashboard.css';

const AdminDashboard = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const userType = localStorage.getItem('userType');
    if (userType !== 'ADMIN') {
      alert("Unauthorized access. Redirecting...");
      navigate('/login');
    }
  }, [navigate]);

  return (
    <div className="admin-dashboard">
      <h2>Admin Dashboard</h2>
      <p>Welcome Admin! Here you can manage:</p>
      <ul>
        <li>✅ Review pending service providers</li>
        <li>✅ Approve or reject verification documents</li>
        <li>✅ Monitor bookings and user queries</li>
      </ul>
      <button onClick={() => {
        localStorage.clear();
        navigate('/login');
      }}>
        Logout
      </button>
    </div>
  );
};

export default AdminDashboard;
