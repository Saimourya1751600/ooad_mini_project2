import React, { useState } from 'react';
import '../styles/Help.css';

const Help = () => {
  const [form, setForm] = useState({ message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setForm({ message: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const queryData = { message: form.message, userId: 1 }; // Hardcode user_id for now
    try {
      const response = await fetch('http://localhost:8080/api/help-queries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(queryData),
      });
      const result = await response.text();
      if (result === "Query submitted successfully") {
        setSubmitted(true);
        setForm({ message: '' });
      } else {
        alert(result); // Show error if any
      }
    } catch (error) {
      alert('Error submitting query');
      console.error(error);
    }
  };

  return (
    <div className="help-page">
      <header className="help-header">
        <div className="logo">
          <span className="urban">Urban</span><span className="connect">Connect_</span>
        </div>
        <h1>Help Center</h1>
        <p>Find answers or ask your own question.</p>
      </header>
      <section className="faq-section">
        <h2>Frequently Asked Questions</h2>
        <div className="faq-list">
          <div className="faq-item">
            <h3>How do I book a service?</h3>
            <p>You can book any service by selecting a category on the dashboard and filling out the booking form.</p>
          </div>
          <div className="faq-item">
            <h3>Can I cancel or reschedule a booking?</h3>
            <p>Yes, visit the "My Bookings" section to cancel or reschedule an appointment.</p>
          </div>
        </div>
      </section>
      <section className="query-form-section">
        <h2>Still Have a Question?</h2>
        <p>Submit your query below and we’ll get back to you shortly.</p>
        {submitted ? (
          <div className="thank-you-message">✅ Thank you! Your message has been received.</div>
        ) : (
          <form onSubmit={handleSubmit} className="query-form">
            <textarea
              name="message"
              placeholder="Enter your query..."
              value={form.message}
              onChange={handleChange}
              rows={5}
              required
            />
            <button type="submit">Submit Query</button>
          </form>
        )}
      </section>
    </div>
  );
};

export default Help;