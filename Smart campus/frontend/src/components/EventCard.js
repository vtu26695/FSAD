import React from 'react';
import { format } from 'date-fns';
import { FiCalendar, FiClock, FiMapPin, FiUsers } from 'react-icons/fi';

const EventCard = ({ event, onEventClick, onRegister, isRegistered, isFull }) => {
  const getCategoryColor = (category) => {
    const colors = {
      'Academic': 'bg-blue-100 text-blue-800',
      'Sports': 'bg-green-100 text-green-800',
      'Cultural': 'bg-purple-100 text-purple-800',
      'Social': 'bg-pink-100 text-pink-800',
      'Workshop': 'bg-yellow-100 text-yellow-800',
      'Seminar': 'bg-indigo-100 text-indigo-800',
    };
    return colors[category] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition overflow-hidden cursor-pointer group">
      {/* Image placeholder */}
      <div className="h-40 bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center text-4xl text-white">
        🎯
      </div>

      <div className="p-5">
        {/* Category Badge */}
        <div className="flex gap-2 mb-3">
          <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${getCategoryColor(event.category)}`}>
            {event.category}
          </span>
        </div>

        {/* Title */}
        <h3
          className="text-lg font-bold text-gray-800 mb-2 group-hover:text-blue-600 transition line-clamp-2"
          onClick={() => onEventClick(event.id)}
        >
          {event.title}
        </h3>

        {/* Description */}
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
          {event.description}
        </p>

        {/* Event Details */}
        <div className="space-y-2 text-gray-700 text-sm mb-4">
          <div className="flex items-center gap-2">
            <FiCalendar size={16} className="text-blue-600" />
            {format(new Date(event.date), 'MMM dd, yyyy')}
          </div>
          <div className="flex items-center gap-2">
            <FiClock size={16} className="text-blue-600" />
            {event.time}
          </div>
          <div className="flex items-center gap-2">
            <FiMapPin size={16} className="text-blue-600" />
            <span className="truncate">{event.location}</span>
          </div>
          <div className="flex items-center gap-2">
            <FiUsers size={16} className="text-blue-600" />
            {event.registeredCount || 0}/{event.capacity} registered
          </div>
        </div>

        {/* Organizer */}
        <div className="text-xs text-gray-500 mb-4 pb-4 border-b">
          by {event.firstName} {event.lastName}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <button
            onClick={() => onEventClick(event.id)}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-semibold transition"
          >
            View Details
          </button>
          {onRegister && (
            <button
              onClick={() => onRegister(event.id)}
              disabled={isFull || isRegistered}
              className={`flex-1 py-2 rounded-lg font-semibold transition ${
                isRegistered
                  ? 'bg-green-200 text-green-800 cursor-not-allowed'
                  : isFull
                  ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                  : 'bg-indigo-600 hover:bg-indigo-700 text-white'
              }`}
            >
              {isRegistered ? 'Registered' : isFull ? 'Full' : 'Register'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default EventCard;
