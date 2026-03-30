import { Link } from 'react-router-dom';
import Container from '../../../../components/common/Container.jsx';
import { isAuthenticated } from '../../../../api/axiosInstance';

function ProfileHero({ id, name, nameInChinese, location, logo, bannerImage, tags = [] }) {
  const handleApplyNow = () => {
    const destination = `/application?universityId=${id || ''}`;
    if (isAuthenticated('student')) {
      window.location.href = destination;
    } else {
      window.location.href = `/login?redirect=${destination}`;
    }
  };
  return (
    <section className="relative h-[70vh] min-h-[600px] overflow-hidden flex items-end pb-32">
      {/* Background Banner */}
      <div className="absolute inset-0 z-0">
        <img 
          src={bannerImage} 
          alt={`${name} campus`}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/40 to-transparent" />
      </div>

      <Container className="relative z-10 w-full">
        <div className="flex flex-col md:flex-row items-end gap-10 animate-fade-in-up">
          {/* Logo */}
          <div className="w-40 h-40 bg-white rounded-[40px] shadow-2xl p-6 flex items-center justify-center border border-white/20 transform -rotate-3 hover:rotate-0 transition-transform duration-500 flex-shrink-0">
            <img src={logo} alt={`${name} logo`} className="w-full h-full object-contain" />
          </div>

          {/* Identity */}
          <div className="flex-1 pb-2">
            <div className="flex flex-wrap gap-2 mb-6">
              {tags.map((tag, idx) => (
                <span key={idx} className="bg-orange-600 px-4 py-1.5 rounded-full text-[10px] font-black text-white uppercase tracking-widest leading-none shadow-lg shadow-orange-900/20">
                  {tag}
                </span>
              ))}
            </div>
            
            <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter leading-none mb-4">
              {name}
            </h1>
            <div className="flex items-center gap-4">
              <p className="text-orange-400 font-bold text-2xl tracking-wide">
                {nameInChinese}
              </p>
              <div className="h-6 w-px bg-white/20" />
              <div className="flex items-center gap-2 text-white/80 font-bold tracking-tight">
                <svg className="w-5 h-5 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                </svg>
                {location}
              </div>
            </div>
          </div>

          {/* Call to Action */}
          <div className="pb-4">
            <button 
              onClick={handleApplyNow}
              className="py-5 px-12 bg-orange-600 text-white rounded-[32px] font-black text-sm uppercase tracking-[0.2em] shadow-2xl shadow-orange-900/40 transition-all hover:-translate-y-1 hover:bg-orange-500 active:scale-95 flex items-center gap-3"
            >
              Apply Now
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </button>
          </div>
        </div>
      </Container>
    </section>
  );
}

export default ProfileHero;
