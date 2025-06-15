import React from 'react';

const WaitingPage = () => {
  return (
    <div style={{ padding: "2rem", textAlign: "center" }}>
      <h2>Thank you for registering as a Service Provider!</h2>
      <p>Your document is under review by the admin.</p>
      <h3>Status: <span style={{ color: 'orange' }}>Waiting for Approval</span></h3>
    </div>
  );
};

export default WaitingPage;
