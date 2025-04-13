import React from 'react';
import '../styles/AdminDashboard.css';

const mockServices = [
  {
    id: 'SRV001',
    name: 'Plumbing',
    category: 'Home Repair',
    price: '₹500',
    duration: '30 mins',
    active: true,
  },
  {
    id: 'SRV002',
    name: 'Electrical Work',
    category: 'Home Repair',
    price: '₹750',
    duration: '45 mins',
    active: true,
  },
  {
    id: 'SRV003',
    name: 'House Cleaning',
    category: 'Cleaning',
    price: '₹1,200',
    duration: '2 hrs',
    active: false,
  },
  {
    id: 'SRV004',
    name: 'AC Repair',
    category: 'Appliance Repair',
    price: '₹850',
    duration: '1 hr',
    active: true,
  },
];

const Services = () => {
  return (
    <div className="section-wrapper">
      <header className="dashboard-header">
        <h1>Services</h1>
        <p>Manage and view available services</p>
      </header>

      <div className="table-wrapper">
        <table className="data-table">
          <thead>
            <tr>
              <th>Service ID</th>
              <th>Name</th>
              <th>Category</th>
              <th>Price</th>
              <th>Duration</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {mockServices.map((service) => (
              <tr key={service.id}>
                <td>{service.id}</td>
                <td>{service.name}</td>
                <td>{service.category}</td>
                <td>{service.price}</td>
                <td>{service.duration}</td>
                <td style={{ color: service.active ? '#2ecc71' : '#e74c3c', fontWeight: 'bold' }}>
                  {service.active ? 'Active' : 'Inactive'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Services;
