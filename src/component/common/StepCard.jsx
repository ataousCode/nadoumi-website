import React from 'react'

/**
 * Reusable card component for displaying step-by-step information
 * @param {Object} props
 * @param {number} props.stepNumber - The step number to display
 * @param {string} props.title - The step title
 * @param {string} props.description - Optional step description
 * @param {string} props.stepLabel - Label for step (e.g., "Step", "Phase")
 * @param {string} props.variant - Visual variant: 'default' | 'compact' | 'detailed'
 * @param {string} props.className - Additional CSS classes
 */
function StepCard({ 
  stepNumber, 
  title, 
  description, 
  stepLabel = 'Step',
  variant = 'default',
  className = '' 
}) {
  const variantClasses = {
    default: 'rounded-xl border border-orange-100 p-6 bg-white',
    compact: 'rounded-xl border border-orange-100 p-6 bg-white shadow-sm',
    detailed: 'rounded-xl border border-orange-100 p-6 bg-white shadow-md',
  }

  const labelClasses = {
    default: 'text-orange-600 font-bold',
    compact: 'text-sm uppercase tracking-wider text-orange-600',
    detailed: 'text-sm uppercase tracking-wider text-orange-600 font-semibold',
  }

  return (
    <div className={`${variantClasses[variant]} ${className}`}>
      <div className={labelClasses[variant]}>
        {stepLabel} {stepNumber}
      </div>
      <h3 className="mt-1 text-lg font-semibold text-gray-900">{title}</h3>
      {description && <p className="mt-2 text-gray-700">{description}</p>}
    </div>
  )
}

export default StepCard

