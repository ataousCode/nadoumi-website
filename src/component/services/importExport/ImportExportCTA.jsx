import React from 'react'
import ServiceCTA from '../common/ServiceCTA.jsx'

function ImportExportCTA({ cta = {}, onClick, className = '' }) {
  const heading = cta.heading || 'Ready to start?'
  const text = cta.text || 'Get in touch with our team to begin sourcing.'
  const buttonText = cta.button || 'Contact Us'
  return (
    <ServiceCTA heading={heading} text={text} buttonText={buttonText} onClick={onClick} className={className} />
  )
}

export default ImportExportCTA