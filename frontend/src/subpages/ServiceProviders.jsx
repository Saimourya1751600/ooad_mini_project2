import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../styles/AdminDashboard.css';

const ServiceProviders = () => {
  const [providers, setProviders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [serviceFilter, setServiceFilter] = useState('');
  const [serviceTypes, setServiceTypes] = useState([]);

  useEffect(() => {
    axios
      .get('http://localhost:8080/api/services')
      .then((response) => {
        const services = Array.isArray(response.data) ? response.data : [];
        const categories = [...new Set(services.map((service) => service.category_name))]
          .filter((name) => name)
          .map((name) => ({
            id: name,
            name: name,
          }));
        setServiceTypes(categories);
      })
      .catch((error) => {
        console.error('Error fetching service types:', error);
        setServiceTypes([]);
      });

    fetchProviders();
  }, [page, pageSize, searchTerm, serviceFilter]);

  const fetchProviders = () => {
    setLoading(true);
    axios
      .get(
        `http://localhost:8080/api/users?type=SERVICEPROVIDER&page=${page}&size=${pageSize}&search=${encodeURIComponent(
          searchTerm
        )}&serviceType=${encodeURIComponent(serviceFilter)}`
      )
      .then((response) => {
        const { content, totalPages } = response.data;
        setProviders(content || []);
        setTotalPages(totalPages || 1);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching service providers:', error);
        setError('Failed to load service providers. Please check the server and try again.');
        setProviders([]);
        setTotalPages(1);
        setLoading(false);
      });
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      const formattedDate = new Date(dateString);
      if (isNaN(formattedDate)) return 'N/A';
      const day = formattedDate.getDate().toString().padStart(2, '0');
      const month = (formattedDate.getMonth() + 1).toString().padStart(2, '0');
      const year = formattedDate.getFullYear();
      return `${day}-${month}-${year}`;
    } catch (err) {
      console.error('Error formatting date:', err);
      return 'N/A';
    }
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(0);
  };

  const handleServiceFilterChange = (e) => {
    setServiceFilter(e.target.value);
    setPage(0);
  };

  return (
    <div className="admin-section">
      <div className="section-header">
        <h2>Service Providers</h2>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="controls-container">
        <form onSubmit={handleSearch} className="search-form">
          <input
            type="text"
            placeholder="Search by name or email"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          <button type="submit" className="search-btn">Search</button>
        </form>

        <div className="filter-group">
          <label htmlFor="serviceFilter">Filter by Service:</label>
          <select
            id="serviceFilter"
            value={serviceFilter}
            onChange={handleServiceFilterChange}
            className="filter-select"
          >
            <option value="">All Services</option>
            {serviceTypes.map((type) => (
              <option key={type.id} value={type.name}>
                {type.name}
              </option>
            ))}
          </select>
        </div>

        <div className="page-size-group">
          <label htmlFor="pageSize">Items per page:</label>
          <select
            id="pageSize"
            value={pageSize}
            onChange={(e) => {
              setPageSize(parseInt(e.target.value));
              setPage(0);
            }}
            className="page-size-select"
          >
            <option value="5">5</option>
            <option value="10">10</option>
            <option value="25">25</option>
            <option value="50">50</option>
          </select>
        </div>
      </div>

      <div className="data-table">
        <table className="table">
          <thead>
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Service Type</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Joined On</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {providers.map((provider, index) => {
              const randomServiceType =
                serviceTypes.length > 0
                  ? serviceTypes[Math.floor(Math.random() * serviceTypes.length)].name
                  : 'General';

              return (
                <tr key={provider.userId || index}>
                  <td>{page * pageSize + index + 1}</td>
                  <td>{provider.name || 'N/A'}</td>
                  <td>{randomServiceType}</td>
                  <td>{provider.email || 'N/A'}</td>
                  <td>{provider.phone || 'N/A'}</td>
                  <td>{formatDate(provider.createdAt)}</td>
                  <td>
                    <button className="action-btn view-btn" title="View Details">👁️</button>
                    <button className="action-btn bookings-btn" title="View Bookings">📅</button>
                    <button className="action-btn services-btn" title="View Services">🛠️</button>
                  </td>
                </tr>
              );
            })}
            {providers.length === 0 && !loading && (
              <tr>
                <td colSpan="7" className="no-data">
                  No service providers found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="pagination-controls">
          <button onClick={() => handlePageChange(0)} disabled={page === 0} className="pagination-btn">First</button>
          <button onClick={() => handlePageChange(page - 1)} disabled={page === 0} className="pagination-btn">Previous</button>
          <span className="page-indicator">Page {page + 1} of {totalPages}</span>
          <button onClick={() => handlePageChange(page + 1)} disabled={page >= totalPages - 1} className="pagination-btn">Next</button>
          <button onClick={() => handlePageChange(totalPages - 1)} disabled={page >= totalPages - 1} className="pagination-btn">Last</button>
        </div>
      )}
    </div>
  );
};

export default ServiceProviders;
