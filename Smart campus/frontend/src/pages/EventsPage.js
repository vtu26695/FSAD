import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { eventService } from '../services/authService';
import { useAuth } from '../context/AuthContext';
import EventCard from '../components/EventCard';
import { FiSearch, FiPlus } from 'react-icons/fi';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const EventsPage = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [events, setEvents] = useState([]);
  const [registeredEvents, setRegisteredEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);

  const categories = ['all', 'Academic', 'Sports', 'Cultural', 'Social', 'Workshop', 'Seminar'];

  useEffect(() => {
    loadEvents();
    if (isAuthenticated()) {
      loadUserRegistrations();
    }
  }, [selectedCategory, searchTerm]);

  const loadEvents = async () => {
    try {
      setLoading(true);
      const data = await eventService.getAllEvents(
        selectedCategory === 'all' ? undefined : selectedCategory,
        searchTerm
      );
      setEvents(Array.isArray(data) ? data : []);
    } catch (error) {
      toast.error('Failed to load events');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const loadUserRegistrations = async () => {
    try {
      const data = await eventService.getUserEvents();
      setRegisteredEvents(Array.isArray(data) ? data.map(e => e.id) : []);
    } catch (error) {
      console.error('Failed to load user events:', error);
    }
  };

  const handleRegister = async (eventId) => {
    if (!isAuthenticated()) {
      navigate('/login');
      return;
    }

    try {
      await eventService.registerForEvent(eventId);
      toast.success('Registered for event successfully!');
      setRegisteredEvents([...registeredEvents, eventId]);
      loadEvents();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to register');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <ToastContainer />

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-12">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-4xl font-bold mb-2">Discover Campus Events</h1>
          <p className="text-blue-100">Explore and register for exciting events happening on campus</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Controls */}
        <div className="mb-8 space-y-4">
          {/* Search and Create */}
          <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center">
            <div className="relative flex-1">
              <FiSearch className="absolute left-3 top-3 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search events..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              />
            </div>
            {isAuthenticated() && (
              <button
                onClick={() => setShowCreateModal(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold flex items-center gap-2 transition"
              >
                <FiPlus /> Create Event
              </button>
            )}
          </div>

          {/* Category Filter */}
          <div className="flex gap-2 overflow-x-auto pb-2">
            {categories.map(category => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-full font-semibold whitespace-nowrap transition ${
                  selectedCategory === category
                    ? 'bg-blue-600 text-white'
                    : 'bg-white border-2 border-gray-300 text-gray-700 hover:border-blue-600'
                }`}
              >
                {category === 'all' ? '📅 All' : category}
              </button>
            ))}
          </div>
        </div>

        {/* Events Grid */}
        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">Loading events...</p>
          </div>
        ) : events.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <div className="text-5xl mb-4">📭</div>
            <p className="text-gray-600 text-lg">No events found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map(event => (
              <EventCard
                key={event.id}
                event={event}
                onEventClick={(eventId) => navigate(`/events/${eventId}`)}
                onRegister={handleRegister}
                isRegistered={registeredEvents.includes(event.id)}
                isFull={(event.registeredCount || 0) >= event.capacity}
              />
            ))}
          </div>
        )}
      </div>

      {/* Create Event Modal - Simple version */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-8 max-w-2xl w-full max-h-screen overflow-y-auto">
            <h2 className="text-2xl font-bold mb-6">Create New Event</h2>
            <button
              onClick={() => setShowCreateModal(false)}
              className="float-right text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
            <div className="clear-both">
              <p className="text-gray-600 mb-6">Redirect to create event page...</p>
              <button
                onClick={() => {
                  setShowCreateModal(false);
                  navigate('/create-event');
                }}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold"
              >
                Go to Create Event
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EventsPage;
