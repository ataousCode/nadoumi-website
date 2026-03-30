import React, { useState } from 'react'
import { useI18n } from '../../i18n/LocaleProvider.jsx'
import { openWhatsApp } from '../../utils/whatsapp.js'
import wechatQR from '../../assets/images/wechat.jpg'
import { cn } from '../../utils/cn'

import { Icons } from '../../assets/icons/Icons.jsx'

/**
 * Unified Floating Contact Button
 * @param {Object} props
 * @param {string} props.type - 'wechat' or 'whatsapp'
 * @param {string} props.className - Additional classes
 */
export default function FloatingContactButton({ type = 'whatsapp', className = '' }) {
  const { t } = useI18n()
  const [showQR, setShowQR] = useState(false)

  const isWeChat = type === 'wechat'
  
  const handleClick = () => {
    if (!isWeChat) {
      const message = encodeURIComponent(
        t('common.whatsapp.message', 'Hello! I would like to get in touch with Nadoumi Consulting.')
      )
      openWhatsApp(message)
    }
  }

  const buttonLabel = isWeChat 
    ? t('common.wechat.buttonLabel', 'Contact us on WeChat')
    : t('common.whatsapp.buttonLabel', 'Contact us on WhatsApp')

  const bgColor = isWeChat ? 'bg-[#07C160] hover:bg-[#06AD56]' : 'bg-green-600 hover:bg-green-700'
  const position = isWeChat ? 'right-24 sm:right-28' : 'right-6'

  const icon = isWeChat ? (
    <Icons.WeChat className="w-8 h-8 sm:w-10 sm:h-10" />
  ) : (
    <Icons.WhatsApp className="w-8 h-8 sm:w-10 sm:h-10" />
  )

  return (
    <div 
      className={cn("fixed bottom-6 z-50", position, className)}
      onMouseEnter={() => isWeChat && setShowQR(true)}
      onMouseLeave={() => isWeChat && setShowQR(false)}
    >
      <button
        onClick={handleClick}
        className={cn(
          "w-16 h-16 sm:w-20 sm:h-20 text-white rounded-full shadow-lg hover:shadow-xl flex items-center justify-center transition-all duration-300 transform hover:scale-110 group relative",
          bgColor
        )}
        aria-label={buttonLabel}
        title={buttonLabel}
      >
        {icon}
        <span className={cn("absolute inset-0 rounded-full animate-ping opacity-20", isWeChat ? "bg-[#07C160]" : "bg-green-600")} aria-hidden="true" />
      </button>

      {/* QR Code Popup (WeChat only) */}
      {isWeChat && showQR && (
        <div className="absolute bottom-full right-0 mb-4 p-4 bg-white rounded-lg shadow-2xl border border-gray-200 transition-opacity duration-300 opacity-100">
          <div className="text-center">
            <h3 className="text-sm font-semibold text-gray-900 mb-2">
              {t('common.wechat.scanQR', 'Scan QR code to add me')}
            </h3>
            <div className="w-48 h-48 sm:w-56 sm:h-56 bg-white p-2 rounded border-2 border-gray-100 relative">
              <img
                src={wechatQR}
                alt="WeChat QR Code"
                className="w-full h-full object-contain"
              />
            </div>
            <p className="text-xs text-gray-500 mt-2">
              {t('common.wechat.addWeChat', 'Add us on WeChat')}
            </p>
          </div>
          <div className="absolute -bottom-2 right-6 w-4 h-4 bg-white border-r border-b border-gray-200 transform rotate-45" />
        </div>
      )}
    </div>
  )
}
