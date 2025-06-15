import React from 'react';
import '../styles/AdminDashboard.css';

const mockFeedback = [
  { id: 'FB1001', customer: 'Amit Sharma', provider: 'Rajesh Kumar', feedback: 'Great service! Highly recommended.', rating: 5, date: '2025-04-10' },
  { id: 'FB1002', customer: 'Neha Verma', provider: 'Sunil Mehra', feedback: 'Good, but can improve timeliness.', rating: 3, date: '2025-04-11' },
  { id: 'FB1003', customer: 'Vikas Dubey', provider: 'Anita Singh', feedback: 'Very professional and clean work.', rating: 4, date: '2025-04-12' },
  { id: 'FB1004', customer: 'Preeti Yadav', provider: 'Karan Patel', feedback: 'Terrible service, unprofessional.', rating: 1, date: '2025-04-12' },
];

const Feedback = () => {
  return (
    <div className="section-wrapper">
      <header className="dashboard-header">
        <h1>Feedback</h1>
        <p>View and manage customer feedback for service providers</p>
      </header>

      <div className="table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Feedback ID</th>
              <th>Customer</th>
              <th>Provider</th>
              <th>Feedback</th>
              <th>Rating</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {mockFeedback.map(feedback => (
              <tr key={feedback.id}>
                <td>{feedback.id}</td>
                <td>{feedback.customer}</td>
                <td>{feedback.provider}</td>
                <td>{feedback.feedback}</td>
                <td>{feedback.rating} / 5</td>
                <td>{feedback.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Feedback;
