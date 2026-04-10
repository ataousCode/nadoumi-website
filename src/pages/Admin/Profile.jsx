import React, { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { authService } from '../../api/auth.service';
import { useToast } from '../../context/ToastContext';

// Modular Components
import ProfileHeader from '../../features/admin/components/Profile/ProfileHeader';
import PersonalInfoForm from '../../features/admin/components/Profile/PersonalInfoForm';
import CredentialsForm from '../../features/admin/components/Profile/CredentialsForm';

/**
 * Admin Profile Page
 * Orchestrates modular components for specialized admin management.
 */
const AdminProfile = () => {
  const toast = useToast();
  const queryClient = useQueryClient();
  const [isUploading, setIsUploading] = useState(false);

  const { data: admin, isLoading } = useQuery({
    queryKey: ['admin-profile'],
    queryFn: () => authService.getAdminProfile(),
  });

  const handleProfilePictureUpload = async (file) => {
    if (!file) return;
    const formData = new FormData();
    formData.append('profilePicture', file);
    
    setIsUploading(true);
    try {
      const result = await authService.updateAdminProfilePicture(formData);
      queryClient.setQueryData(['admin-profile'], (old) => ({ 
        ...old, 
        profilePicture: result.profilePicture 
      }));
      toast.success('Profile picture updated successfully');
    } catch (err) {
      toast.error('Failed to upload profile picture');
    } finally {
      setIsUploading(false);
    }
  };

  if (isLoading) return <LoadingState />;

  return (
    <div className="max-w-5xl mx-auto space-y-10 animate-fadeIn mb-20">
      {/* Header Section */}
      <ProfileHeader 
        admin={admin} 
        isUploading={isUploading} 
        onUpload={handleProfilePictureUpload} 
      />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Left Column: Management */}
        <div className="lg:col-span-2 space-y-10">
          <PersonalInfoForm admin={admin} />
        </div>

        {/* Right Column: Security & Settings */}
        <div className="space-y-10">
          <CredentialsForm />
        </div>
      </div>
    </div>
  );
};

/**
 * Visual feedback for initial data synchronization
 */
const LoadingState = () => (
  <div className="h-[60vh] flex flex-col items-center justify-center gap-4">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
    <p className="text-sm font-black text-gray-400 uppercase tracking-widest animate-pulse">
      Syncing Administrative Identity...
    </p>
  </div>
);

export default AdminProfile;
