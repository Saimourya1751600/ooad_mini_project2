import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../styles/AdminDashboard.css';

const STATUS_OPTIONS = ['PENDING', 'APPROVED', 'REJECTED'];

const ServiceProviders = () => {
  const [providers, setProviders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    fetchProviders();
  }, [page, pageSize]);

  const fetchProviders = () => {
    setLoading(true);
    axios
      .get(`http://localhost:8080/api/admin/service-providers/applications?page=${page}&size=${pageSize}`)
      .then((response) => {
        const { content, totalPages } = response.data;
        setProviders(content || []);
        setTotalPages(totalPages || 1);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching service providers:', error);
        setError('Failed to load service providers.');
        setProviders([]);
        setTotalPages(1);
        setLoading(false);
      });
  };

  const handleStatusChange = async (providerId, newStatus) => {
    try {
      await axios.post('http://localhost:8080/api/admin/service-providers/update-status', {
        providerId,
        status: newStatus,
        remarks: `Status changed to ${newStatus} by admin`
      });
      fetchProviders(); // Refresh the list
    } catch (err) {
      console.error('Error updating status:', err);
    }
  };

  return (
    <div className="admin-section">
      <div className="section-header">
        <h2>Service Providers</h2>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="data-table">
        <table className="table">
          <thead>
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Service Types</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Status</th>
              <th>Change Status</th>
            </tr>
          </thead>
          <tbody>
            {providers.map((provider, index) => (
              <tr key={provider.user_id}>
                <td>{page * pageSize + index + 1}</td>
                <td>{provider.name || 'N/A'}</td>
                <td>{provider.service_types || 'N/A'}</td>
                <td>{provider.email || 'N/A'}</td>
                <td>{provider.phone || 'N/A'}</td>
                <td>{provider.approval_status}</td>
                <td>
                  <select
                    value={provider.approval_status}
                    onChange={(e) => handleStatusChange(provider.user_id, e.target.value)}
                    className={`status-select ${provider.approval_status.toLowerCase()}`}
                  >
                    {STATUS_OPTIONS.map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>
                </td>
              </tr>
            ))}
            {!loading && providers.length === 0 && (
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
          <button onClick={() => setPage(0)} disabled={page === 0}>First</button>
          <button onClick={() => setPage((prev) => Math.max(prev - 1, 0))} disabled={page === 0}>Previous</button>
          <span>Page {page + 1} of {totalPages}</span>
          <button onClick={() => setPage((prev) => Math.min(prev + 1, totalPages - 1))} disabled={page >= totalPages - 1}>Next</button>
          <button onClick={() => setPage(totalPages - 1)} disabled={page >= totalPages - 1}>Last</button>
        </div>
      )}
    </div>
  );
};

export default ServiceProviders;
