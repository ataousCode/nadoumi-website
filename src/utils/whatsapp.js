/**
 * Opens a WhatsApp chat link in a new tab.
 * @param {string} message - URL-encoded message to pre-fill
 */
export function openWhatsApp(message = '') {
  const WHATSAPP_NUMBER = import.meta.env.VITE_WHATSAPP_NUMBER || ''
  const url = WHATSAPP_NUMBER
    ? `https://wa.me/${WHATSAPP_NUMBER}?text=${message}`
    : `https://wa.me/?text=${message}`
  window.open(url, '_blank', 'noopener,noreferrer')
}
