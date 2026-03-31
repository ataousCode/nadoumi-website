import React from 'react';
import StudentLayout from '../../components/layout/StudentLayout';
import ProfileHero from '../../features/profile/components/ProfileHero';
import PersonalInfoCard from '../../features/profile/components/PersonalInfoCard';
import AcademicBackgroundCard from '../../features/profile/components/AcademicBackgroundCard';
import StudyPreferencesCard from '../../features/profile/components/StudyPreferencesCard';
import AccountAccessCard from '../../features/profile/components/AccountAccessCard';
import { useQuery } from '@tanstack/react-query';
import { authService } from '../../api/auth.service';
import { useToast } from '../../context/ToastContext';

const Profile = () => {
  const { error } = useToast();

  const { data, isLoading } = useQuery({
    queryKey: ['profile'],
    queryFn: () => authService.getProfile(),
    onError: (err) => {
      console.error('Profile fetch error:', err);
    }
  });

  const student = data?.data || data;

  if (isLoading) {
    return (
      <StudentLayout user={null}>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-600"></div>
        </div>
      </StudentLayout>
    );
  }

  // Only handle missing student data AFTER loading is complete
  if (!isLoading && !student) {
    return (
      <StudentLayout user={null}>
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-12">
          <div className="w-16 h-16 bg-red-50 text-red-600 rounded-full flex items-center justify-center mb-4">
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h2 className="text-xl font-black text-gray-900 mb-2">Session Expired</h2>
          <p className="text-sm font-medium text-gray-500 mb-6 max-w-xs">Your session may have timed out. Please log in again to access your profile.</p>
          <a href="/login" className="bg-blue-600 text-white px-8 py-3 rounded-2xl font-bold shadow-lg shadow-blue-200 hover:scale-105 transition-all">
            Return to Login
          </a>
        </div>
      </StudentLayout>
    );
  }

  return (
    <StudentLayout user={student}>
      <div className="space-y-8 pb-12">
        {/* Top Hero Section */}
        <ProfileHero student={student} />

        {/* Grid Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* Main Column (2/3 width) */}
          <div className="lg:col-span-2 space-y-8">
            <PersonalInfoCard student={student} />
            <AcademicBackgroundCard profile={student.profile} />
          </div>

          {/* Sidebar Column (1/3 width) */}
          <div className="space-y-8">
            <StudyPreferencesCard profile={student.profile} />
            <AccountAccessCard />
          </div>
        </div>
      </div>
    </StudentLayout>
  );
};

export default Profile;
