import React from 'react'
import StepCard from '../../common/StepCard.jsx'

/**
 * Process timeline component with section header
 * Displays steps in a multi-column grid with title and subtitle
 */
function ProcessTimeline({ 
  title = 'Process', 
  subtitle = '', 
  steps = [], 
  stepLabel = 'Step',
  gridCols = 'md:grid-cols-4' 
}) {
  const list = Array.isArray(steps) ? steps : []

  return (
    <section className="mt-12">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">{title}</h2>
        {subtitle && <p className="mt-2 text-gray-700">{subtitle}</p>}
        <div className={`mt-6 grid grid-cols-1 ${gridCols} gap-6`}>
          {list.map((step, index) => (
            <StepCard
              key={index}
              stepNumber={index + 1}
              title={step.title}
              description={step.description}
              stepLabel={stepLabel}
              variant="default"
            />
          ))}
        </div>
      </div>
    </section>
  )
}

export default ProcessTimeline
