import React from 'react'

export default function Filters({ filters, onChange, onClear }) {
  const set = (patch) => onChange && onChange(patch)
  return (
    <div className="flex flex-wrap gap-3 items-end">
      <div>
        <label className="block text-sm font-medium text-gray-700">Status</label>
        <select className="mt-1 border rounded-md px-3 py-2" value={filters.status} onChange={(e) => set({ status: e.target.value })}>
          <option value="all">All</option>
          <option value="received">Received</option>
          <option value="reviewing">Reviewing</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Search</label>
        <input className="mt-1 border rounded-md px-3 py-2" type="text" value={filters.q} onChange={(e) => set({ q: e.target.value })} placeholder="Name, email, program" />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">From</label>
        <input className="mt-1 border rounded-md px-3 py-2" type="date" value={filters.from} onChange={(e) => set({ from: e.target.value })} />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">To</label>
        <input className="mt-1 border rounded-md px-3 py-2" type="date" value={filters.to} onChange={(e) => set({ to: e.target.value })} />
      </div>
      <button type="button" className="px-4 py-2 bg-gray-200 rounded-md" onClick={onClear}>Clear</button>
    </div>
  )
}