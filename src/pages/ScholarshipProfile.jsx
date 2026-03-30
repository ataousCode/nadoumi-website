import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getScholarship } from '../api/scholarships.js';
import Container from '../components/common/Container.jsx';
import DetailsTable from '../components/common/DetailsTable.jsx';
import LoadingSpinner from '../components/common/LoadingSpinner.jsx';
import { cn } from '../utils/cn';
import { isAuthenticated } from '../api/axiosInstance';

const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  const d = new Date(dateString);
  if (isNaN(d.getTime())) return 'N/A';
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: '2-digit',
    year: 'numeric'
  }).format(d);
};

function ScholarshipProfile() {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState('program'); // 'program', 'requirements', 'fees'

  const handleApplyNow = () => {
    const destination = `/application?scholarshipId=${id || ''}`;
    if (isAuthenticated('student')) {
      window.location.href = destination;
    } else {
      window.location.href = `/login?redirect=${destination}`;
    }
  };

  const { data: resp, isLoading, error } = useQuery({
    queryKey: ['scholarship', id],
    queryFn: () => getScholarship(id)
  });

  const scholarshipData = resp?.data;

  if (isLoading) return <LoadingSpinner />;
  if (error || !scholarshipData) return (
    <Container className="py-20 text-center">
      <h2 className="text-2xl font-black text-gray-900 mb-4">Scholarship Not Found</h2>
      <Link to="/scholarships" className="text-orange-600 font-bold hover:underline">Back to list</Link>
    </Container>
  );

  const s = scholarshipData || {};

  // Multi-pattern university resolution
  const university = s.university || (Array.isArray(s.universities) ? s.universities[0] : s.universities);
  const universityName = university?.name || s.universityName || 'Nadoumi Partner University';

  const tabs = [
    { id: 'program', label: 'Program details' },
    { id: 'requirements', label: 'Application requirements' },
    { id: 'fees', label: 'Fee structure' }
  ];

  const basicInfo = [
    { label: 'Field', value: s.field || '—' },
    { label: 'Program name', value: s.programName || s.title || '—' },
    { label: 'Degree', value: s.degree || '—' },
    { label: 'Intake', value: s.intake || '—' },
    { label: 'Application deadline', value: formatDate(s.applicationDeadline), isCritical: true }
  ];

  const scholarshipInfo = [
    { label: 'Scholarship duration', value: s.scholarshipDurationText || (s.scholarshipDuration ? `${s.scholarshipDuration} years` : '—') },
    { label: 'Scholarship policy', value: s.scholarshipPolicy || '—' }
  ];

  const requirementInfo = [
    { label: 'Age (years old)', value: (s.ageMin !== undefined && s.ageMax !== undefined) ? `${s.ageMin} to ${s.ageMax}` : (s.ageMax ? `Up to ${s.ageMax}` : '—') },
    { label: 'Accepted countries', value: Array.isArray(s.acceptedCountries) && s.acceptedCountries.length > 0 ? s.acceptedCountries.join(', ') : 'Unlimited' },
    { label: 'China Travel history', value: s.chinaVisitPolicy || '—' },
    { label: 'Minors accepted', value: s.acceptMinors ? 'Yes' : 'No' },
    { label: 'Current location', value: s.currentLocationPolicy || '—' },
    { label: 'Score requirements', value: s.scoreRequirements || '—' },
    // Structured Scores
    ...(s.gpaMin ? [{ label: 'Minimum GPA', value: s.gpaMin }] : []),
    ...(s.ieltsScore ? [{ label: 'IELTS Score', value: s.ieltsScore }] : []),
    ...(s.toeflScore ? [{ label: 'TOEFL Score', value: s.toeflScore }] : []),
    ...(s.duolingoScore ? [{ label: 'Duolingo Score', value: s.duolingoScore }] : []),
    ...(s.hskLevel ? [{ label: 'HSK Level', value: `Level ${s.hskLevel}` }] : []),
  ];

  const documentInfo = (Array.isArray(s.applicationDocuments) ? s.applicationDocuments : []).map(doc => ({
    label: doc?.name || 'Requirement',
    value: doc?.required ? 'Mandatory' : 'Optional',
    notes: doc?.notes
  }));

  const additionalRequirements = (Array.isArray(s.applicantRequirements) ? s.applicantRequirements : []).map(req => ({
    label: req?.category || 'Critieria',
    value: req?.requirement
  }));

  const formatCurrency = (val, currency = 'RMB') => {
    if (val === undefined || val === null || val === '') return '—';
    const num = Number(val);
    if (isNaN(num)) return val;
    const symbol = currency === 'USD' ? '$' : '¥';
    return `${symbol}${num.toLocaleString()} ${currency}`;
  };

  const feeInfo = [
    { label: 'Original tuition fee', value: formatCurrency(s.originalTuitionFee, s.universityFeeCurrency) },
    { label: 'Tuition after scholarship', value: formatCurrency(s.tuitionFeeAfterScholarship, s.universityFeeCurrency) },
    { label: 'Accommodation (Quad)', value: formatCurrency(s.accommodationFeeQuad, s.universityFeeCurrency) },
    { label: 'Accommodation after scholarship', value: formatCurrency(s.accommodationFeeAfterScholarship, s.universityFeeCurrency) },
    { label: 'Application fee (Nadoumi Agent)', value: formatCurrency(s.nadoumiApplicationFee, s.nadoumiFeeCurrency) },
    { label: 'Service fee (Nadoumi Agent)', value: formatCurrency(s.nadoumiServiceFee, s.nadoumiFeeCurrency) }
  ];

  return (
    <main className="min-h-screen bg-[#F8F9FA] pb-20 pt-24">
      {/* Hero / Header Section */}
      <div className="bg-white border-b border-gray-100">
        <Container className="py-12">
          <div className="flex flex-col lg:flex-row gap-12 items-start">
            {/* Cover Image */}
            <div className="w-full lg:w-96 aspect-[4/3] rounded-[48px] overflow-hidden shadow-2xl shadow-orange-100 border border-gray-100">
              {s.coverImage ? (
                <img src={s.coverImage} alt={s.title} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-orange-50 flex items-center justify-center text-6xl">🎓</div>
              )}
            </div>

            {/* Title & Key Badge */}
            <div className="flex-1">
              <div className="flex gap-2 mb-6">
                 <span className="px-5 py-2 bg-orange-50 text-orange-600 rounded-full text-[10px] font-black uppercase tracking-widest border border-orange-100/50">
                   {s.scholarshipCategory || 'Partial'} Scholarship
                 </span>
                 <span className="px-5 py-2 bg-indigo-50 text-indigo-600 rounded-full text-[10px] font-black uppercase tracking-widest border border-indigo-100/50">
                    {s.teachingLanguage || 'English'} Medium
                 </span>
              </div>
              <h1 className="text-4xl lg:text-5xl font-black text-gray-900 leading-[1.1] mb-8 lg:max-w-3xl">
                {s.title || s.programName}
              </h1>
              <div className="flex flex-wrap gap-8 items-center pt-8 border-t border-gray-50">
                <div className="flex flex-col">
                   <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">University</span>
                   <span className="text-lg font-bold text-gray-900">{universityName}</span>
                </div>
                <div className="flex flex-col">
                   <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Status</span>
                   <span className="inline-flex items-center gap-2">
                     <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                     <span className="text-lg font-bold text-gray-900 capitalize">{s.status || 'Active'}</span>
                   </span>
                </div>
                <div className="flex-1 lg:text-right">
                  <button 
                    onClick={handleApplyNow}
                    className="inline-block px-10 py-5 bg-gray-900 text-white rounded-[24px] font-black text-sm uppercase tracking-widest hover:bg-orange-600 transition-all shadow-xl shadow-gray-900/10 active:scale-95"
                  >
                    Apply Now
                  </button>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </div>

      {/* Floating Mobile CTA */}
      <div className="lg:hidden fixed bottom-8 left-8 right-8 z-50">
        <button 
          onClick={handleApplyNow}
          className="w-full py-6 bg-gray-900 text-white rounded-[32px] font-black text-sm uppercase tracking-widest shadow-2xl shadow-gray-900/40 active:scale-95 flex items-center justify-center gap-4"
        >
          Apply Now
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
        </button>
      </div>

      {/* Main Content & Tabs */}
      <Container className="pt-12">
        <div className="bg-white rounded-[48px] shadow-sm border border-gray-100 overflow-hidden">
          {/* Custom Tab Navigation */}
          <div className="flex border-b border-gray-100 px-10 pt-8 gap-12 overflow-x-auto">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "pb-6 text-sm font-black uppercase tracking-widest transition-all relative whitespace-nowrap",
                  activeTab === tab.id 
                    ? "text-orange-600" 
                    : "text-gray-400 hover:text-gray-600"
                )}
              >
                {tab.label}
                {activeTab === tab.id && (
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-orange-600 rounded-t-full shadow-[0_-4px_12px_rgba(234,88,12,0.3)] transition-all" />
                )}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="px-10 py-12">
            {activeTab === 'program' && (
              <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
                <DetailsTable title="Basic information" items={basicInfo} />
                <DetailsTable title="Scholarship information" items={scholarshipInfo} />
              </div>
            )}

            {activeTab === 'requirements' && (
              <div className="animate-in fade-in slide-in-from-bottom-2 duration-500 space-y-10">
                <DetailsTable title="General Eligibility" items={requirementInfo} />
                {additionalRequirements.length > 0 && (
                  <DetailsTable title="Specialized Criteria" items={additionalRequirements} />
                )}
                {documentInfo.length > 0 && (
                  <DetailsTable title="Required Documentation" items={documentInfo} />
                )}
              </div>
            )}

            {activeTab === 'fees' && (
              <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
                <DetailsTable title="Tuition & Living Fees" items={feeInfo.slice(0, 4)} />
                <DetailsTable title="Nadoumi Service Fees" items={feeInfo.slice(4)} />
              </div>
            )}
          </div>
        </div>
      </Container>
    </main>
  );
}

export default ScholarshipProfile;
