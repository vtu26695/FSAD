import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FiLogOut, FiMenu, FiX } from 'react-icons/fi';
import { useState } from 'react';

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
            <span className="text-2xl">🎓</span>
            <span className="font-bold text-lg">Smart Campus</span>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8">
            {isAuthenticated() && (
              <>
                <button
                  onClick={() => navigate('/')}
                  className="hover:text-blue-200 transition"
                >
                  Events
                </button>
                <button
                  onClick={() => navigate('/my-events')}
                  className="hover:text-blue-200 transition"
                >
                  My Events
                </button>
              </>
            )}
          </div>

          {/* User Profile / Auth Buttons */}
          <div className="hidden md:flex items-center gap-4">
            {isAuthenticated() && user ? (
              <div className="flex items-center gap-4">
                <div className="text-sm text-right">
                  <div className="font-semibold">{user.firstName} {user.lastName}</div>
                  <div className="text-blue-100">{user.email}</div>
                </div>
                <button
                  onClick={handleLogout}
                  className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded-lg flex items-center gap-2 transition"
                >
                  <FiLogOut /> Logout
                </button>
              </div>
            ) : (
              <div className="flex gap-3">
                <button
                  onClick={() => navigate('/login')}
                  className="bg-white text-blue-600 px-4 py-2 rounded-lg font-semibold hover:bg-blue-50 transition"
                >
                  Login
                </button>
                <button
                  onClick={() => navigate('/register')}
                  className="bg-blue-400 hover:bg-blue-500 px-4 py-2 rounded-lg font-semibold transition"
                >
                  Register
                </button>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <FiX size={24} /> : <FiMenu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden pb-4 space-y-3">
            {isAuthenticated() && (
              <>
                <button
                  onClick={() => {
                    navigate('/');
                    setIsOpen(false);
                  }}
                  className="block w-full text-left px-4 py-2 hover:bg-blue-500 rounded-lg"
                >
                  Events
                </button>
                <button
                  onClick={() => {
                    navigate('/my-events');
                    setIsOpen(false);
                  }}
                  className="block w-full text-left px-4 py-2 hover:bg-blue-500 rounded-lg"
                >
                  My Events
                </button>
              </>
            )}
            {!isAuthenticated() && (
              <>
                <button
                  onClick={() => {
                    navigate('/login');
                    setIsOpen(false);
                  }}
                  className="block w-full text-left px-4 py-2 hover:bg-blue-500 rounded-lg"
                >
                  Login
                </button>
                <button
                  onClick={() => {
                    navigate('/register');
                    setIsOpen(false);
                  }}
                  className="block w-full text-left px-4 py-2 hover:bg-blue-500 rounded-lg"
                >
                  Register
                </button>
              </>
            )}
            {isAuthenticated() && (
              <button
                onClick={handleLogout}
                className="block w-full text-left px-4 py-2 bg-red-500 hover:bg-red-600 rounded-lg"
              >
                Logout
              </button>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
