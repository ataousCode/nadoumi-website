export function getWhatsAppNumber() {
  const number = import.meta.env.VITE_WHATSAPP_NUMBER || '8615520576024'
  return number.replace(/\D/g, '')
}

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

export function openWhatsApp(message, phoneNumber = null) {
  const number = phoneNumber || getWhatsAppNumber()
  const url = `https://wa.me/${number}?text=${message}`
  window.open(url, '_blank', 'noopener,noreferrer')
}

export function openWhatsAppForProduct(product, additionalInfo = '') {
  const message = generateProductMessage(
    product.name,
    product.price,
    additionalInfo
  )
  openWhatsApp(message)
}

