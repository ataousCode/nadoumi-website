import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Container from '../component/common/Container.jsx'
import Button from '../component/common/Button.jsx'

export default function NotFound() {
  const navigate = useNavigate()

  return (
    <Container className="min-h-screen flex items-center justify-center py-12">
      <div className="max-w-2xl mx-auto text-center px-4">
        {/* 404 Number */}
        <div className="mb-8">
          <h1 className="text-9xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-orange-600">
            404
          </h1>
        </div>

        {/* Error Message */}
        <div className="mb-8">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Page Not Found
          </h2>
          <p className="text-lg text-gray-600 mb-2">
            Oops! The page you're looking for doesn't exist.
          </p>
          <p className="text-base text-gray-500">
            It might have been moved, deleted, or the URL might be incorrect.
          </p>
        </div>

        {/* Illustration */}
        <div className="mb-8 flex justify-center">
          <svg
            className="w-64 h-64 text-gray-300"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Button
            variant="primary"
            onClick={() => navigate(-1)}
            ariaLabel="Go back"
          >
            <svg
              className="w-5 h-5 mr-2 inline-block"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            Go Back
          </Button>
          <Link to="/">
            <Button variant="secondary" ariaLabel="Go to home">
              <svg
                className="w-5 h-5 mr-2 inline-block"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                />
              </svg>
              Go to Home
            </Button>
          </Link>
        </div>

        {/* Quick Links */}
        <div className="mt-12 pt-8 border-t border-gray-200">
          <p className="text-sm text-gray-500 mb-4">You might be looking for:</p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              to="/scholarships"
              className="text-orange-600 hover:text-orange-700 font-medium text-sm transition-colors"
            >
              Scholarships
            </Link>
            <Link
              to="/about"
              className="text-orange-600 hover:text-orange-700 font-medium text-sm transition-colors"
            >
              About Us
            </Link>
            <Link
              to="/contact"
              className="text-orange-600 hover:text-orange-700 font-medium text-sm transition-colors"
            >
              Contact
            </Link>
          </div>
        </div>
      </div>
    </Container>
  )
}

