import React from 'react'

function formatCurrency(amount, currency = 'RMB') {
  if (amount === null || amount === undefined || amount === '') return 'N/A'
  const symbol = currency === 'USD' ? '$' : '¥'
  return `${symbol}${Number(amount).toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 2 })} ${currency}`
}

export default function FeeStructure({ feeStructure, className = '' }) {
  if (!feeStructure) return null

  const { universityFees, nadoumiFees, universityFeeCurrency, nadoumiFeeCurrency } = feeStructure

  return (
    <div className={`space-y-6 ${className}`}>
      {universityFees && (
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">University Fees</h3>
          <div className="space-y-3">
            {universityFees.originalTuitionFee !== null && universityFees.originalTuitionFee !== undefined && (
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-sm text-gray-700">Original Tuition Fee</span>
                <span className="text-sm font-medium text-red-600">
                  {formatCurrency(universityFees.originalTuitionFee, universityFeeCurrency)}/year
                </span>
              </div>
            )}
            {universityFees.tuitionFeeAfterScholarship !== null && universityFees.tuitionFeeAfterScholarship !== undefined && (
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-sm text-gray-700">Tuition Fee After Scholarship</span>
                <span className="text-sm font-medium text-red-600">
                  {formatCurrency(universityFees.tuitionFeeAfterScholarship, universityFeeCurrency)}/year
                </span>
              </div>
            )}
            {universityFees.accommodationFees && (
              <>
                <div className="mt-4 pt-3 border-t border-gray-200">
                  <h4 className="text-sm font-medium text-gray-900 mb-2">Accommodation Fees (Original)</h4>
                  {universityFees.accommodationFees.quad !== null && universityFees.accommodationFees.quad !== undefined && (
                    <div className="flex justify-between items-center py-1">
                      <span className="text-sm text-gray-600">Quad Room</span>
                      <span className="text-sm text-red-600">{formatCurrency(universityFees.accommodationFees.quad, universityFeeCurrency)}/year</span>
                    </div>
                  )}
                  {universityFees.accommodationFees.double !== null && universityFees.accommodationFees.double !== undefined && (
                    <div className="flex justify-between items-center py-1">
                      <span className="text-sm text-gray-600">Double Room</span>
                      <span className="text-sm text-red-600">{formatCurrency(universityFees.accommodationFees.double, universityFeeCurrency)}/year</span>
                    </div>
                  )}
                  {universityFees.accommodationFees.single !== null && universityFees.accommodationFees.single !== undefined && (
                    <div className="flex justify-between items-center py-1">
                      <span className="text-sm text-gray-600">Single Room</span>
                      <span className="text-sm text-red-600">{formatCurrency(universityFees.accommodationFees.single, universityFeeCurrency)}/year</span>
                    </div>
                  )}
                </div>
                {universityFees.accommodationFeesAfterScholarship && (
                  <div className="mt-3 pt-3 border-t border-gray-200">
                    <h4 className="text-sm font-medium text-gray-900 mb-2">Accommodation Fees (After Scholarship)</h4>
                    {universityFees.accommodationFeesAfterScholarship.quad !== null && universityFees.accommodationFeesAfterScholarship.quad !== undefined && (
                      <div className="flex justify-between items-center py-1">
                        <span className="text-sm text-gray-600">Quad Room</span>
                        <span className="text-sm text-red-600">{formatCurrency(universityFees.accommodationFeesAfterScholarship.quad, universityFeeCurrency)}/year</span>
                      </div>
                    )}
                    {universityFees.accommodationFeesAfterScholarship.double !== null && universityFees.accommodationFeesAfterScholarship.double !== undefined && (
                      <div className="flex justify-between items-center py-1">
                        <span className="text-sm text-gray-600">Double Room</span>
                        <span className="text-sm text-red-600">{formatCurrency(universityFees.accommodationFeesAfterScholarship.double, universityFeeCurrency)}/year</span>
                      </div>
                    )}
                    {universityFees.accommodationFeesAfterScholarship.single !== null && universityFees.accommodationFeesAfterScholarship.single !== undefined && (
                      <div className="flex justify-between items-center py-1">
                        <span className="text-sm text-gray-600">Single Room</span>
                        <span className="text-sm text-red-600">{formatCurrency(universityFees.accommodationFeesAfterScholarship.single, universityFeeCurrency)}/year</span>
                      </div>
                    )}
                  </div>
                )}
              </>
            )}
            {universityFees.otherFees && universityFees.otherFees.length > 0 && (
              <div className="mt-4 pt-3 border-t border-gray-200">
                <h4 className="text-sm font-medium text-gray-900 mb-2">Other Fees</h4>
                {universityFees.otherFees.map((fee, index) => (
                  <div key={index} className="flex justify-between items-center py-1">
                    <span className="text-sm text-gray-600">{fee.name}</span>
                    <span className="text-sm text-red-600">{formatCurrency(fee.amount, fee.currency || universityFeeCurrency)}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {nadoumiFees && (
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Nadoumi Agent Fees</h3>
          <div className="space-y-3">
            {nadoumiFees.applicationFee !== null && nadoumiFees.applicationFee !== undefined && (
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-sm text-gray-700">Application Fee (non-refundable)</span>
                <span className="text-sm font-medium text-red-600">
                  {formatCurrency(nadoumiFees.applicationFee, nadoumiFeeCurrency)}
                </span>
              </div>
            )}
            {nadoumiFees.serviceFee && (
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-sm text-gray-700">Service Fee</span>
                <span className="text-sm font-medium text-red-600">
                  {formatCurrency(nadoumiFees.serviceFee, nadoumiFeeCurrency)}
                </span>
              </div>
            )}

            {nadoumiFees.starAgentServiceFee !== null && nadoumiFees.starAgentServiceFee !== undefined && (
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-3 mt-3">
                <div className="flex items-center gap-2">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <span className="text-sm text-gray-700">Star Agent Service Fee:</span>
                  <span className="text-sm font-medium text-orange-600">
                    View after login
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

