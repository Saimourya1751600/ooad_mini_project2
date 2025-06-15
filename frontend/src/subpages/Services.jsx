import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../styles/AdminDashboard.css';

const Services = () => {
  const [services, setServices] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:8080/api/services')
      .then(response => {
        setServices(response.data);
      })
      .catch(error => {
        console.error('Error fetching services:', error);
      });
  }, []);

  const sortedServices = [...services].sort((a, b) => a.service_id - b.service_id);

  return (
    <div className="section-wrapper">
      <header className="dashboard-header">
        <h1>Services</h1>
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
            </tr>
          </thead>
          <tbody>
            {sortedServices.map((service) => (
              <tr key={service.service_id}>
                <td>{service.service_id}</td>
                <td>{service.name}</td>
                <td>{service.category_name || service.category_id}</td>
                <td>{Number(service.base_price).toFixed(2)}</td>
                <td>{service.description}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Services;
