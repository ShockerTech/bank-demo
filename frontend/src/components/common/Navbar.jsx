import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setIsMenuOpen(false);
    navigate("/home");
  };

  // White theme for all public pages
  const isPublicPage = location.pathname === "/" || 
                      location.pathname === "/home" || 
                      location.pathname === "/login" || 
                      location.pathname === "/register";

  return (
    <nav className={`${isPublicPage ? 'fixed top-0 w-full bg-white/95 backdrop-blur-sm shadow-sm z-50 transition-all' : 'bg-blue-600 text-white shadow-lg fixed top-0 left-0 w-full z-50'}`}>
      <div className="container mx-auto px-4">
        <div className={`flex items-center justify-between ${isPublicPage ? 'py-4' : 'h-16'}`}>
          {/* Logo */}
          <Link
            to={user ? "/dashboard" : "/home"}
            className="flex items-center space-x-2"
            onClick={() => setIsMenuOpen(false)} 
          >
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center`}>
              <img
                src="/images/logo.png"
                alt="DemoBank Logo"
                className="w-full h-full object-contain"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.parentElement.innerHTML = `<span class="${isPublicPage ? 'text-blue-600 font-bold text-xl' : 'text-blue-600 font-bold text-xl'}">DB</span>`;
                }}
              />
            </div>
            <span className={`text-2xl font-bold ${isPublicPage ? 'text-gray-800' : 'text-white'}`}>DemoBank</span>
          </Link>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center space-x-6">
            {user ? (
              // Logged-in User Menu (Blue theme)
              <>
                <Link to="/dashboard" className={`${isPublicPage ? 'text-gray-600 hover:text-blue-600' : 'hover:text-blue-200'} transition`}>
                  Dashboard
                </Link>
                <Link to="/accounts" className={`${isPublicPage ? 'text-gray-600 hover:text-blue-600' : 'hover:text-blue-200'} transition`}>
                  Accounts
                </Link>
                <Link to="/transfer" className={`${isPublicPage ? 'text-gray-600 hover:text-blue-600' : 'hover:text-blue-200'} transition`}>
                  Transfer
                </Link>
                <Link
                  to="/transactions"
                  className={`${isPublicPage ? 'text-gray-600 hover:text-blue-600' : 'hover:text-blue-200'} transition`}
                >
                  Transactions
                </Link>
                <div className="flex items-center space-x-4">
                  <span className={`text-sm ${isPublicPage ? 'text-gray-600' : 'text-white'}`}>Welcome, {user.username}</span>
                  <button
                    onClick={handleLogout}
                    className={`${isPublicPage ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-blue-700 hover:bg-blue-800'} px-4 py-2 rounded transition`}
                  >
                    Logout
                  </button>
                </div>
              </>
            ) : (
              // Public Menu - White theme for all public pages
              isPublicPage ? (
                // Public Pages Navigation (Home, Login, Register)
                location.pathname === "/home" || location.pathname === "/" ? (
                  // Home Page Specific Navigation
                  <>
                    <a href="#features" className="text-gray-600 hover:text-blue-600 transition">
                      Features
                    </a>
                    <a href="#how-it-works" className="text-gray-600 hover:text-blue-600 transition">
                      How It Works
                    </a>
                    <a href="#testimonials" className="text-gray-600 hover:text-blue-600 transition">
                      Testimonials
                    </a>
                    <button
                      onClick={() => navigate('/login')}
                      className="text-blue-600 hover:text-blue-700 font-semibold transition"
                    >
                      Login
                    </button>
                    <button
                      onClick={() => navigate('/register')}
                      className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition transform hover:scale-105"
                    >
                      Get Started
                    </button>
                  </>
                ) : (
                  // Login/Register Pages Navigation
                  <>
                    <button
                      onClick={() => navigate('/login')}
                      className="text-blue-600 hover:text-blue-700 font-semibold transition"
                    >
                      Login
                    </button>
                    <button
                      onClick={() => navigate('/register')}
                      className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition transform hover:scale-105"
                    >
                      Get Started
                    </button>
                  </>
                )
              ) : (
                // Fallback (shouldn't reach here for public pages)
                <>
                  <Link
                    to="/login"
                    className="bg-blue-700 hover:bg-blue-800 px-4 py-2 rounded transition"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="bg-white text-blue-600 hover:bg-gray-100 px-4 py-2 rounded transition"
                  >
                    Register
                  </Link>
                </>
              )
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className={`md:hidden ${isPublicPage ? 'text-gray-600' : 'text-white'} focus:outline-none hover:${isPublicPage ? 'text-blue-600' : 'text-blue-200'} transition`}
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? (
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            ) : (
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown with Backdrop */}
      {isMenuOpen && (
        <>
          {/* Backdrop - Click outside to close */}
          <div 
            className="fixed inset-0 bg-black bg-opacity-30 z-30 md:hidden"
            onClick={() => setIsMenuOpen(false)}
          ></div>
          
          {/* Mobile Menu */}
          <div className={`md:hidden ${isPublicPage ? 'bg-white text-gray-800 shadow-lg' : 'bg-blue-700 text-white'} px-4 py-4 space-y-3 absolute top-full left-0 w-full z-40 shadow-xl animate-slide-down`}>
            {user ? (
              // Logged-in Mobile Menu
              <>
                <Link
                  to="/dashboard"
                  className={`block ${isPublicPage ? 'hover:bg-gray-100' : 'hover:bg-blue-600'} px-4 py-3 rounded transition`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  📊 Dashboard
                </Link>
                <Link
                  to="/accounts"
                  className={`block ${isPublicPage ? 'hover:bg-gray-100' : 'hover:bg-blue-600'} px-4 py-3 rounded transition`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  💳 Accounts
                </Link>
                <Link
                  to="/transfer"
                  className={`block ${isPublicPage ? 'hover:bg-gray-100' : 'hover:bg-blue-600'} px-4 py-3 rounded transition`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  💸 Transfer
                </Link>
                <Link
                  to="/transactions"
                  className={`block ${isPublicPage ? 'hover:bg-gray-100' : 'hover:bg-blue-600'} px-4 py-3 rounded transition`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  📜 Transactions
                </Link>
                <Link
                  to="/profile"
                  className={`block ${isPublicPage ? 'hover:bg-gray-100' : 'hover:bg-blue-600'} px-4 py-3 rounded transition`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  👤 Profile Settings
                </Link>
                <div className={`border-t ${isPublicPage ? 'border-gray-200' : 'border-blue-600'} pt-3 mt-3`}>
                  <p className={`text-sm ${isPublicPage ? 'text-gray-600' : 'text-blue-200'} px-4 py-2`}>
                    Logged in as <span className={`font-semibold ${isPublicPage ? 'text-gray-800' : 'text-white'}`}>{user.username}</span>
                  </p>
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsMenuOpen(false);
                    }}
                    className={`block ${isPublicPage ? 'bg-gray-100 text-gray-800 hover:bg-gray-200' : 'bg-blue-800 hover:bg-blue-900'} px-4 py-3 rounded w-full text-left transition`}
                  >
                    🚪 Logout
                  </button>
                </div>
              </>
            ) : (
              // Public Mobile Menu - White theme
              isPublicPage ? (
                // Public Pages Mobile Menu
                location.pathname === "/home" || location.pathname === "/" ? (
                  // Home Page Mobile Menu
                  <>
                    <a 
                      href="#features" 
                      className="block hover:bg-gray-100 px-4 py-3 rounded transition"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Features
                    </a>
                    <a 
                      href="#how-it-works" 
                      className="block hover:bg-gray-100 px-4 py-3 rounded transition"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      How It Works
                    </a>
                    <a 
                      href="#testimonials" 
                      className="block hover:bg-gray-100 px-4 py-3 rounded transition"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Testimonials
                    </a>
                    <button
                      onClick={() => {
                        navigate('/login');
                        setIsMenuOpen(false);
                      }}
                      className="block w-full text-left text-blue-600 hover:bg-gray-100 px-4 py-3 rounded transition font-semibold"
                    >
                      Login
                    </button>
                    <button
                      onClick={() => {
                        navigate('/register');
                        setIsMenuOpen(false);
                      }}
                      className="block w-full text-left bg-blue-600 text-white px-4 py-3 rounded hover:bg-blue-700 transition text-center font-semibold"
                    >
                      Get Started
                    </button>
                  </>
                ) : (
                  // Login/Register Pages Mobile Menu
                  <>
                    <button
                      onClick={() => {
                        navigate('/login');
                        setIsMenuOpen(false);
                      }}
                      className="block w-full text-left text-blue-600 hover:bg-gray-100 px-4 py-3 rounded transition font-semibold"
                    >
                      Login
                    </button>
                    <button
                      onClick={() => {
                        navigate('/register');
                        setIsMenuOpen(false);
                      }}
                      className="block w-full text-left bg-blue-600 text-white px-4 py-3 rounded hover:bg-blue-700 transition text-center font-semibold"
                    >
                      Get Started
                    </button>
                  </>
                )
              ) : (
                // Fallback (shouldn't reach here)
                <>
                  <Link
                    to="/login"
                    className="block bg-blue-800 hover:bg-blue-900 px-4 py-3 rounded transition text-center font-semibold"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="block bg-white text-blue-600 hover:bg-gray-100 px-4 py-3 rounded transition text-center font-semibold"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Register
                  </Link>
                </>
              )
            )}
          </div>
        </>
      )}
    </nav>
  );
};

export default Navbar;