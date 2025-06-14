"use client"

import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"

const Login = () => {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }))
    if (error) setError("")
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!formData.email || !formData.password) {
      setError("Please fill in all fields")
      return
    }

    setLoading(true)
    setError("")

    try {
      await login({
        email: formData.email,
        password: formData.password,
      })

      navigate("/dashboard")
    } catch (err) {
      setError(err.message || "Login failed. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center px-6">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-semibold text-gray-900 mb-4">Welcome Back</h1>
          <p className="text-lg text-gray-600">Sign in to your Quest Life account</p>
        </div>

        {/* Login Form */}
        <div className="bg-white rounded-2xl shadow-md p-8">
          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-2xl">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
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
                placeholder="Enter your password"
              />
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="rememberMe"
                  name="rememberMe"
                  checked={formData.rememberMe}
                  onChange={handleChange}
                  disabled={loading}
                  className="h-4 w-4 text-gray-800 border-gray-300 rounded focus:ring-gray-800 focus:ring-2 disabled:opacity-50"
                />
                <label htmlFor="rememberMe" className="ml-3 text-sm text-gray-600">
                  Remember me
                </label>
              </div>
              <Link
                to="/forgot-password"
                className="text-sm text-gray-600 hover:text-gray-900 transition-colors duration-200"
              >
                Forgot password?
              </Link>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gray-800 hover:bg-gray-700 text-white font-medium py-4 px-4 rounded-2xl transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-800 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {loading ? (
                "Signing In..."
              ) : (
                "Sign In"
              )}
            </button>
          </form>
        </div>

        {/* Signup Link */}
        <div className="text-center mt-8">
          <p className="text-gray-600">
            Don't have an account?{" "}
            <Link to="/signup" className="text-gray-900 hover:text-gray-700 font-medium transition-colors duration-200">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Login
