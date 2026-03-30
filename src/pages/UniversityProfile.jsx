import React from 'react';
import { useParams, Link } from 'react-router-dom';
import Container from '../components/common/Container.jsx';
import ProfileHero from '../features/universities/components/Profile/ProfileHero.jsx';
import StatsGrid from '../features/universities/components/Profile/StatsGrid.jsx';
import ScholarshipList from '../features/universities/components/Profile/ScholarshipList.jsx';
import CampusGallery from '../features/universities/components/Profile/CampusGallery.jsx';
import AdmissionQuickLinks from '../features/universities/components/Profile/AdmissionQuickLinks.jsx';
import ProfileSection from '../features/universities/components/Profile/ProfileSection.jsx';
import Badge from '../components/common/Badge.jsx';

import { useQuery } from '@tanstack/react-query';
import { getUniversity } from '../api/universities.js';
import LoadingSpinner from '../components/common/LoadingSpinner.jsx';

function UniversityProfile() {
  const { id } = useParams();

  const { data, isLoading, isError } = useQuery({
    queryKey: ['university', id],
    queryFn: () => getUniversity(id),
    enabled: !!id
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (isError || !data?.data) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 text-center">
        <h2 className="text-2xl font-black text-gray-900 mb-4 tracking-tight">University Not Found</h2>
        <p className="text-gray-500 mb-8 max-w-sm">We couldn't find the institution you're looking for. It may have been relocated or removed.</p>
        <Link to="/universities" className="py-4 px-8 bg-orange-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg shadow-orange-100 transition-all hover:-translate-y-1">
          Explore Institutions
        </Link>
      </div>
    );
  }

  const uni = data.data;

  // Format stats from real data
  const stats = [
    { label: 'Global Ranking', value: uni.qsRank ? `#${uni.qsRank}` : 'N/A', sub: 'QS World Ranking', icon: '🏆' },
    { label: 'Intl. Students', value: uni.internationalStudents?.toLocaleString() || 'N/A', sub: 'Global Diversity', icon: '🌍' },
    { label: 'Faculty Count', value: uni.facultyCount?.toLocaleString() || 'N/A', sub: 'Academic Staff', icon: '🔬' },
    { label: 'Founded Year', value: uni.foundedYear || '—', sub: 'Est. Year', icon: '🏛️' },
  ];

  return (
    <div className="bg-white pt-20">
      <ProfileHero 
        id={uni.id || id}
        name={uni.name}
        nameInChinese={uni.nameInChinese}
        location={`${uni.city}, ${uni.province}`}
        logo={uni.logo}
        bannerImage={uni.bannerImage || uni.image}
        tags={uni.tiers || ["National Key University"]}
      />

      {/* Institutional Metadata Bar */}
      <div className="bg-gray-50 py-4 border-y border-gray-100">
         <Container>
            <div className="flex flex-wrap items-center gap-8">
               <div className="flex items-center gap-2">
                  <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Region:</span>
                  <span className="text-xs font-bold text-gray-900 bg-white px-3 py-1 rounded-full border border-gray-200">{uni.province}</span>
               </div>
               <div className="flex items-center gap-2">
                  <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Category:</span>
                  <span className="text-xs font-bold text-gray-900 bg-white px-3 py-1 rounded-full border border-gray-200">{uni.type} University</span>
               </div>
               <div className="flex items-center gap-2">
                  <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Status:</span>
                  <span className="text-xs font-bold text-green-600 bg-green-50 px-3 py-1 rounded-full border border-green-100">Verified Institution</span>
               </div>
            </div>
         </Container>
      </div>

      <div className="relative -mt-24 z-20">
        <Container>
          <StatsGrid stats={stats} />
        </Container>
      </div>

      <Container className="py-24">
        <div className="max-w-5xl mx-auto space-y-32">
            {/* Introduction Section */}
            {(uni.introduction || uni.description) && (
              <ProfileSection 
                title="Institutional Overview" 
                icon="📔"
                subtitle="A summary of our vision, mission and academic standing."
              >
                <div className="space-y-8">
                  {uni.introduction && (
                    <div className="p-10 bg-orange-50/30 rounded-[48px] border border-orange-100/50">
                      <p className="text-xl font-bold text-gray-900 leading-relaxed italic">
                        "{uni.introduction}"
                      </p>
                    </div>
                  )}
                  <div className="text-lg text-gray-500 font-medium leading-relaxed max-w-4xl whitespace-pre-wrap">
                    {uni.description || `Welcome to ${uni.name}. One of China's prestigious institutions, committed to academic excellence and global innovation.`}
                  </div>

                  {/* Search tags / Categories */}
                  {uni.searchTags?.length > 0 && (
                    <div className="flex flex-wrap gap-2 pt-6 border-t border-gray-100">
                      {uni.searchTags.map(tag => (
                        <span key={tag} className="text-[10px] font-black text-indigo-600 uppercase tracking-widest bg-indigo-50 px-4 py-2 rounded-2xl border border-indigo-100">
                           #{tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </ProfileSection>
            )}

            {/* History Section */}
            {uni.history && (
              <ProfileSection 
                title="History & Heritage" 
                icon="🏛️"
                subtitle="Discover our journey from founding to global excellence."
              >
                <div className="text-lg text-gray-600 font-medium leading-relaxed max-w-4xl bg-gray-50/50 p-10 rounded-[48px] border border-gray-100">
                  {uni.history}
                </div>
              </ProfileSection>
            )}

            {/* Highlights Section */}
            {uni.highlights?.length > 0 && (
              <ProfileSection 
                title="Institutional Highlights" 
                icon="✨"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {uni.highlights.map((h, i) => (
                    <div key={i} className="flex items-center gap-4 p-6 bg-white rounded-3xl border border-gray-100 hover:border-orange-200 hover:shadow-lg transition-all">
                      <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 text-sm font-black">
                        {i + 1}
                      </div>
                      <p className="font-bold text-gray-900">{h}</p>
                    </div>
                  ))}
                </div>
              </ProfileSection>
            )}

            {/* Global Partnerships */}
            {(uni.opportunities?.filter(Boolean).length > 0 || uni.partnershipCountries?.filter(Boolean).length > 0) && (
              <ProfileSection 
                title="Opportunities & Global Partnerships" 
                icon="🌍"
                subtitle="Our extensive network provides students with unique global perspectives and career paths."
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                  <div>
                    <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-orange-600 mb-6 font-inter underline decoration-orange-200 decoration-4 underline-offset-8">Strategic Opportunities</h4>
                    <div className="flex flex-wrap gap-3">
                      {uni.opportunities?.filter(Boolean).length > 0 ? (
                        uni.opportunities.filter(Boolean).map((opp, idx) => (
                          <span key={idx} className="px-5 py-2.5 bg-orange-50 text-orange-700 rounded-2xl text-[11px] font-black uppercase tracking-wider border border-orange-100">{opp}</span>
                        ))
                      ) : (
                        <p className="text-sm font-medium text-gray-400 italic">No specific strategic opportunities listed.</p>
                      )}
                    </div>
                  </div>
                  <div>
                    <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-600 mb-6 font-inter underline decoration-blue-200 decoration-4 underline-offset-8">Global Network</h4>
                    <div className="flex flex-wrap gap-3">
                      {uni.partnershipCountries?.filter(Boolean).length > 0 ? (
                        uni.partnershipCountries.filter(Boolean).map((country, idx) => (
                          <span key={idx} className="px-5 py-2.5 bg-blue-50 text-blue-700 rounded-2xl text-[11px] font-black uppercase tracking-wider border border-blue-100">{country}</span>
                        ))
                      ) : (
                        <p className="text-sm font-medium text-gray-400 italic">Global partnership data currently being updated.</p>
                      )}
                    </div>
                  </div>
                </div>
              </ProfileSection>
            )}

            {/* Academic Programs (Majors) */}
            {uni.majors?.length > 0 && (
              <ProfileSection 
                title="Academic Programs & Faculties" 
                icon="🎓"
                subtitle="Comprehensive list of available departments and specializations."
              >
                <div className="bg-white rounded-[40px] border border-gray-100 overflow-hidden shadow-sm">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-gray-50/80 border-b border-gray-100">
                          <th className="px-10 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Program Name</th>
                          <th className="px-10 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Faculty / Direction</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-50">
                        {uni.majors.map((cat, cIdx) => (
                          cat.list?.map((major, mIdx) => (
                            <tr key={`${cIdx}-${mIdx}`} className="hover:bg-orange-50/30 transition-colors group">
                              <td className="px-10 py-5">
                                <span className="text-lg font-bold text-gray-900 group-hover:text-orange-600 transition-colors">{major}</span>
                              </td>
                              <td className="px-10 py-5">
                                <span className="inline-flex px-4 py-1.5 bg-gray-50 text-[10px] font-black uppercase tracking-widest text-gray-500 rounded-full border border-gray-100 group-hover:bg-white group-hover:border-orange-100 transition-all">
                                  {cat.category || 'Standard Faculty'}
                                </span>
                              </td>
                            </tr>
                          ))
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </ProfileSection>
            )}

            {/* Structured Scholarship Notes */}
            {uni.scholarshipNotes?.length > 0 && (
              <ProfileSection 
                title="Scholarship Details" 
                icon="📜"
                subtitle="Key information regarding specific funding opportunities."
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {uni.scholarshipNotes.map((note, idx) => (
                    <div key={idx} className="p-10 bg-indigo-50/30 rounded-[48px] border border-indigo-100/50 hover:bg-white hover:shadow-xl transition-all">
                      <h4 className="text-xl font-black text-gray-900 mb-4">{note.name}</h4>
                      <p className="text-gray-500 font-medium leading-relaxed">{note.notes}</p>
                    </div>
                  ))}
                </div>
              </ProfileSection>
            )}

            <ScholarshipList scholarships={uni.scholarships} />

            {/* Accommodation Section */}
            {uni.accommodation?.length > 0 && (
              <ProfileSection 
                title="Student Living" 
                icon="🏠"
                subtitle="Comfortable and secure housing options for international students."
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {uni.accommodation.map((acc, idx) => (
                    <div key={idx} className="p-10 bg-gray-50 rounded-[48px] border border-gray-100 flex flex-col justify-between hover:bg-white hover:border-orange-200 hover:shadow-xl transition-all group">
                      <div>
                        <h4 className="text-2xl font-black text-gray-900 mb-4">{acc.type}</h4>
                        <div className="text-4xl font-black text-orange-600 mb-8 inline-flex items-baseline gap-2">
                          ¥{acc.pricePerYear || acc.price || 'N/A' } <span className="text-xs text-gray-400 font-black uppercase tracking-widest">/ Year</span>
                        </div>
                        {acc.facilities?.length > 0 && (
                          <div className="flex flex-wrap gap-2 mb-8">
                            {acc.facilities.map(f => (
                              <span key={f} className="text-[9px] font-black text-gray-500 uppercase tracking-widest bg-white px-4 py-1.5 rounded-full border border-gray-100 group-hover:bg-orange-50 group-hover:border-orange-100 transition-colors">{f}</span>
                            ))}
                          </div>
                        )}
                      </div>
                      <div className="pt-6 border-t border-gray-100 mt-auto">
                        <p className="text-sm text-gray-500 font-medium italic">“{acc.notes || 'Modern student housing with full amenities.'}”</p>
                      </div>
                    </div>
                  ))}
                </div>
              </ProfileSection>
            )}

            {/* Required Documents Section */}
            {uni.requiredDocuments?.length > 0 && (
              <ProfileSection 
                title="Admission Documents" 
                icon="📄"
                subtitle="Prepare these official documents to begin your application process."
              >
                <div className="bg-gray-900 rounded-[56px] p-12 text-white overflow-hidden relative shadow-2xl shadow-gray-900/20">
                   <div className="absolute top-0 right-0 w-80 h-80 bg-orange-600/20 blur-[120px] rounded-full -mr-40 -mt-40 animate-pulse"></div>
                   <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-10">
                      {uni.requiredDocuments.map((doc, idx) => (
                        <div key={idx} className="flex items-start gap-6 p-8 bg-white/5 rounded-[32px] border border-white/10 hover:bg-white/10 transition-all group">
                           <div className="w-12 h-12 rounded-2xl bg-orange-600 flex items-center justify-center font-black flex-shrink-0 text-lg shadow-lg shadow-orange-600/30">
                             {idx + 1}
                           </div>
                           <div className="space-y-1">
                              <h5 className="font-black uppercase tracking-widest text-sm mb-1 group-hover:text-orange-400 transition-colors">
                                {doc.name}
                                {doc.required && <span className="ml-3 text-[10px] text-orange-500 bg-orange-500/10 px-3 py-1 rounded-full border border-orange-500/20">Required</span>}
                              </h5>
                              <p className="text-sm text-gray-400 font-medium leading-relaxed">{doc.notes || 'Official document required for application.'}</p>
                           </div>
                        </div>
                      ))}
                   </div>
                </div>
              </ProfileSection>
            )}
            
            <CampusGallery images={uni.albums} />
        </div>
      </Container>

      <AdmissionQuickLinks university={uni} />
    </div>
  );
}

export default UniversityProfile;
