import React, { useEffect, useState } from 'react';
import { Line, Bar } from 'react-chartjs-2';
import axios from 'axios';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const DashboardOverview = () => {
  const [dashboardStats, setDashboardStats] = useState({
    totalCustomers: 0,
    totalProviders: 0,
    totalBookings: 0,
    confirmedBookings: 0,
    cancelledBookings: 0,
    completedBookings: 0,
    totalServices: 0
  });
  const [recentBookings, setRecentBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [revenue, setRevenue] = useState(0);
  


  useEffect(() => {
    Promise.all([
      axios.get('http://localhost:8080/api/admin/dashboard/stats'),
      axios.get('http://localhost:8080/api/admin/dashboard/recent-bookings?limit=10'),
      axios.get('http://localhost:8080/api/payments')
    ])
      .then(([statsResponse, bookingsResponse, paymentsResponse]) => {
        setDashboardStats(statsResponse.data);
        setRecentBookings(bookingsResponse.data);
  
        const totalRevenue = paymentsResponse.data.reduce((acc, payment) => {
          return acc + (payment.amount || 0); // fallback to 0 in case amount is null
        }, 0);
  
        setRevenue(totalRevenue);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching dashboard data:', error);
        setError('Failed to load dashboard data. Please try again later.');
        setLoading(false);
      });
  }, []);
  

  // Calculate revenue data based on recent bookings or use a mock
  // In a real app, you might have a separate endpoint for revenue data
  const lineData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Monthly Revenue (₹)',
        data: [1200, 1900, 3000, 2500, 3200, 4000],
        borderColor: '#2980b9',
        backgroundColor: 'rgba(41, 128, 185, 0.2)',
        tension: 0.4,
      },
    ],
  };

  // Group bookings by service type - using mock data for now
  // In a real app, you might want to get this from an endpoint
  const barData = {
    labels: ['Plumber', 'Electrician', 'Cleaner', 'Carpenter', 'Painter'],
    datasets: [
      {
        label: 'Active Bookings',
        data: [0, 3, 0, 0, 2],
        backgroundColor: '#27ae60',
      },
    ],
  };

  // Loading state
  if (loading) {
    return (
      <div className="loading-container">
        <p>Loading dashboard data...</p>
      </div>
    );
  }

  return (
    <>
      <header className="dashboard-header">
        <h1>Dashboard Overview</h1>
        {error && <div className="error-message">{error}</div>}
      </header>
      <section className="stats-grid">
        <div className="stat-card">
          <div className="stat-card-icon">👤</div>
          <h3>Total Customers</h3>
          <p>{dashboardStats.totalCustomers}</p>
        </div>
        <div className="stat-card">
          <div className="stat-card-icon">👷‍♂️</div>
          <h3>Total Providers</h3>
          <p>{dashboardStats.totalProviders}</p>
        </div>
        <div className="stat-card">
          <div className="stat-card-icon">📅</div>
          <h3>Total Bookings</h3>
          <p>{dashboardStats.totalBookings}</p>
        </div>
        <div className="stat-card">
          <div className="stat-card-icon">✅</div>
          <h3>Confirmed Bookings</h3>
          <p>{dashboardStats.confirmedBookings}</p>
        </div>
        <div className="stat-card">
          <div className="stat-card-icon">❌</div>
          <h3>Cancelled Bookings</h3>
          <p>{dashboardStats.cancelledBookings}</p>
        </div>
        <div className="stat-card">
          <div className="stat-card-icon">✔️</div>
          <h3>Completed Bookings</h3>
          <p>{dashboardStats.completedBookings}</p>
        </div>
        <div className="stat-card">
          <div className="stat-card-icon">🛠️</div>
          <h3>Total Services</h3>
          <p>{dashboardStats.totalServices}</p>
        </div>
        <div className="stat-card">
          <div className="stat-card-icon">💰</div>
          <h3>Revenue Collected</h3>
          <p>₹{revenue.toLocaleString('en-IN')}</p>
        </div>

      </section>

      <section className="charts-grid">
        <div className="chart-section chart-block">
          <h2>Revenue Trend</h2>
          <Line data={lineData} />
        </div>
        <div className="chart-section chart-block">
          <h2>Active Bookings by Service</h2>
          <Bar data={barData} />
        </div>
      </section>
    </>
  );
};

// Helper function for status colors
const getStatusColor = (status) => {
  const statusColors = {
    CONFIRMED: '#2ecc71',
    CANCELLED: '#e74c3c',
    COMPLETED: '#3498db',
    PENDING: '#f39c12'
  };
  return statusColors[status] || '#777';
};

export default DashboardOverview;