import { Link } from "react-router-dom"

const Error404 = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-6">
      <div className="text-center max-w-md mx-auto">
        <div className="text-8xl font-semibold text-gray-400 mb-8">404</div>
        <h1 className="text-2xl font-semibold text-gray-900 mb-4">Page Not Found</h1>
        <p className="text-gray-600 mb-8 leading-relaxed">
          The page you are looking for does not exist or has been moved.
        </p>
        <Link
          to="/"
          className="inline-flex items-center px-6 py-3 bg-gray-800 hover:bg-gray-700 text-white rounded-2xl font-medium shadow-md transition-colors duration-200"
        >
          Go Home
        </Link>
      </div>
    </div>
  )
}

export default Error404
