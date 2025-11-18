import React from 'react'

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, info) {
    try {
      // eslint-disable-next-line no-console
      console.error('ErrorBoundary caught error:', error, info)
    } catch (_) { /* noop */ }
  }

  render() {
    const { hasError, error } = this.state
    const { fallback = null, children } = this.props
    if (hasError) {
      if (fallback) return fallback
      const message = error?.message || 'An unexpected error occurred while rendering this section.'
      return (
        <div className="rounded-xl border border-red-200 bg-red-50 text-red-700 p-4" role="alert">
          <div className="font-semibold">Render error</div>
          <div className="mt-1 text-sm">{message}</div>
        </div>
      )
    }
    return children
  }
}