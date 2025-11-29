/**
 * Utility functions for WhatsApp integration
 */

/**
 * Get WhatsApp phone number from environment or use default
 * @returns {string} WhatsApp phone number (with country code, no + or spaces)
 */
export function getWhatsAppNumber() {
  // You can set this in .env file: VITE_WHATSAPP_NUMBER=1234567890
  const number = import.meta.env.VITE_WHATSAPP_NUMBER || '1234567890'
  // Remove any non-digit characters
  return number.replace(/\D/g, '')
}

/**
 * Generate WhatsApp message for product inquiry
 * @param {string} productName - Product name
 * @param {number|string} price - Product price
 * @param {string} [additionalInfo] - Additional information to include
 * @returns {string} Formatted WhatsApp message
 */
export function generateProductMessage(productName, price, additionalInfo = '') {
  let message = `Hello! I'm interested in purchasing:\n\n`
  message += `*Product:* ${productName}\n`
  message += `*Price:* $${price}\n`
  
  if (additionalInfo) {
    message += `\n${additionalInfo}\n`
  }
  
  message += `\nPlease let me know if this product is available. Thank you!`
  
  return encodeURIComponent(message)
}

/**
 * Open WhatsApp with a pre-filled message
 * @param {string} message - Message to send (will be URL encoded)
 * @param {string} [phoneNumber] - Optional phone number (defaults to env or default)
 */
export function openWhatsApp(message, phoneNumber = null) {
  const number = phoneNumber || getWhatsAppNumber()
  const url = `https://wa.me/${number}?text=${message}`
  window.open(url, '_blank', 'noopener,noreferrer')
}

/**
 * Open WhatsApp for product inquiry
 * @param {Object} product - Product object with name, price, etc.
 * @param {string} [additionalInfo] - Additional information
 */
export function openWhatsAppForProduct(product, additionalInfo = '') {
  const message = generateProductMessage(
    product.name,
    product.price,
    additionalInfo
  )
  openWhatsApp(message)
}

