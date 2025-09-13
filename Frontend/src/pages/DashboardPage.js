import React, { useEffect, useState } from 'react';
import api from '../../config/axios'; // Use centralized api instance
import { useAuth } from '../../context/AuthContext';

const DashboardPage = () => {
  const { user } = useAuth();
  const [events, setEvents] = useState([]);
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null); // Clear previous errors
      
      // Only fetch if user is an organizer or admin
      if (!user || (user.role !== 'organizer' && user.role !== 'admin')) {
        setError('You are not authorized to view this dashboard.');
        setLoading(false);
        return;
      }

      // Fetch events for the organizer/admin
      const eventsResponse = await api.get('/api/events/my-events');
      setEvents(eventsResponse.data);

      // Fetch stats for the organizer/admin
      const statsResponse = await api.get('/api/events/stats'); // Assuming /stats endpoint gets stats for the logged-in organizer/admin
      setStats(statsResponse.data);

      setLoading(false);
    } catch (error) {
      console.error('Error fetching organizer dashboard data:', error);
      setError(error.response?.data?.message || 'Failed to load dashboard data');
      setLoading(false);
    }
  };

  useEffect(() => {
    // Fetch data only if user is available (ensures token is likely present)
    if (user) {
      fetchData();
    }
  }, [user]); // Rerun when user changes

  if (loading) {
    return <div>Loading dashboard...</div>; // Basic loading indicator
  }

  if (error) {
    return <div>Error: {error}</div>; // Display error message
  }

  // TODO: Render the actual dashboard content based on events and stats
  return (
    <div>
      <h1>Organizer/Admin Dashboard</h1>
      <p>User Role: {user?.role}</p>
      <h2>Your Events</h2>
      {events.length === 0 ? (
        <p>No events found.</p>
      ) : (
        <ul>
          {events.map(event => (
            <li key={event._id}>{event.name} - {new Date(event.date).toLocaleDateString()}</li>
          ))}
        </ul>
      )}
      
      <h2>Stats</h2>
      <pre>{JSON.stringify(stats, null, 2)}</pre>
      
      {/* Placeholder for actual dashboard UI */}
    </div>
  );
};

export default DashboardPage; 