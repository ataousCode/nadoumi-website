import Button from './Button.jsx'
import { Link, useNavigate } from 'react-router-dom'
import Skeleton from './Skeleton.jsx'
import { cn } from '../../utils/cn'
import { isAuthenticated } from '../../api/axiosInstance.js'

function formatDate(value) {
  if (!value) return '—'
  try {
    const d = new Date(value)
    if (Number.isNaN(d.getTime())) return '—'
    return d.toLocaleDateString()
  } catch {
    return '—'
  }
}

/**
 * Unified ScholarshipCard component
 * @param {Object} props
 * @param {Object} props.scholarship - Scholarship data object
 * @param {string} props.variant - 'simple' (home) or 'detailed' (listing)
 * @param {boolean} props.loading - Loading state
 * @param {Function} props.onClick - Click handler
 */
export default function ScholarshipCard({ scholarship, variant = 'simple', loading = false, onClick }) {
  if (loading) {
    if (variant === 'simple') {
      return (
        <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 flex flex-col h-full">
          <Skeleton className="h-48 w-full" />
          <div className="p-6 flex flex-col flex-1 space-y-4">
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
            <div className="pt-4 border-t border-gray-50 mt-auto">
              <Skeleton className="h-4 w-24" />
            </div>
          </div>
        </div>
      );
    }
    return (
      <div className="flex flex-col rounded-2xl border border-gray-100 bg-white shadow-soft overflow-hidden h-full">
        <Skeleton className="h-44 w-full" />
        <div className="p-5 flex-1 flex flex-col space-y-4">
          <div className="space-y-2">
            <Skeleton className="h-5 w-3/4" />
            <Skeleton className="h-3 w-1/2" />
          </div>
          <Skeleton className="h-4 w-full" />
          <div className="mt-auto pt-4 border-b border-gray-50 pb-4">
            <Skeleton className="h-8 w-full" />
          </div>
          <div className="pt-4">
            <Skeleton className="h-10 w-full rounded-xl" />
          </div>
        </div>
      </div>
    );
  }

  if (!scholarship) return null;

  const title = scholarship.title;
  const description = scholarship.description;
  const image = scholarship.coverImage || scholarship.image || scholarship.university?.logo;
  const badge = scholarship.badge || scholarship.category;
  const badgeColor = scholarship.badgeColor || 'orange'; // Default to orange based on theme
  
  const badgeColors = {
    blue: 'bg-blue-600 text-white',
    green: 'bg-emerald-500 text-white',
    orange: 'bg-orange-600 text-white',
    indigo: 'bg-indigo-600 text-white'
  };

  if (variant === 'simple') {
    return (
      <Link 
        to={`/scholarships/${scholarship.id || scholarship.scholarshipId}`}
        className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300 border border-gray-100 flex flex-col h-full group cursor-pointer"
      >
        <div className="relative h-48 overflow-hidden">
          <img 
            src={image} 
            alt={title} 
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
          />
          {badge && (
            <div className={cn(
              "absolute top-4 left-4 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider",
              badgeColors[badgeColor] || badgeColors.orange
            )}>
              {badge}
            </div>
          )}
        </div>
        
        <div className="p-6 flex flex-col flex-1">
          <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-orange-600 transition-colors">
            {title}
          </h3>
          <p className="text-gray-600 text-sm mb-6 line-clamp-2 flex-1">
            {description}
          </p>
          
          <div className="flex items-center justify-between pt-4 border-t border-gray-50 mt-auto">
            <div className="flex items-center gap-2 text-gray-500 text-xs text-[10px] font-bold uppercase tracking-widest">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span>{scholarship.deadline || 'View Details'}</span>
            </div>
          </div>
        </div>
      </Link>
    );
  }

  // Detailed variant (Screenshot 2 style Grid)
  // Detailed variant (Screenshot 2 style Grid)
  const deadline = formatDate(scholarship.applicationDeadline || scholarship.deadline);
  
  const formatCurrency = (val, currency = 'RMB') => {
    if (val === undefined || val === null || val === '') return '0';
    const num = Number(val);
    if (isNaN(num)) return '0';
    const symbol = currency === 'USD' ? '$' : '¥';
    return `${symbol}${num.toLocaleString()} ${currency}`;
  };

  const tuitionOriginal = scholarship.originalTuitionFee || 0;
  const tuitionAfter = scholarship.tuitionFeeAfterScholarship || scholarship.tuitionAfterScholarship || 0;

  const id = scholarship.id || scholarship.scholarshipId;
  const navigate = useNavigate();

  const handleApply = (e) => {
    e.stopPropagation();
    const destination = `/application?scholarshipId=${id || ''}`;
    if (isAuthenticated('student')) {
      navigate(destination);
    } else {
      navigate(`/login?redirect=${destination}`);
    }
  };

  return (
    <article
      className="group flex flex-col rounded-[2.5rem] border border-gray-100 bg-white shadow-soft transition-all duration-500 cursor-pointer overflow-hidden h-full hover:shadow-2xl hover:shadow-orange-100 hover:-translate-y-1"
      onClick={() => onClick?.(scholarship)}
    >
      {/* Image Header */}
      <div className="relative h-52 overflow-hidden bg-gray-100">
        <img
          src={image || 'https://images.unsplash.com/photo-152305085306e-88e4f6e0821e?auto=format&fit=crop&q=80'}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/10 to-transparent" />
        
        {/* Title Overlay */}
        <div className="absolute bottom-5 left-6 right-6">
          <h3 className="text-base font-black text-white leading-tight tracking-tight drop-shadow-lg">
            {scholarship.field ? `${scholarship.field}: ` : ''}{scholarship.programName || title}
          </h3>
        </div>

        {/* Top Badges */}
        <div className="absolute top-4 left-5 flex gap-2">
          {scholarship.isHot && (
            <span className="px-3 py-1 bg-red-500 text-white text-[8px] font-black uppercase tracking-widest rounded-lg shadow-lg">HOT</span>
          )}
          {scholarship.isRecommended && (
             <span className="px-3 py-1 bg-orange-600 text-white text-[8px] font-black uppercase tracking-widest rounded-lg shadow-lg">TOP</span>
          )}
        </div>
      </div>

      <div className="p-6 flex-1 flex flex-col">
        {/* Program Details */}
        <div className="space-y-3 mb-6">
          <div className="flex items-center justify-between">
            <p className="text-[9px] font-black text-gray-500 uppercase tracking-widest bg-gray-50 px-2 py-1 rounded-md border border-gray-100">
              Program ID: {scholarship.scholarshipId || id || '—'}
            </p>
            <button 
              type="button"
              className="text-gray-300 hover:text-orange-600 transition-colors"
              onClick={(e) => { e.stopPropagation(); }}
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
            </button>
          </div>

          <div className="flex flex-col pt-1">
             <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest mb-0.5">Tuition Fee:</p>
             <div className="flex items-baseline gap-3">
               <span className="text-3xl font-black text-orange-600 tracking-tighter">
                 {formatCurrency(tuitionAfter, scholarship.universityFeeCurrency)}
               </span>
               {Number(tuitionOriginal) > 0 && Number(tuitionOriginal) !== Number(tuitionAfter) && (
                 <span className="text-sm font-bold text-gray-300 line-through decoration-gray-200">
                   {formatCurrency(tuitionOriginal, scholarship.universityFeeCurrency)}
                 </span>
               )}
             </div>
          </div>

          <div className="grid grid-cols-1 gap-2 pt-4 border-t border-gray-50">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest min-w-[60px]">City:</span>
              <span className="text-[11px] font-black text-gray-900 uppercase">
                {scholarship.universities?.[0]?.city || scholarship.university?.city || scholarship.city || '—'}, {scholarship.universities?.[0]?.province || scholarship.university?.province || 'Mainland'}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest min-w-[60px]">Degree:</span>
              <span className="text-[11px] font-black text-gray-900 uppercase">
                {scholarship.degree || '—'}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest min-w-[60px]">Language:</span>
              <span className="text-[11px] font-black text-indigo-600 uppercase">
                {scholarship.teachingLanguage || '—'}
              </span>
            </div>
          </div>
        </div>

        <div className="mt-auto pt-5 border-t border-gray-50 flex flex-col gap-3">
           <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-gray-400 bg-gray-50 px-3 py-1 rounded-lg border border-gray-100">
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                <span className="text-[9px] font-black uppercase tracking-widest">Deadline: {deadline}</span>
              </div>
              <span className="text-[9px] font-black text-orange-600 uppercase tracking-widest">
                {scholarship.intake || 'Autumn 2024'}
              </span>
           </div>
           
           <div className="grid grid-cols-2 gap-2 mt-2">
              <Link
                to={`/scholarships/${id}`}
                className="py-3 bg-white text-gray-900 rounded-xl font-black text-[9px] uppercase tracking-widest text-center border border-gray-200 hover:border-orange-600 hover:text-orange-600 transition-all"
              >
                View
              </Link>
              <button
                onClick={handleApply}
                className="py-3 bg-orange-600 text-white rounded-xl font-black text-[9px] uppercase tracking-widest text-center shadow-lg shadow-orange-100 hover:bg-gray-900 transition-all hover:shadow-orange-200"
              >
                Apply
              </button>
           </div>
        </div>
      </div>
    </article>
  );
}
