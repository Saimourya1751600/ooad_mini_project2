import React, { useState } from 'react';
import '../styles/Help.css';

const Help = () => {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // You can POST this to your backend or save it to Firebase etc.
    console.log('Submitted Help Query:', form);
    setSubmitted(true);
    setForm({ name: '', email: '', message: '' });
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
          <div className="faq-item">
            <h3>What if the service provider doesn't show up?</h3>
            <p>You can report a no-show through the Help Center or contact our support team directly.</p>
          </div>
          <div className="faq-item">
            <h3>How do I update my profile information?</h3>
            <p>Go to your Profile page and click on "Edit Profile" to update your details.</p>
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
            <input
              type="text"
              name="name"
              placeholder="Your Name"
              value={form.name}
              onChange={handleChange}
              required
            />
            <input
              type="email"
              name="email"
              placeholder="Your Email"
              value={form.email}
              onChange={handleChange}
              required
            />
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
