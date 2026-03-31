import { BellIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { getImageURL } from '../../api/config';

const StudentTopNav = ({ user }) => {
  return (
    <header className="h-24 bg-white/80 backdrop-blur-md border-b border-gray-100/30 px-12 flex items-center justify-between sticky top-0 z-30">
      {/* Search Bar */}
      <div className="flex-1 max-w-xl">
        <div className="relative group">
          <MagnifyingGlassIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-orange-600 transition-colors" />
          <input 
            type="text" 
            placeholder="Search applications, documents..." 
            className="w-full bg-gray-50 border border-transparent rounded-2xl py-3 pl-12 pr-4 text-sm font-medium focus:bg-white focus:border-orange-100 focus:ring-4 focus:ring-orange-50 transition-all outline-none text-gray-900"
          />
        </div>
      </div>

      {/* User Actions */}
      <div className="flex items-center gap-6">
        <button className="relative p-2.5 text-gray-500 hover:text-orange-600 bg-gray-50 hover:bg-orange-50 rounded-xl transition-all">
          <BellIcon className="w-6 h-6" />
          <span className="absolute top-2.5 right-2.5 w-2.5 h-2.5 bg-orange-600 border-2 border-white rounded-full"></span>
        </button>
        
        <div className="h-10 w-[1px] bg-gray-100/50 mx-2"></div>
        
        <div className="flex items-center gap-4 group cursor-pointer">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-black text-gray-900 leading-none mb-1 group-hover:text-blue-600 transition-colors">
              {user?.firstName && user?.lastName 
                ? `${user.firstName} ${user.lastName}`
                : (user?.firstName || user?.lastName || user?.name || user?.email?.split('@')[0] || 'Student')}
            </p>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
              {user?.role === 'admin' ? 'Administrator' : 'Student Account'}
            </p>
          </div>
          <div className="w-10 h-10 rounded-xl overflow-hidden bg-gray-100 border-2 border-transparent group-hover:border-blue-100 transition-all">
            {user?.profilePicture ? (
              <img src={getImageURL(user.profilePicture)} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-blue-50 text-blue-600 font-bold">
                {(user?.firstName?.[0] || user?.email?.[0] || 'U').toUpperCase()}
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default StudentTopNav;
