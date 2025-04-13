// src/components/ServiceProviders.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ServiceProviders = () => {
  const [providers, setProviders] = useState([]);

  const fetchProviders = () => {
    axios.get('http://localhost:8080/api/service-providers')
      .then(response => {
        setProviders(response.data);
      })
      .catch(error => {
        console.error('Error fetching service providers:', error);
      });
  };

  useEffect(() => {
    fetchProviders();
  }, []);

  const updateStatus = (providerId, newStatus) => {
    axios.post(`http://localhost:8080/api/service-providers/${providerId}/status`, { status: newStatus })
      .then(() => {
        fetchProviders(); // Refresh list after update
      })
      .catch(error => {
        console.error('Error updating status:', error);
      });
  };

  return (
    <div className="section-wrapper">
      <h1>Service Providers</h1>
      <p>Manage all registered service providers here.</p>
      <table className="table-auto w-full mt-6 border">
        <thead>
          <tr className="bg-gray-200 text-left">
            <th className="px-4 py-2">Name</th>
            <th className="px-4 py-2">Email</th>
            <th className="px-4 py-2">Phone</th>
            <th className="px-4 py-2">Address</th>
            <th className="px-4 py-2">Joined</th>
            <th className="px-4 py-2">Status</th>
            <th className="px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {providers.map(provider => (
            <tr key={provider.provider_id} className="border-t">
              <td className="px-4 py-2">{provider.name}</td>
              <td className="px-4 py-2">{provider.email}</td>
              <td className="px-4 py-2">{provider.phone}</td>
              <td className="px-4 py-2">{provider.address}</td>
              <td className="px-4 py-2">{new Date(provider.created_at).toLocaleDateString()}</td>
              <td className="px-4 py-2">{provider.approval_status}</td>
              <td className="px-4 py-2 space-x-2">
                <button
                  onClick={() => updateStatus(provider.provider_id, 'APPROVED')}
                  className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded"
                >
                  Approve
                </button>
                <button
                  onClick={() => updateStatus(provider.provider_id, 'REJECTED')}
                  className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                >
                  Reject
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ServiceProviders;
