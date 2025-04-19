import React, { useState, useEffect } from 'react';
import '../styles/HelpQueries.css';

const HelpQueries = () => {
  const [queries, setQueries] = useState([]);
  const [userNameFilter, setUserNameFilter] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchQueries();
  }, [userNameFilter]);

  const fetchQueries = async () => {
    setLoading(true);
    try {
      const url = userNameFilter
        ? `http://localhost:8080/api/help-queries?userName=${encodeURIComponent(userNameFilter)}`
        : 'http://localhost:8080/api/help-queries';
      const response = await fetch(url);
      if (!response.ok) throw new Error('Failed to fetch queries');
      const data = await response.json();
      setQueries(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="help-queries">
      <h2>Help Queries</h2>
      {/* <div className="filter">
        <label>Filter by User Name: </label>
        <input
          type="text"
          value={userNameFilter}
          onChange={(e) => setUserNameFilter(e.target.value)}
          placeholder="Enter user name..."
        />
      </div> */}
      {loading ? (
        <div>Loading...</div>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Query ID</th>
              <th>User Name</th>
              <th>Message</th>
            </tr>
          </thead>
          <tbody>
            {queries.length === 0 ? (
              <tr>
                <td colSpan="3">No queries found.</td>
              </tr>
            ) : (
              queries.map((query) => (
                <tr key={query.queryId}>
                  <td>{query.queryId}</td>
                  <td>{query.userName || 'Unknown'}</td>
                  <td>{query.message}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default HelpQueries;
