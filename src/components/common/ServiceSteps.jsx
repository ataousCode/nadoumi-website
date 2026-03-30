import React from 'react'
import StepCard from './StepCard.jsx'

/**
 * Generic component to display service steps in a grid
 * Used to replace ImportExportDetails, StudentAdmissionDetails, etc.
 * @param {Object} props
 * @param {Array} props.steps - Array of step objects with title and description
 * @param {string} props.stepLabel - Label for each step (default: 'Step')
 * @param {string} props.variant - Visual variant for cards: 'default' | 'compact' | 'detailed'
 * @param {string} props.gridCols - Grid columns class (default: 'md:grid-cols-2')
 * @param {string} props.ariaLabel - Aria label for accessibility
 * @param {string} props.className - Additional CSS classes
 */
function ServiceSteps({ 
  steps = [], 
  stepLabel = 'Step',
  variant = 'compact',
  gridCols = 'md:grid-cols-2',
  ariaLabel = 'Service steps',
  className = '' 
}) {
  const safeSteps = Array.isArray(steps) ? steps : []

  return (
    <div 
      className={`grid grid-cols-1 ${gridCols} gap-6 ${className}`} 
      aria-label={ariaLabel}
    >
      {safeSteps.map((step, index) => (
        <StepCard
          key={index}
          stepNumber={index + 1}
          title={step.title}
          description={step.description}
          stepLabel={stepLabel}
          variant={variant}
        />
      ))}
    </div>
  )
}

export default ServiceSteps

