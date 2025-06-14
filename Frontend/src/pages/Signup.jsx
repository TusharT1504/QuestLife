"use client"

import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"

const Signup = () => {
  const navigate = useNavigate()
  const { signup } = useAuth()
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
    if (error) setError("")
  }

  const validateForm = () => {
    if (!formData.username || !formData.email || !formData.password || !formData.confirmPassword) {
      setError("All fields are required")
      return false
    }

    if (formData.username.length < 3) {
      setError("Username must be at least 3 characters long")
      return false
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters long")
      return false
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match")
      return false
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(formData.email)) {
      setError("Please enter a valid email address")
      return false
    }

    return true
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setLoading(true)
    setError("")

    try {
      await signup({
        username: formData.username,
        email: formData.email,
        password: formData.password,
      })

      navigate("/dashboard")
    } catch (err) {
      setError(err.message || "Registration failed. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center px-6">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-semibold text-gray-900 mb-4">Create Account</h1>
          <p className="text-lg text-gray-600">Join Quest Life and start your journey</p>
        </div>

        {/* Signup Form */}
        <div className="bg-white rounded-2xl shadow-md p-8">
          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-2xl">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Username Field */}
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-900 mb-3">
                Username
              </label>
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                required
                disabled={loading}
                className="w-full px-4 py-4 border border-gray-300 rounded-2xl bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-800 focus:border-transparent transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                placeholder="Choose a username"
              />
            </div>

            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-900 mb-3">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                disabled={loading}
                className="w-full px-4 py-4 border border-gray-300 rounded-2xl bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-800 focus:border-transparent transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                placeholder="Enter your email"
              />
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-900 mb-3">
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                disabled={loading}
                className="w-full px-4 py-4 border border-gray-300 rounded-2xl bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-800 focus:border-transparent transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                placeholder="Create a password"
              />
              <p className="text-xs text-gray-500 mt-2">Must be at least 6 characters long</p>
            </div>

            {/* Confirm Password Field */}
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-900 mb-3">
                Confirm Password
              </label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                disabled={loading}
                className="w-full px-4 py-4 border border-gray-300 rounded-2xl bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-800 focus:border-transparent transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                placeholder="Confirm your password"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gray-800 hover:bg-gray-700 text-white font-medium py-4 px-4 rounded-2xl transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-800 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {loading ? (
                "Signing Up..."
              ) : (
                "Sign Up"
              )}
            </button>
          </form>
        </div>

        {/* Login Link */}
        <div className="text-center mt-8">
          <p className="text-gray-600">
            Already have an account?{" "}
            <Link to="/login" className="text-gray-900 hover:text-gray-700 font-medium transition-colors duration-200">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Signup
