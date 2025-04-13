import React from 'react';
import '../styles/AdminDashboard.css';

const mockPayments = [
  { id: 'TXN1001', customer: 'Amit Sharma', provider: 'Rajesh Kumar', amount: 750, status: 'Completed', date: '2025-04-10' },
  { id: 'TXN1002', customer: 'Neha Verma', provider: 'Sunil Mehra', amount: 1200, status: 'Pending', date: '2025-04-11' },
  { id: 'TXN1003', customer: 'Vikas Dubey', provider: 'Anita Singh', amount: 650, status: 'Completed', date: '2025-04-12' },
  { id: 'TXN1004', customer: 'Preeti Yadav', provider: 'Karan Patel', amount: 900, status: 'Failed', date: '2025-04-12' },
];

const Payments = () => {
  return (
    <div className="section-wrapper">
      <header className="dashboard-header">
        <h1>Payments</h1>
        <p>Track recent transactions and their statuses</p>
      </header>

      <div className="table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Transaction ID</th>
              <th>Customer</th>
              <th>Provider</th>
              <th>Amount (₹)</th>
              <th>Status</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {mockPayments.map(payment => (
              <tr key={payment.id}>
                <td>{payment.id}</td>
                <td>{payment.customer}</td>
                <td>{payment.provider}</td>
                <td>₹{payment.amount}</td>
                <td className={`status ${payment.status.toLowerCase()}`}>{payment.status}</td>
                <td>{payment.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Payments;
