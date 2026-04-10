import React from 'react';
import { EllipsisVerticalIcon } from '@heroicons/react/24/outline';
import { Link } from 'react-router-dom';

const StatusBadge = ({ status }) => {
  const styles = {
    pending: 'bg-orange-50 text-orange-600 border-orange-100',
    received: 'bg-blue-50 text-blue-600 border-blue-100',
    under_review: 'bg-amber-50 text-amber-600 border-amber-100',
    approved: 'bg-emerald-50 text-emerald-600 border-emerald-100',
    rejected: 'bg-rose-50 text-rose-600 border-rose-100',
    withdrawn: 'bg-gray-50 text-gray-500 border-gray-100',
  };

  const label = status?.replace('_', ' ') || 'Pending';

  return (
    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border ${styles[status] || styles.pending}`}>
      {label}
    </span>
  );
};

const RecentSubmissionsTable = ({ submissions }) => {
  return (
    <div className="bg-white rounded-[32px] border border-gray-100/50 shadow-sm overflow-hidden flex flex-col h-full">
      <div className="p-8 flex items-center justify-between border-b border-gray-50">
        <div>
          <h3 className="text-xl font-black text-gray-900 tracking-tight">Recent Application Submissions</h3>
          <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mt-1">Live Updates</p>
        </div>
        <Link to="/admin/applications" className="text-blue-600 font-black text-[11px] uppercase tracking-widest hover:text-blue-700 transition-colors">
          View All
        </Link>
      </div>

      <div className="flex-1 overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50/50">
              <th className="px-8 py-4 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Student Name</th>
              <th className="px-8 py-4 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">University</th>
              <th className="px-8 py-4 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Scholarship</th>
              <th className="px-8 py-4 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Date</th>
              <th className="px-8 py-4 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Status</th>
              <th className="px-8 py-4 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {submissions.map((app) => (
              <tr key={app.id} className="hover:bg-gray-50/30 transition-colors group">
                <td className="px-8 py-5">
                   <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center text-[10px] font-black text-gray-600">
                        {app.studentName.split(' ').map(n => n[0]).join('')}
                      </div>
                      <span className="text-sm font-bold text-gray-900">{app.studentName}</span>
                   </div>
                </td>
                <td className="px-8 py-5 text-sm font-medium text-gray-600">{app.university}</td>
                <td className="px-8 py-5 text-sm font-medium text-gray-600">{app.scholarship}</td>
                <td className="px-8 py-5">
                   <span className="text-xs font-bold text-gray-400">
                      {new Date(app.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                   </span>
                </td>
                <td className="px-8 py-5">
                   <StatusBadge status={app.status} />
                </td>
                <td className="px-8 py-5 text-center">
                   <button className="p-2 text-gray-300 hover:text-gray-900 transition-colors">
                      <EllipsisVerticalIcon className="w-5 h-5" />
                   </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RecentSubmissionsTable;
