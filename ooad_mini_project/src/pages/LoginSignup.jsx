import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import '../styles/LoginSignup.css';

const LoginSignup = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const redirectTo = location.state?.redirectTo || '/user';

  const [isSignup, setIsSignup] = useState(true);
  const [loading, setLoading] = useState(false);
  const [services, setServices] = useState([]);
  const [errors, setErrors] = useState({});
  const [isAdminLogin, setIsAdminLogin] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    address: '',
    userType: 'CUSTOMER',
    specializationDocument: '',
    serviceId: '',
  });

  useEffect(() => {
    console.log('Initial formData:', formData);
    const fetchServices = async () => {
      try {
        const res = await axios.get('http://localhost:8080/api/services');
        const formatted = res.data.map(service => ({
          serviceId: service.service_id,
          name: service.name,
        }));
        setServices(formatted);
      } catch (err) {
        console.error('Service fetch error:', err);
      }
    };
    fetchServices();
  }, []);

  const toggleForm = () => {
    setIsSignup(!isSignup);
    setFormData({
      name: '',
      email: '',
      password: '',
      phone: '',
      address: '',
      userType: 'CUSTOMER',
      specializationDocument: '',
      serviceId: '',
    });
    setErrors({});
    setIsAdminLogin(false);
  };

  const toggleAdminLogin = () => {
    setIsAdminLogin(!isAdminLogin);
    setFormData({ email: '', password: '' });
    setErrors({});
  };

  const validate = () => {
    const newErrors = {};
    const { name, email, password, phone, address, userType, specializationDocument, serviceId } = formData;

    if (isSignup) {
      if (!name.trim()) newErrors.name = 'Name is required';
      if (!/^\d{10}$/.test(phone)) newErrors.phone = '10 digit phone number';
      if (!address.trim()) newErrors.address = 'Address is required';
    }

    if (!/^[\w.-]+@[\w.-]+\.\w+$/.test(email)) newErrors.email = 'Invalid email format';
    if (password.length < 8) newErrors.password = 'Password must be at least 8 characters';

    if (isSignup && userType === 'SERVICEPROVIDER') {
      if (!specializationDocument.trim()) newErrors.specializationDocument = 'Document required';
      if (!serviceId) newErrors.serviceId = 'Select a service';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    console.log('Changing:', e.target.name, e.target.value);
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);

    const apiUrl = isSignup
      ? 'http://localhost:8080/auth/register'
      : isAdminLogin
      ? 'http://localhost:8080/api/admin/login'
      : 'http://localhost:8080/auth/login';

    const payload = isSignup
      ? {
          name: formData.name,
          email: formData.email,
          password: formData.password,
          phone: formData.phone,
          address: formData.address,
          userType: formData.userType,
          specializationDocument: formData.userType === 'SERVICEPROVIDER' ? formData.specializationDocument : null,
          serviceId: formData.userType === 'SERVICEPROVIDER' ? formData.serviceId : null,
        }
      : {
          email: formData.email,
          password: formData.password,
        };

    try {
      const response = await axios.post(apiUrl, payload);
      if (isSignup) {
        alert(response.data.message || 'Registration successful! Please log in.');
        setIsSignup(false);
        setFormData({
          name: '',
          email: '',
          password: '',
          phone: '',
          address: '',
          userType: 'CUSTOMER',
          specializationDocument: '',
          serviceId: '',
        });
        setLoading(false);
        return;
      }

      const {
        message,
        name,
        userType,
        userId,
        email,
        address,
        serviceId,
        serviceName,
        categoryId,
        categoryName,
        price,
        approvalStatus,
      } = response.data;

      localStorage.setItem('user', JSON.stringify({
        userId,
        name,
        email,
        userType,
        approvalStatus,
        address,
        serviceId,
        serviceName,
        categoryId,
        categoryName,
        price,
      }));
      localStorage.setItem('userName', name);
      localStorage.setItem('userType', userType);

      alert(message || 'Login successful!');

      if (userType === 'SERVICEPROVIDER') {
        if (approvalStatus === 'PENDING') {
          navigate('/waiting');
        } else if (approvalStatus === 'APPROVED') {
          navigate('/vendor');
        } else {
          alert('Your application was rejected. Please contact support.');
        }
      } else if (userType === 'ADMIN') {
        navigate('/admin');
      } else {
        navigate(redirectTo && redirectTo !== '/login' ? redirectTo : '/user');
      }
    } catch (error) {
      console.error('Auth Error:', error.response?.data || error.message);
      alert(error.response?.data?.error || error.response?.data?.message || 'Something went wrong!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <h2>{isSignup ? 'Sign Up' : isAdminLogin ? 'Admin Login' : 'Login'}</h2>

      {redirectTo && redirectTo !== '/login' && !isSignup && !isAdminLogin && (
        <p className="redirect-message">Login to continue your booking</p>
      )}

      <form onSubmit={handleSubmit}>
        {isSignup && (
          <>
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={formData.name}
              onChange={handleChange}
              className={errors.name ? 'error' : ''}
              required
            />
            {errors.name && <p className="error-text small-text">{errors.name}</p>}
          </>
        )}

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          className={errors.email ? 'error' : ''}
          required
        />
        {errors.email && <p className="error-text small-text">{errors.email}</p>}

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          className={errors.password ? 'error' : ''}
          required
        />
        {errors.password && <p className="error-text small-text">{errors.password}</p>}

        {isSignup && (
          <>
            <input
              type="text"
              name="phone"
              placeholder="Phone Number"
              value={formData.phone}
              onChange={handleChange}
              className={errors.phone ? 'error' : ''}
              required
            />
            {errors.phone && <p className="error-text small-text">{errors.phone}</p>}

            <input
              type="text"
              name="address"
              placeholder="Address"
              value={formData.address}
              onChange={handleChange}
              className={errors.address ? 'error' : ''}
              required
            />
            {errors.address && <p className="error-text small-text">{errors.address}</p>}

            <label>User Type</label>
            <select
              name="userType"
              value={formData.userType}
              onChange={handleChange}
              required
            >
              <option value="CUSTOMER">Customer</option>
              <option value="SERVICEPROVIDER">Service Provider</option>
            </select>

            {formData.userType === 'SERVICEPROVIDER' && (
              <>
                <label>Specialization Document</label>
                <textarea
                  name="specializationDocument"
                  placeholder="Enter your specialization document"
                  value={formData.specializationDocument}
                  onChange={handleChange}
                  className={errors.specializationDocument ? 'error' : ''}
                  required
                />
                {errors.specializationDocument && <p className="error-text small-text">{errors.specializationDocument}</p>}

                <label>Select Service</label>
                <select
                  name="serviceId"
                  value={formData.serviceId}
                  onChange={handleChange}
                  required
                >
                  <option value="">-- Select a service --</option>
                  {services.map(service => (
                    <option key={service.serviceId} value={service.serviceId}>{service.name}</option>
                  ))}
                </select>
                {errors.serviceId && <p className="error-text small-text">{errors.serviceId}</p>}
              </>
            )}
          </>
        )}

        {!isSignup && isAdminLogin && (
          <p className="admin-note">Admin login only. Use registered admin credentials.</p>
        )}

        <button type="submit" disabled={loading}>
          {loading ? 'Processing...' : isSignup ? 'Sign Up' : isAdminLogin ? 'Admin Login' : 'Login'}
        </button>
      </form>

      {!isSignup && !isAdminLogin && (
        <p onClick={toggleAdminLogin} className="toggle-text">
          Admin Login?
        </p>
      )}
      <p onClick={toggleForm} className="toggle-text">
        {isSignup ? 'Already have an account? Login' : "Don't have an account? Sign Up"}
      </p>
    </div>
  );
};

export default LoginSignup;