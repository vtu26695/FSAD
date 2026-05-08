import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { eventService } from '../services/authService';
import { useAuth } from '../context/AuthContext';
import EventCard from '../components/EventCard';
import { FiArrowLeft } from 'react-icons/fi';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const MyEventsPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated()) {
      navigate('/login');
      return;
    }
    loadMyEvents();
  }, []);

  const loadMyEvents = async () => {
    try {
      setLoading(true);
      const data = await eventService.getUserEvents();
      setEvents(Array.isArray(data) ? data : []);
    } catch (error) {
      toast.error('Failed to load your events');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleUnregister = async (eventId) => {
    try {
      await eventService.unregisterFromEvent(eventId);
      toast.success('Unregistered from event successfully!');
      setEvents(events.filter(e => e.id !== eventId));
    } catch (error) {
      toast.error('Failed to unregister');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <ToastContainer />

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-indigo-600 to-blue-600 text-white py-12">
        <div className="max-w-7xl mx-auto px-4">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-blue-100 hover:text-white mb-4 font-semibold"
          >
            <FiArrowLeft /> Back to All Events
          </button>
          <h1 className="text-4xl font-bold mb-2">My Registered Events</h1>
          <p className="text-blue-100">Events you've registered for</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">Loading your events...</p>
          </div>
        ) : events.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <div className="text-5xl mb-4">📭</div>
            <p className="text-gray-600 text-lg mb-6">You haven't registered for any events yet</p>
            <button
              onClick={() => navigate('/')}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold"
            >
              Browse Events
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map(event => (
              <EventCard
                key={event.id}
                event={event}
                onEventClick={(eventId) => navigate(`/events/${eventId}`)}
                onRegister={handleUnregister}
                isRegistered={true}
                isFull={false}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyEventsPage;
