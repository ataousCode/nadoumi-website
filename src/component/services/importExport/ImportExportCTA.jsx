import React from 'react'
import ServiceCTA from '../common/ServiceCTA.jsx'

/**
 * Import/Export CTA component
 * Wrapper around ServiceCTA with sensible defaults
 */
function ImportExportCTA({ cta = {}, onClick, className = '' }) {
  return (
    <ServiceCTA 
      heading={cta.heading || 'Ready to start?'} 
      text={cta.text || 'Get in touch with our team to begin sourcing.'} 
      buttonText={cta.button || 'Contact Us'} 
      onClick={onClick} 
      className={className} 
    />
  )
}

export default ImportExportCTA
