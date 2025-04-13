import React from 'react';
import '../styles/AdminDashboard.css';

const mockCustomers = [
  { id: 1, name: 'Ananya Sharma', email: 'ananya@example.com', phone: '9876543210', joined: '2023-05-12' },
  { id: 2, name: 'Rahul Verma', email: 'rahul@example.com', phone: '9123456780', joined: '2023-06-01' },
  { id: 3, name: 'Meena Kumari', email: 'meena@example.com', phone: '9988776655', joined: '2023-04-22' },
  { id: 4, name: 'Ravi Gupta', email: 'ravi@example.com', phone: '9345678123', joined: '2023-03-15' },
  { id: 5, name: 'Neha Singh', email: 'neha@example.com', phone: '9876567890', joined: '2023-07-05' },
];

const Customers = () => {
  return (
    <div className="section-wrapper">
      <header className="dashboard-header">
        <h1>Customers</h1>
        <p>List of all registered customers</p>
      </header>

      <div className="table-wrapper">
        <table className="data-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Joined On</th>
            </tr>
          </thead>
          <tbody>
            {mockCustomers.map((customer, index) => (
              <tr key={customer.id}>
                <td>{index + 1}</td>
                <td>{customer.name}</td>
                <td>{customer.email}</td>
                <td>{customer.phone}</td>
                <td>{customer.joined}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Customers;
