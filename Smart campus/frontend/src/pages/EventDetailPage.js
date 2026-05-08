import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { eventService } from '../services/authService';
import { useAuth } from '../context/AuthContext';
import { FiCalendar, FiClock, FiMapPin, FiUsers, FiArrowLeft, FiEdit2, FiTrash2 } from 'react-icons/fi';
import { format } from 'date-fns';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const EventDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isRegistered, setIsRegistered] = useState(false);
  const [userEvents, setUserEvents] = useState([]);

  useEffect(() => {
    loadEvent();
    if (isAuthenticated()) {
      loadUserEvents();
    }
  }, [id]);

  const loadEvent = async () => {
    try {
      const data = await eventService.getEventById(id);
      setEvent(data);
    } catch (error) {
      toast.error('Failed to load event');
      navigate('/');
    } finally {
      setLoading(false);
    }
  };

  const loadUserEvents = async () => {
    try {
      const data = await eventService.getUserEvents();
      const eventIds = Array.isArray(data) ? data.map(e => e.id) : [];
      setUserEvents(eventIds);
      setIsRegistered(eventIds.includes(parseInt(id)));
    } catch (error) {
      console.error('Error loading user events:', error);
    }
  };

  const handleRegister = async () => {
    try {
      await eventService.registerForEvent(id);
      toast.success('Registered successfully!');
      setIsRegistered(true);
      loadEvent();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to register');
    }
  };

  const handleUnregister = async () => {
    try {
      await eventService.unregisterFromEvent(id);
      toast.success('Unregistered successfully!');
      setIsRegistered(false);
      loadEvent();
    } catch (error) {
      toast.error('Failed to unregister');
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this event?')) return;
    try {
      await eventService.deleteEvent(id);
      toast.success('Event deleted successfully!');
      navigate('/');
    } catch (error) {
      toast.error('Failed to delete event');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-600">Loading event...</p>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-600">Event not found</p>
      </div>
    );
  }

  const isEventCreator = isAuthenticated() && user && user.id === event.createdBy;
  const isFull = (event.registeredCount || 0) >= event.capacity;

  return (
    <div className="min-h-screen bg-gray-50">
      <ToastContainer />

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Back Button */}
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-8 font-semibold"
        >
          <FiArrowLeft /> Back to Events
        </button>

        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {/* Header Image */}
          <div className="h-64 bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center text-8xl">
            🎯
          </div>

          <div className="p-8">
            {/* Category Badge */}
            <div className="mb-4">
              <span className="inline-block px-4 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-semibold">
                {event.category}
              </span>
            </div>

            {/* Title */}
            <h1 className="text-4xl font-bold text-gray-800 mb-4">{event.title}</h1>

            {/* Organizer */}
            <div className="text-gray-600 mb-6">
              Organized by <span className="font-semibold">{event.firstName} {event.lastName}</span>
            </div>

            {/* Event Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 p-6 bg-gray-50 rounded-lg">
              <div className="flex gap-4">
                <FiCalendar className="text-blue-600" size={24} />
                <div>
                  <p className="text-sm text-gray-600">Date</p>
                  <p className="font-semibold text-gray-800">
                    {format(new Date(event.date), 'EEEE, MMMM dd, yyyy')}
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <FiClock className="text-blue-600" size={24} />
                <div>
                  <p className="text-sm text-gray-600">Time</p>
                  <p className="font-semibold text-gray-800">{event.time}</p>
                </div>
              </div>

              <div className="flex gap-4">
                <FiMapPin className="text-blue-600" size={24} />
                <div>
                  <p className="text-sm text-gray-600">Location</p>
                  <p className="font-semibold text-gray-800">{event.location}</p>
                </div>
              </div>

              <div className="flex gap-4">
                <FiUsers className="text-blue-600" size={24} />
                <div>
                  <p className="text-sm text-gray-600">Registrations</p>
                  <p className="font-semibold text-gray-800">
                    {event.registeredCount || 0}/{event.capacity}
                  </p>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">About This Event</h2>
              <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                {event.description}
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 flex-wrap">
              {isAuthenticated() ? (
                <>
                  {isRegistered ? (
                    <button
                      onClick={handleUnregister}
                      className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-semibold transition"
                    >
                      Unregister from Event
                    </button>
                  ) : (
                    <button
                      onClick={handleRegister}
                      disabled={isFull}
                      className={`px-6 py-3 rounded-lg font-semibold transition ${
                        isFull
                          ? 'bg-gray-400 text-gray-600 cursor-not-allowed'
                          : 'bg-green-600 hover:bg-green-700 text-white'
                      }`}
                    >
                      {isFull ? 'Event is Full' : 'Register for Event'}
                    </button>
                  )}

                  {isEventCreator && (
                    <>
                      <button
                        onClick={() => navigate(`/edit-event/${id}`)}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold flex items-center gap-2 transition"
                      >
                        <FiEdit2 /> Edit Event
                      </button>
                      <button
                        onClick={handleDelete}
                        className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-semibold flex items-center gap-2 transition"
                      >
                        <FiTrash2 /> Delete Event
                      </button>
                    </>
                  )}
                </>
              ) : (
                <button
                  onClick={() => navigate('/login')}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition"
                >
                  Login to Register
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetailPage;
