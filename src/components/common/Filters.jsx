import React from 'react'
import Button from './Button.jsx'

export default function Filters({
  values,
  onChange,
  onReset,
  searchPlaceholder = 'Search...',
  filters = [], // Array of filter configs: { key, label, type, options, placeholder }
}) {
  const handleChange = (field) => (e) => {
    const value = e.target.value
    onChange?.({ ...values, [field]: value })
  }

  return (
    <section className="w-full rounded-xl border border-gray-200 bg-white p-4 shadow-sm space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-gray-900">Filters</h2>
        <button
          type="button"
          className="text-xs text-gray-500 hover:text-gray-700 underline"
          onClick={() => onReset?.()}
        >
          Clear
        </button>
      </div>

      <div className="space-y-3">
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">
            Search
          </label>
          <input
            type="text"
            value={values.search || ''}
            onChange={handleChange('search')}
            placeholder={searchPlaceholder}
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none"
          />
        </div>

        {filters.length > 0 && (
          <div className={filters.length === 2 ? 'grid grid-cols-1 sm:grid-cols-2 gap-3' : 'space-y-3'}>
            {filters.map((filter) => (
              <div key={filter.key}>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  {filter.label}
                </label>
                {filter.type === 'select' ? (
                  <select
                    value={values[filter.key] || ''}
                    onChange={handleChange(filter.key)}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm bg-white focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none"
                  >
                    <option value="">{filter.placeholder || `All ${filter.label.toLowerCase()}`}</option>
                    {filter.options?.map((option) => {
                      const value = typeof option === 'string' ? option : option.value
                      const label = typeof option === 'string' ? option : option.label
                      return (
                        <option key={value} value={value}>
                          {label}
                        </option>
                      )
                    })}
                  </select>
                ) : (
                  <input
                    type={filter.type || 'text'}
                    value={values[filter.key] || ''}
                    onChange={handleChange(filter.key)}
                    placeholder={filter.placeholder}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none"
                  />
                )}
              </div>
            ))}
          </div>
        )}

        <div className="pt-1">
          <Button
            variant="secondary"
            size="sm"
            type="button"
            className="w-full sm:w-auto"
            onClick={() => onChange?.({ ...values })}
          >
            Apply filters
          </Button>
        </div>
      </div>
    </section>
  )
}

