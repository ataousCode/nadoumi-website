import React from 'react'
import ServiceCTA from '../common/ServiceCTA.jsx'
import useTranslation from '../../../hooks/service/useTranslation.js'

/**
 * Translation CTA component
 * Wrapper around ServiceCTA that loads data from useTranslation hook
 */
export default function TranslationCTA() {
  const { details } = useTranslation()
  return (
    <ServiceCTA 
      heading={details?.cta?.heading} 
      text={details?.cta?.text} 
      buttonText={details?.cta?.button} 
    />
  )
}
