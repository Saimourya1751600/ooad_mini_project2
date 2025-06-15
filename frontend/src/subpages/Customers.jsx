import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Customers.css';

const Customers = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchCustomers();
  }, [page, pageSize, searchTerm]);

  const fetchCustomers = () => {
    setLoading(true);
    axios
      .get(`http://localhost:8080/api/users?type=CUSTOMER&page=${page}&size=${pageSize}&search=${encodeURIComponent(searchTerm)}`)
      .then((response) => {
        const { content, totalPages } = response.data;
        setCustomers(content || []);
        setTotalPages(totalPages || 1);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching customers:', {
          message: error.message,
          response: error.response ? error.response.data : null,
          status: error.response ? error.response.status : null,
        });
        setError('Failed to load customers. Please check the server and try again.');
        setCustomers([]);
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

  return (
    <div className="admin-section">
      <div className="section-header">
        <h2>Customers</h2>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="controls-container">
        <div className="search-form">
          <input
            type="text"
            placeholder="Search by name or email"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setPage(0); // Reset to first page when search changes
            }}
            className="search-input"
          />
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
              <th>Email</th>
              <th>Phone</th>
              <th>Joined On</th>
            </tr>
          </thead>
          <tbody>
            {customers.map((customer, index) => (
              <tr key={customer.userId || index}>
                <td>{page * pageSize + index + 1}</td>
                <td>{customer.name || 'N/A'}</td>
                <td>{customer.email || 'N/A'}</td>
                <td>{customer.phone || 'N/A'}</td>
                <td>{formatDate(customer.createdAt)}</td>
              </tr>
            ))}
            {customers.length === 0 && !loading && (
              <tr>
                <td colSpan="5" className="no-data">
                  No customers found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="pagination-controls">
          <button
            onClick={() => handlePageChange(0)}
            disabled={page === 0}
            className="pagination-btn"
          >
            First
          </button>
          <button
            onClick={() => handlePageChange(page - 1)}
            disabled={page === 0}
            className="pagination-btn"
          >
            Previous
          </button>
          <span className="page-indicator">
            Page {page + 1} of {totalPages}
          </span>
          <button
            onClick={() => handlePageChange(page + 1)}
            disabled={page >= totalPages - 1}
            className="pagination-btn"
          >
            Next
          </button>
          <button
            onClick={() => handlePageChange(totalPages - 1)}
            disabled={page >= totalPages - 1}
            className="pagination-btn"
          >
            Last
          </button>
        </div>
      )}
    </div>
  );
};

export default Customers;
