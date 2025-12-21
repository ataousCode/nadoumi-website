import React from 'react'
import Filters from '../common/Filters.jsx'

export default function ScholarshipFilters({
  values,
  onChange,
  onReset,
  countries = [],
  categories = [],
}) {
  const filterConfig = [
    {
      key: 'country',
      label: 'Country',
      type: 'select',
      options: countries,
      placeholder: 'All countries',
    },
    {
      key: 'category',
      label: 'Category',
      type: 'select',
      options: categories,
      placeholder: 'All categories',
    },
  ]

  return (
    <Filters
      values={values}
      onChange={onChange}
      onReset={onReset}
      searchPlaceholder="Search by title or university"
      filters={filterConfig}
    />
  )
}


