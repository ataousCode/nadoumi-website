import React, { useState } from 'react'
import { useI18n } from '../../i18n/LocaleProvider.jsx'
import wechatQR from '../../assets/images/wechat.jpg'

// Floating WeChat Button Component with QR Code on Hover
function WeChatFloat({ className = '' }) {
  const { t } = useI18n()
  const [showQR, setShowQR] = useState(false)

  return (
    <div
      className={`
        fixed bottom-6 right-24 sm:right-28 z-50
        ${className}
      `}
      onMouseEnter={() => setShowQR(true)}
      onMouseLeave={() => setShowQR(false)}
    >
      {/* WeChat Button */}
      <button
        className={`
          w-16 h-16 sm:w-20 sm:h-20
          bg-[#07C160] hover:bg-[#06AD56]
          text-white
          rounded-full
          shadow-lg hover:shadow-xl
          flex items-center justify-center
          transition-all duration-300
          transform hover:scale-110
          group
          relative
        `}
        aria-label={t('common.wechat.buttonLabel', 'Contact us on WeChat')}
        title={t('common.wechat.buttonLabel', 'Contact us on WeChat')}
      >
        {/* WeChat Icon */}
        <svg
          className="w-8 h-8 sm:w-10 sm:h-10"
          fill="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M8.691 2.188C3.891 2.188 0 5.476 0 9.53c0 2.212 1.17 4.203 3.002 5.55a.59.59 0 0 1 .213.665l-.39 1.48c-.019.07-.048.141-.048.213 0 .163.13.295.29.295a.326.326 0 0 0 .167-.054l1.903-1.114a.864.864 0 0 1 .717-.098 10.16 10.16 0 0 0 2.837.403c.276 0 .543-.027.811-.05-.857-2.578.157-4.972 1.932-6.446 1.703-1.415 3.882-1.98 5.853-1.838-.576-3.583-4.196-6.348-8.597-6.348zM5.785 5.991c.642 0 1.162.529 1.162 1.18a1.17 1.17 0 0 1-1.162 1.178A1.17 1.17 0 0 1 4.623 7.17c0-.651.52-1.18 1.162-1.18zm5.813 0c.642 0 1.162.529 1.162 1.18a1.17 1.17 0 0 1-1.162 1.178 1.17 1.17 0 0 1-1.162-1.178c0-.651.52-1.18 1.162-1.18zm5.34 3.548c-2.476 0-4.512 1.619-5.179 3.851a7.746 7.746 0 0 1-1.11-.08c.558-3.409 3.825-5.996 7.634-6.05 2.787-.04 5.176 1.158 6.666 3.036.338.429.64.884.897 1.36-.714-.12-1.444-.12-2.175-.12l-.133.003zm-2.536 2.508c.518 0 .938.42.938.938a.933.933 0 0 1-.938.937.933.933 0 0 1-.938-.937c0-.518.42-.938.938-.938zm4.893 0c.518 0 .938.42.938.938a.933.933 0 0 1-.938.937.933.933 0 0 1-.938-.937c0-.518.42-.938.938-.938z"/>
        </svg>

        {/* Pulse animation ring */}
        <span className="absolute inset-0 rounded-full bg-[#07C160] animate-ping opacity-20" aria-hidden="true" />
      </button>

      {/* QR Code Popup */}
      {showQR && (
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
                onError={(e) => {
                  console.error('Failed to load WeChat QR code')
                  e.target.style.display = 'none'
                  const placeholder = e.target.nextElementSibling
                  if (placeholder) {
                    placeholder.style.display = 'flex'
                  }
                }}
              />
              <div className="w-full h-full flex flex-col items-center justify-center bg-gray-50 text-gray-400" style={{ display: 'none' }}>
                <svg className="w-16 h-16 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
                </svg>
                <p className="text-xs text-center px-2">QR Code Image<br />Not Found</p>
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              {t('common.wechat.addWeChat', 'Add us on WeChat')}
            </p>
          </div>
          {/* Arrow pointing down */}
          <div className="absolute -bottom-2 right-6 w-4 h-4 bg-white border-r border-b border-gray-200 transform rotate-45" />
        </div>
      )}
    </div>
  )
}

export default WeChatFloat

