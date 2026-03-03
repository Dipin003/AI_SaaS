import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white px-6">
      
      {/* Big 404 */}
      <h1 className="text-8xl md:text-9xl font-extrabold bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent animate-pulse">
        404
      </h1>

      {/* Message */}
      <h2 className="mt-6 text-2xl md:text-3xl font-semibold text-center">
        Oops! Page Not Found
      </h2>

      <p className="mt-4 text-gray-400 text-center max-w-md">
        The page you're looking for doesn’t exist or has been moved.
        Don’t worry, you can go back to the homepage.
      </p>

      {/* Button */}
      <Link
        href="/"
        className="mt-8 inline-flex items-center gap-2 bg-white text-black px-6 py-3 rounded-xl font-medium hover:bg-gray-200 transition-all duration-300 shadow-lg hover:scale-105"
      >
        <ArrowLeft size={18} />
        Back to Home
      </Link>

      {/* Decorative Glow */}
      <div className="absolute top-0 left-0 w-72 h-72 bg-purple-600/20 blur-3xl rounded-full"></div>
      <div className="absolute bottom-0 right-0 w-72 h-72 bg-pink-600/20 blur-3xl rounded-full"></div>
    </div>
  )
}