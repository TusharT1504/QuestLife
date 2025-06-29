"use client"

import { Link, useLocation, useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCoins,faStar } from '@fortawesome/free-solid-svg-icons'
import avatarImage from '../assets/avatar.avif'

const Navbar = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const { isAuthenticated, logout, user } = useAuth()

  const navLinks = [{ path: "/", label: "Home" }]

  const authenticatedLinks = [
    { path: "/dashboard", label: "Dashboard" },
    { path: "/habits", label: "Habits" },
    { path: "/marketplace", label: "Marketplace" },
    { path: "/history", label: "History" },
    { path: "/profile", label: "Profile" },
  ]

  const isActive = (path) => location.pathname === path

  const handleLogout = () => {
    logout()
    navigate("/")
  }

  const getUserInitial = () => {
    if (!user || !user.username) return "U"
    return user.username.charAt(0).toUpperCase()
  }

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo/Brand */}
          <div className="flex-shrink-0">
            <Link to="/" className="text-2xl font-bold text-black">
              Quest Life
            </Link>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                    isActive(link.path)
                      ? "text-black bg-gray-200"
                      : "text-gray-600 hover:text-black hover:bg-gray-200"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              {isAuthenticated &&
                authenticatedLinks.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                      isActive(link.path)
                        ? "text-black bg-gray-200"
                        : "text-gray-600 hover:text-black hover:bg-gray-200"
                    }`}
                  >
                    {link.label}
                  </Link>
                ))}
            </div>
          </div>

          {/* Authentication Section */}
          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <div className="flex items-center space-x-3">
                {/* User Stats */}
                <div className="hidden sm:flex items-center space-x-3 text-sm">
                  <div className="flex items-center space-x-1">
                    <FontAwesomeIcon icon={faCoins} className="text-grey-800" />
                    <span className="font-medium">{user?.coins || 0}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <span> <FontAwesomeIcon icon={faStar}/></span>
                    <span className="font-medium">Lv.{user?.level || 1}</span>
                  </div>
                </div>

                {/* User Avatar */}
                <Link
                  to="/profile"
                  className="w-8 h-8 bg-gray-800 rounded-full focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <img 
                    src={avatarImage} 
                    alt="User Avatar" 
                    className="w-8 h-8 rounded-full object-cover"
                  />
                </Link>

                <button
                  onClick={handleLogout}
                  className="text-gray-600 hover:text-black text-sm font-medium transition-colors duration-200"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link
                  to="/login"
                  className="text-gray-600 hover:text-black text-sm font-medium transition-colors duration-200 px-3 py-2 rounded-md hover:bg-gray-100"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="text-gray-600 hover:text-black text-sm font-medium transition-colors duration-200 px-3 py-2 rounded-md hover:bg-gray-100"
                >
                  Signup
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button className="text-gray-600 hover:text-black p-2">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200 ${
                  isActive(link.path)
                    ? "text-black bg-gray-200"
                    : "text-gray-600 hover:text-black hover:bg-gray-200"
                }`}
              >
                {link.label}
              </Link>
            ))}
            {isAuthenticated &&
              authenticatedLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200 ${
                    isActive(link.path)
                      ? "text-black bg-gray-200"
                      : "text-gray-600 hover:text-black hover:bg-gray-200"
                  }`}
                >
                  {link.label}
                </Link>
              ))}

            {/* Mobile User Stats */}
            {isAuthenticated && (
              <div className="px-3 py-2 border-t border-gray-200 mt-4">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center space-x-1">
                    <FontAwesomeIcon icon={faCoins} />
                    <span className="font-medium">{user?.coins || 0} Coins</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <span> <FontAwesomeIcon icon={faStar}/></span>
                    <span className="font-medium">Level {user?.level || 1}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
