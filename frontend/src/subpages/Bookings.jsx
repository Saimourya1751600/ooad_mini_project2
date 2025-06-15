import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import '../styles/AdminDashboard.css';

const Bookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [filter, setFilter] = useState('ALL');

  const fetchBookings = useCallback(() => {
    setLoading(true);
    const url = `http://localhost:8080/api/bookings?page=${page}&size=${pageSize}&status=${filter}`;
    axios.get(url)
      .then(response => {
        if (response.data.content) {
          setBookings(response.data.content);
          setTotalPages(response.data.totalPages);
        } else {
          setBookings(response.data);
          setTotalPages(Math.ceil(response.data.length / pageSize));
        }
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching bookings:', error);
        setError('Failed to load bookings. Please try again later.');
        setLoading(false);
      });
  }, [page, pageSize, filter]);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  const getStatusClass = (status) => {
    switch (status) {
      case 'CONFIRMED':
        return 'status-confirmed';
      case 'CANCELLED':
        return 'status-cancelled';
      case 'COMPLETED':
        return 'status-completed';
      case 'PENDING':
        return 'status-pending';
      default:
        return '';
    }
  };

  const handleFilterChange = (e) => {
    setFilter(e.target.value);
    setPage(0); // Reset to first page when filter changes
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  return (
    <div className="main-content">
      <div className="section-wrapper">
        <div className="dashboard-header">
          <h2>Bookings</h2>
          {/* <p>Overview of service bookings</p> */}
        </div>

        {error && <div className="notification-card text-red-600">{error}</div>}

        <div className="filter-controls">
          <div className="filter-group">
            <label htmlFor="statusFilter" className="block text-sm font-medium text-gray-700">Filter by Status</label>
            <select
              id="statusFilter"
              value={filter}
              onChange={handleFilterChange}
              className="settings-input-group select-dropdown"
            >
              <option value="ALL">All Bookings</option>
              <option value="CONFIRMED">Confirmed</option>
              <option value="CANCELLED">Cancelled</option>
              <option value="COMPLETED">Completed</option>
            </select>
          </div>

          <div className="filter-group">
            <label htmlFor="pageSize" className="block text-sm font-medium text-gray-700">Items per page</label>
            <select
              id="pageSize"
              value={pageSize}
              onChange={(e) => {
                setPageSize(parseInt(e.target.value));
                setPage(0);
              }}
              className="settings-input-group select-dropdown"
            >
              <option value="5">5</option>
              <option value="10">10</option>
              <option value="25">25</option>
              <option value="50">50</option>
            </select>
          </div>
        </div>

        {loading ? (
          <div className="loading text-center py-10 text-gray-500">Loading bookings...</div>
        ) : (
          <div className="table-container">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Booking ID</th>
                  <th>Customer</th>
                  <th>Provider</th>
                  <th>Service</th>
                  <th>Date</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {bookings.length > 0 ? (
                  bookings.map((booking) => (
                    <tr key={booking.bookingId}>
                      <td>{booking.bookingId}</td>
                      <td>{booking.customerName}</td>
                      <td>{booking.providerName}</td>
                      <td>{booking.serviceName}</td>
                      <td>{booking.bookingDate ? new Date(booking.bookingDate).toLocaleDateString() : 'N/A'}</td>
                      <td className={getStatusClass(booking.status)}>
                        {booking.status}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="text-center py-4 text-gray-500">No bookings found</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

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
    </div>
  );
};

export default Bookings;
