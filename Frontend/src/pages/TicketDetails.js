import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../config/axios';
import QRCode from 'react-qr-code';
import { useAuth } from '../context/AuthContext';

const TicketDetailsPage = () => {
  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { ticketId } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  // Log ticketId at the very beginning of the component
  console.log('TicketDetails: Initial ticketId from useParams:', ticketId);

  useEffect(() => {
    const fetchTicket = async () => {
      try {
        setLoading(true);
        setError(null);
        
        console.log('Fetching ticket with ID:', ticketId);
        const response = await api.get(`/tickets/${ticketId}`);
        console.log('Raw API Response:', response);
        
        if (!response.data) {
          throw new Error('No ticket data received');
        }

        setTicket(response.data);
      } catch (e) {
        console.error('Error fetching ticket:', e);
        if (e.response) {
          setError(e.response.data.message || 'Failed to load ticket details');
        } else if (e.request) {
          setError('No response from server. Please check if the server is running.');
        } else {
          setError(e.message || 'Error setting up the request');
        }
      } finally {
        setLoading(false);
      }
    };

    if (ticketId) {
      fetchTicket();
    } else {
      setError('No ticket ID provided');
      setLoading(false);
    }
  }, [ticketId]);

  // Function to generate QR code value
  const generateQRValue = () => {
    if (!ticket || !ticket._id) {
      console.log('generateQRValue: Ticket or Ticket ID not available.', { ticket });
      return '';
    }
    const frontendUrl = window.location.origin;
    const qrValue = `${frontendUrl}/tickets/${ticket._id}`;
    console.log('generateQRValue: Frontend URL:', frontendUrl);
    console.log('generateQRValue: Generated QR Value:', qrValue);
    return qrValue;
  };

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return 'Date not available';
    try {
      const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
      return new Date(dateString).toLocaleDateString(undefined, options);
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'Invalid date';
    }
  };

  console.log('TicketDetails: Current ticket state before rendering:', ticket);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Error</h2>
          <p className="text-gray-700 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!ticket) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">No Ticket Found</h2>
          <p className="text-gray-600">The requested ticket could not be found.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold text-gray-900">Ticket Details</h1>
              {isAuthenticated && (
                <button
                  onClick={() => navigate('/my-tickets')}
                  className="text-blue-600 hover:text-blue-800"
                >
                  ← Back to My Tickets
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Event Details */}
              <div className="space-y-6">
                <div className="bg-gray-50 p-6 rounded-lg">
                  <h2 className="text-xl font-semibold text-gray-800 mb-4">Event Information</h2>
                  <div className="space-y-3">
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Event Name</h3>
                      <p className="text-lg text-gray-900">{ticket.event.name}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Date</h3>
                      <p className="text-gray-900">{formatDate(ticket.event.date)}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Time</h3>
                      <p className="text-gray-900">{ticket.event.time}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Location</h3>
                      <p className="text-gray-900">{ticket.event.location}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Description</h3>
                      <p className="text-gray-900">{ticket.event.description}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Category</h3>
                      <p className="text-gray-900">{ticket.event.category}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 p-6 rounded-lg">
                  <h2 className="text-xl font-semibold text-gray-800 mb-4">Ticket Information</h2>
                  <div className="space-y-3">
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Ticket ID</h3>
                      <p className="text-gray-900">{ticket._id}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Number of Seats</h3>
                      <p className="text-gray-900">{ticket.seats}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Status</h3>
                      <p className="text-gray-900 capitalize">{ticket.status}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Purchase Date</h3>
                      <p className="text-gray-900">{formatDate(ticket.createdAt)}</p>
                    </div>
                    {isAuthenticated && (
                      <div>
                        <h3 className="text-sm font-medium text-gray-500">Total Amount</h3>
                        <p className="text-gray-900">{ticket.event?.ticketPrice && !isNaN(ticket.event.ticketPrice) ? 
                          `$${(ticket.event.ticketPrice * ticket.seats).toFixed(2)}` : 
                          'N/A'}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* QR Code Section */}
              <div className="flex flex-col items-center justify-center p-6 bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg border border-gray-200">
                <h2 className="text-xl font-semibold text-gray-800 mb-6">Ticket QR Code</h2>
                <div className="bg-white p-6 rounded-lg shadow-md transform transition-all duration-300 hover:scale-105 hover:shadow-lg">
                  <QRCode
                    value={generateQRValue()}
                    size={Math.min(window.innerWidth * 0.3, 200)}
                    level="H"
                    includeMargin={true}
                    style={{ 
                      height: 'auto',
                      maxWidth: '100%',
                      width: '100%'
                    }}
                  />
                </div>
                <div className="mt-6 text-center space-y-2">
                  <p className="text-sm text-gray-600 font-medium">Scan this QR code at the event</p>
                  <div className="flex items-center justify-center space-x-2 text-xs text-gray-500">
                    <span className="inline-block w-2 h-2 bg-green-500 rounded-full"></span>
                    <p>Ticket ID: {ticket._id}</p>
                  </div>
                  <p className="text-xs text-gray-400 mt-2">Valid for entry on {formatDate(ticket.event.date)}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TicketDetailsPage; 