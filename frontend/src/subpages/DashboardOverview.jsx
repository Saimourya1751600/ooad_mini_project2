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
  const [totalCustomers, setTotalCustomers] = useState(0);
  const [totalProviders, setTotalProviders] = useState(0);

  useEffect(() => {
    axios.get('http://localhost:8080/api/users')
      .then(response => {
        const users = response.data;
        const customers = users.filter(user => user.user_type === 'CUSTOMER').length;
        const providers = users.filter(user => user.user_type === 'SERVICEPROVIDER').length;
        setTotalCustomers(customers);
        setTotalProviders(providers);
      })
      .catch(error => {
        console.error('Error fetching users:', error);
      });
  }, []);

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

  const barData = {
    labels: ['Plumber', 'Electrician', 'Cleaner', 'Carpenter', 'Painter'],
    datasets: [
      {
        label: 'Active Bookings',
        data: [12, 19, 7, 15, 10],
        backgroundColor: '#27ae60',
      },
    ],
  };

  return (
    <>
      <header className="dashboard-header">
        <h1>Dashboard Overview</h1>
      </header>
      <section className="stats-grid">
        <div className="stat-card">
          <div className="stat-card-icon">👤</div>
          <h3>Total Customers</h3>
          <p>{totalCustomers}</p>
        </div>
        <div className="stat-card">
          <div className="stat-card-icon">👷‍♂️</div>
          <h3>Total Providers</h3>
          <p>{totalProviders}</p>
        </div>
        <div className="stat-card">
          <div className="stat-card-icon">📅</div>
          <h3>Active Bookings</h3>
          <p>89</p>
        </div>
        <div className="stat-card">
          <div className="stat-card-icon">💰</div>
          <h3>Monthly Revenue</h3>
          <p>₹12,340</p>
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

export default DashboardOverview;
