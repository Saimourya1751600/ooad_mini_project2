import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../styles/AdminDashboard.css';

const Customers = () => {
  const [customers, setCustomers] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:8080/api/users')
      .then(response => {
        const users = response.data;
        const customerList = users.filter(user => user.user_type === 'CUSTOMER');
        setCustomers(customerList);
      })
      .catch(error => {
        console.error('Error fetching customers:', error);
      });
  }, []);

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      // Convert to ISO format (YYYY-MM-DDTHH:mm:ss)
      const formattedDate = new Date(dateString.replace(' ', 'T')); 

      if (isNaN(formattedDate)) {
        console.error('Invalid date format:', dateString);
        return 'N/A';
      }

      // Format date as dd-mm-yyyy
      const day = formattedDate.getDate().toString().padStart(2, '0'); // Add leading zero if day is single digit
      const month = (formattedDate.getMonth() + 1).toString().padStart(2, '0'); // Add leading zero if month is single digit
      const year = formattedDate.getFullYear();

      return `${day}-${month}-${year}`; // Return date in dd-mm-yyyy format
    } catch (err) {
      console.error('Error formatting date:', err);
      return 'N/A';
    }
  };

  return (
    <div className="section-wrapper">
      <header className="dashboard-header">
        <h1>Customers</h1>
        <p>List of all registered customers</p>
      </header>

      <div className="table-container">
        <table className="admin-table">
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
            {customers.map((customer, index) => (
              <tr key={customer.userId}>
                <td>{index + 1}</td>
                <td>{customer.name}</td>
                <td>{customer.email}</td>
                <td>{customer.phone}</td>
                <td>{formatDate(customer.createdAt)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Customers;
