import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { cn } from '../../../utils/cn';
import { isAuthenticated } from '../../../api/axiosInstance.js';

const formatDate = (dateString) => {
  if (!dateString) return '—';
  const d = new Date(dateString);
  if (isNaN(d.getTime())) return '—';
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: '2-digit',
    year: 'numeric'
  }).format(d);
};

const ScholarshipTable = ({ scholarships }) => {
  const navigate = useNavigate();
  return (
    <div className="w-full relative overflow-x-auto bg-white rounded-[2rem] border border-gray-100 shadow-sm mb-16 scrollbar-thin scrollbar-thumb-gray-200">
      <table className="w-full table-auto text-left border-collapse">
        <thead>
          <tr className="border-b border-gray-50 bg-gray-50/30">
            <th className="px-6 py-5 pl-8 text-[9px] font-black text-gray-400 uppercase tracking-widest min-w-[200px]">Program ID</th>
            <th className="px-5 py-5 text-[9px] font-black text-gray-400 uppercase tracking-widest text-center">City</th>
            <th className="px-5 py-5 text-[9px] font-black text-gray-400 uppercase tracking-widest min-w-[220px]">Program Name</th>
            <th className="px-5 py-5 text-[9px] font-black text-gray-400 uppercase tracking-widest text-center">Degree</th>
            <th className="px-5 py-5 text-[9px] font-black text-gray-400 uppercase tracking-widest text-center">Language</th>
            <th className="px-5 py-5 text-[9px] font-black text-gray-400 uppercase tracking-widest text-center">Intake</th>
            <th className="px-5 py-5 text-[9px] font-black text-gray-400 uppercase tracking-widest text-center">Scholarship Type</th>
            <th className="px-5 py-5 text-[9px] font-black text-gray-400 uppercase tracking-widest text-center">Deadline</th>
            <th className="px-6 py-5 pr-8 text-[9px] font-black text-gray-400 uppercase tracking-widest text-center">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50">
          {scholarships.map((s) => {
            const uni = Array.isArray(s.universities) && s.universities.length > 0 ? s.universities[0] : (s.university || {});
            const scholarshipId = s.scholarshipId || (s.id?.toString().slice(-8).toUpperCase());
            
            return (
              <tr key={s.id} className="hover:bg-orange-50/10 transition-colors group">
                <td className="px-6 py-6 pl-8">
                  <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest bg-gray-50 px-2.5 py-1.5 rounded-lg border border-gray-100 whitespace-nowrap">
                    #{scholarshipId}
                  </span>
                </td>
                <td className="px-5 py-6 text-center">
                  <div className="flex flex-col">
                    <span className="text-[12px] font-bold text-gray-700 whitespace-nowrap">
                      {uni.city || 'China'}
                    </span>
                    <span className="text-[9px] font-bold text-gray-400 uppercase whitespace-nowrap">
                      {uni.province || 'Mainland'}
                    </span>
                  </div>
                </td>
                <td className="px-5 py-6">
                  <div className="flex items-center gap-4">
                    <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center p-2 border border-gray-100 group-hover:bg-white transition-all overflow-hidden">
                      <img 
                        src={uni.logo || "/nadoumi-logo.png"} 
                        alt={uni.name} 
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <div>
                      <Link 
                        to={`/scholarships/${s.id || s.scholarshipId}`}
                        className="text-[13px] font-bold text-gray-900 group-hover:text-orange-600 transition-colors block leading-tight mb-1"
                      >
                        {s.field ? `${s.field}: ` : ''}{s.programName || s.title}
                      </Link>
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest truncate max-w-[150px]">
                        {uni.name || 'Nadoumi Partner'}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="px-5 py-6 text-center">
                  <span className="px-3 py-1 bg-gray-50 text-gray-600 rounded-full text-[10px] font-black uppercase tracking-widest border border-gray-100 whitespace-nowrap">
                    {s.degree || '—'}
                  </span>
                </td>
                <td className="px-5 py-6 text-center">
                  <span className="text-[10px] font-black text-indigo-600 uppercase tracking-widest whitespace-nowrap">
                    {s.teachingLanguage || 'English'}
                  </span>
                </td>
                <td className="px-5 py-6 text-[11px] font-black text-orange-600 text-center whitespace-nowrap uppercase tracking-widest">
                  {s.intake || 'TBA'}
                </td>
                <td className="px-5 py-6 text-center">
                  <span className="px-3 py-1 bg-orange-50 text-orange-700 rounded-lg text-[9px] font-black uppercase tracking-widest border border-orange-100 whitespace-nowrap">
                    {s.scholarshipCategory || 'Partial'}
                  </span>
                </td>
                <td className="px-5 py-6 text-[10px] font-black text-gray-500 text-center uppercase tracking-widest">
                  {formatDate(s.applicationDeadline)}
                </td>
                <td className="px-6 py-6 pr-8">
                  <div className="flex items-center justify-center gap-2">
                    <Link 
                      to={`/scholarships/${s.id || s.scholarshipId}`}
                      className="flex-1 min-w-[55px] py-2 bg-white text-gray-900 border border-gray-100 rounded-lg text-[9px] font-black uppercase tracking-widest hover:border-orange-600 hover:text-orange-600 transition-all text-center"
                    >
                      View
                    </Link>
                    <button 
                      onClick={() => {
                        const sId = s.id || s.scholarshipId;
                        const destination = `/application?scholarshipId=${sId || ''}`;
                        if (isAuthenticated('student')) {
                          navigate(destination);
                        } else {
                          navigate(`/login?redirect=${destination}`);
                        }
                      }}
                      className="flex-1 min-w-[55px] py-2 bg-orange-600 text-white rounded-lg text-[9px] font-black uppercase tracking-widest hover:bg-gray-900 transition-all text-center shadow-sm"
                    >
                      Apply
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default ScholarshipTable;
