import ServiceCTA from '../common/ServiceCTA'
import useTranslation from '../../../hooks/service/useTranslation'

export default function TranslationCTA() {
  const { details } = useTranslation()
  return (
    <ServiceCTA heading={details.cta.heading} text={details.cta.text} buttonText={details.cta.button} />
  )
}