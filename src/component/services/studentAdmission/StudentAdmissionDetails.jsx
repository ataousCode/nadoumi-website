import React from 'react'
import ServiceSteps from '../../common/ServiceSteps.jsx'

/**
 * Student admission details component
 * Wrapper around ServiceSteps for backward compatibility
 */
function StudentAdmissionDetails({ steps = [], className = '', stepLabel = 'Step' }) {
  return (
    <ServiceSteps
      steps={steps}
      stepLabel={stepLabel}
      variant="compact"
      gridCols="md:grid-cols-2"
      ariaLabel="Student admission steps"
      className={className}
    />
  )
}

export default StudentAdmissionDetails
