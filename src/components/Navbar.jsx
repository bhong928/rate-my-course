import { useState } from "react";
import { Link } from "react-router-dom";

export default function Navbar({ onShowAuth, currentUser, isAdmin }) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="bg-white shadow py-3 px-4">
      <div className="  flex items-center justify-between">
        
        {/* Logo */}
        <div className="text-3xl font-extrabold text-center w-full md:w-auto">
          <Link to="/">
            <span className="text-black">RateMy</span>
            <span className="text-green-700">Course</span>
          </Link>
        </div>

        {/* Desktop buttons */}
        <div className="hidden md:flex items-center space-x-4">
          {isAdmin && (
            <Link
              to="/admin"
              className="text-red-700 hover:text-green-600 hover:underline font-medium"
            >
              Admin Dashboard
            </Link>
          )}
          {currentUser ? (
            <Link
              to="/account"
              className="text-gray-700 hover:text-green-600 hover:underline font-medium"
            >
              My Account
            </Link>
          ) : (
            <button
              onClick={onShowAuth}
              className="text-gray-700 hover:text-green-600 hover:underline font-medium"
            >
              Sign In
            </button>
          )}
        </div>

        {/* Hamburger Icon (Mobile only) */}
        <div className="md:hidden ml-4">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="text-2xl"
            aria-label="Menu"
          >
            ☰
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {menuOpen && (
        <div className="md:hidden mt-2 px-4 space-y-2">
          {isAdmin && (
            <Link
              to="/admin"
              onClick={() => setMenuOpen(false)}
              className="block text-red-700 hover:text-green-600 font-medium"
            >
              Admin Dashboard
            </Link>
          )}
          {currentUser ? (
            <Link
              to="/account"
              onClick={() => setMenuOpen(false)}
              className="block text-gray-700 hover:text-green-600 font-medium"
            >
              My Account
            </Link>
          ) : (
            <button
              onClick={() => {
                setMenuOpen(false);
                onShowAuth();
              }}
              className="block text-gray-700 hover:text-green-600 font-medium"
            >
              Sign In
            </button>
          )}
        </div>
      )}
    </nav>
  );
}