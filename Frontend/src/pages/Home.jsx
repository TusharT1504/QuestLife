"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { useAuth } from "../context/AuthContext"

const Home = () => {
  const { isAuthenticated } = useAuth()
  const [isLoaded, setIsLoaded] = useState(false)
  const [currentFeature, setCurrentFeature] = useState(0)

  const features = ["Track your daily habits", "Earn XP and level up", "Build lasting routines", "Achieve your goals"]

  useEffect(() => {
    setIsLoaded(true)

    // Cycle through features
    const interval = setInterval(() => {
      setCurrentFeature((prev) => (prev + 1) % features.length)
    }, 3000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-50 px-6 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="floating-orb absolute top-20 left-10 w-32 h-32 bg-gray-200 rounded-full opacity-20"></div>
        <div className="floating-orb-delayed absolute bottom-20 right-10 w-24 h-24 bg-gray-300 rounded-full opacity-15"></div>
        <div className="floating-orb-slow absolute top-1/2 left-1/4 w-16 h-16 bg-gray-400 rounded-full opacity-10"></div>
      </div>

      <div className="text-center max-w-5xl mx-auto relative z-10">
        {/* Main Title with Staggered Animation */}
        <div className="mb-12">
          <h1
            className={`text-6xl md:text-8xl font-semibold text-gray-900 mb-6 tracking-tight transition-all duration-1000 ${
              isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
          >
            <span className="inline-block animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
              Q
            </span>
            <span className="inline-block animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
              u
            </span>
            <span className="inline-block animate-fade-in-up" style={{ animationDelay: "0.3s" }}>
              e
            </span>
            <span className="inline-block animate-fade-in-up" style={{ animationDelay: "0.4s" }}>
              s
            </span>
            <span className="inline-block animate-fade-in-up" style={{ animationDelay: "0.5s" }}>
              t
            </span>
            <span className="inline-block animate-fade-in-up mx-4" style={{ animationDelay: "0.6s" }}></span>
            <span className="inline-block animate-fade-in-up" style={{ animationDelay: "0.7s" }}>
              L
            </span>
            <span className="inline-block animate-fade-in-up" style={{ animationDelay: "0.8s" }}>
              i
            </span>
            <span className="inline-block animate-fade-in-up" style={{ animationDelay: "0.9s" }}>
              f
            </span>
            <span className="inline-block animate-fade-in-up" style={{ animationDelay: "1.0s" }}>
              e
            </span>
          </h1>

          <div
            className={`h-1 w-24 bg-gray-800 mx-auto rounded-full transition-all duration-1000 delay-1000 ${
              isLoaded ? "opacity-100 scale-x-100" : "opacity-0 scale-x-0"
            }`}
          ></div>
        </div>

        {/* Subtitle with Fade Animation */}
        <p
          className={`text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed mb-8 transition-all duration-1000 delay-500 ${
            isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
        >
          Transform your daily routines into an engaging journey of personal growth and achievement.
        </p>

        {/* Rotating Feature Text */}
        <div
          className={`text-lg text-gray-500 mb-12 h-8 transition-all duration-1000 delay-700 ${
            isLoaded ? "opacity-100" : "opacity-0"
          }`}
        >
          <span className="animate-fade-in-out">{features[currentFeature]}</span>
        </div>

        {/* Action Buttons */}
        <div
          className={`flex flex-col sm:flex-row gap-6 justify-center items-center transition-all duration-1000 delay-1000 ${
            isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          {isAuthenticated ? (
            <Link
              to="/dashboard"
              className="group relative px-12 py-4 bg-gray-900 text-white rounded-2xl font-medium text-lg transition-all duration-300 hover:bg-gray-800 hover:scale-105 hover:shadow-2xl transform-gpu"
            >
              <span className="relative z-10">Go to Dashboard</span>
              <div className="absolute inset-0 bg-gradient-to-r from-gray-800 to-gray-900 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="absolute inset-0 rounded-2xl bg-gray-900 animate-pulse-subtle"></div>
            </Link>
          ) : (
            <>
              <Link
                to="/signup"
                className="group relative px-12 py-4 bg-gray-900 text-white rounded-2xl font-medium text-lg transition-all duration-300 hover:bg-gray-800 hover:scale-105 hover:shadow-2xl transform-gpu overflow-hidden"
              >
                <span className="relative z-10 flex items-center">
                  Get Started
                  <svg
                    className="ml-2 w-5 h-5 transition-transform duration-300 group-hover:translate-x-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-gray-800 to-gray-900 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="absolute -inset-1 bg-gradient-to-r from-gray-600 to-gray-800 rounded-2xl blur opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
              </Link>

              <Link
                to="/login"
                className="group relative px-12 py-4 bg-white text-gray-900 border-2 border-gray-300 rounded-2xl font-medium text-lg transition-all duration-300 hover:border-gray-900 hover:scale-105 hover:shadow-lg transform-gpu"
              >
                <span className="relative z-10 flex items-center">
                  Sign In
                  <svg
                    className="ml-2 w-5 h-5 transition-transform duration-300 group-hover:translate-x-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
                    />
                  </svg>
                </span>
                <div className="absolute inset-0 bg-gray-50 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </Link>
            </>
          )}
        </div>

        

        
      </div>

      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fadeInOut {
          0%, 100% { opacity: 0; transform: translateY(10px); }
          50% { opacity: 1; transform: translateY(0); }
        }

        @keyframes floating {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(180deg); }
        }

        @keyframes floatingDelayed {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-15px) rotate(-180deg); }
        }

        @keyframes floatingSlow {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-10px) rotate(90deg); }
        }

        @keyframes bounceGentle {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }

        @keyframes pulseSubtle {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.8; }
        }

        .animate-fade-in-up {
          animation: fadeInUp 0.8s ease-out forwards;
          opacity: 0;
        }

        .animate-fade-in-out {
          animation: fadeInOut 3s ease-in-out infinite;
        }

        .floating-orb {
          animation: floating 6s ease-in-out infinite;
        }

        .floating-orb-delayed {
          animation: floatingDelayed 8s ease-in-out infinite;
          animation-delay: 2s;
        }

        .floating-orb-slow {
          animation: floatingSlow 10s ease-in-out infinite;
          animation-delay: 4s;
        }

        .animate-bounce-slow {
          animation: bounceGentle 2s ease-in-out infinite;
        }

        .animate-pulse-subtle {
          animation: pulseSubtle 2s ease-in-out infinite;
        }

        .transform-gpu {
          transform: translateZ(0);
          backface-visibility: hidden;
          perspective: 1000px;
        }
      `}</style>
    </div>
  )
}

export default Home
