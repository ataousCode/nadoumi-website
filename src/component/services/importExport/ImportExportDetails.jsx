import React from 'react'
import ServiceSteps from '../../common/ServiceSteps.jsx'

/**
 * Import/Export details component
 * Wrapper around ServiceSteps for backward compatibility
 */
function ImportExportDetails({ steps = [], className = '', stepLabel = 'Step' }) {
  return (
    <ServiceSteps
      steps={steps}
      stepLabel={stepLabel}
      variant="compact"
      gridCols="md:grid-cols-2"
      ariaLabel="Import & Export steps"
      className={className}
    />
  )
}

export default ImportExportDetails
