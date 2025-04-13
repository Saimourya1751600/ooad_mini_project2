import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../styles/AdminDashboard.css';

const Services = () => {
  const [services, setServices] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:8080/api/services') // Replace with your API
      .then(response => {
        setServices(response.data);
      })
      .catch(error => {
        console.error('Error fetching services:', error);
      });
  }, []);

  return (
    <div className="section-wrapper">
      <header className="dashboard-header">
        <h1>Services</h1>
        <p>Manage and view available services</p>
      </header>

      <div className="table-wrapper">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Service ID</th>
              <th>Name</th>
              <th>Category</th>
              <th>Base Price (₹)</th>
              <th>Description</th>
              <th>Created At</th>
            </tr>
          </thead>
          <tbody>
            {services.map((service) => (
              <tr key={service.service_id}>
                <td>{service.service_id}</td>
                <td>{service.name}</td>
                <td>{service.category_name || service.category_id}</td> {/* Fallback if category name isn't fetched */}
                <td>{Number(service.base_price).toFixed(2)}</td>
                <td>{service.description}</td>
                <td>{new Date(service.created_at).toLocaleDateString('en-GB')}</td> {/* dd-mm-yyyy */}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Services;
