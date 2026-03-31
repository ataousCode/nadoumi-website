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

  // If no student data is found after loading, redirect to login instead of showing a white screen
  if (!student) {
    window.location.href = '/login';
    return null;
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
