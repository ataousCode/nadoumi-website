import React from 'react'
import Button from '../../../../components/common/Button.jsx'

function ServiceCTA({ heading, text, buttonText = 'Contact Us', onClick, className = '' }) {
  return (
    <section className={`bg-orange-50 rounded-2xl p-6 sm:p-8 ${className}`} aria-label="Service call to action">
      {heading && <h3 className="text-xl sm:text-2xl font-bold text-gray-900">{heading}</h3>}
      {text && <p className="mt-2 text-gray-700">{text}</p>}
      <div className="mt-4">
        <Button variant="primary" size="md" ariaLabel={buttonText} onClick={onClick}>
          {buttonText}
        </Button>
      </div>
    </section>
  )
}

export default ServiceCTA