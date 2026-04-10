import React, { useRef, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { GlobeAltIcon, PencilSquareIcon } from '@heroicons/react/24/outline';
import StatusBadge from '../../../components/common/Dashboard/StatusBadge';
import { authService } from '../../../api/auth.service';
import { useToast } from '../../../context/ToastContext';
import { getImageURL } from '../../../api/axiosInstance.js';

const ProfileHero = ({ student }) => {
  const queryClient = useQueryClient();
  const fileInputRef = useRef(null);
  const [uploading, setUploading] = useState(false);
  const { success: toastSuccess, error: toastError } = useToast();

  const applicantId = student?.applicantId || `CUSP-${new Date(student?.createdAt || Date.now()).getFullYear()}-${student?.id?.slice(-4)?.toUpperCase() || '8832'}`;

  const handleEditClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Basic validation
    if (!file.type.startsWith('image/')) {
        toastError('Please select a valid image file');
        return;
    }

    try {
      setUploading(true);
      const response = await authService.updateProfilePicture(file);
      
      // The backend returns { success: true, data: { profilePicture: '...' } }
      // Or if using response.json() it returns the object directly
      const newPic = response.data?.profilePicture || response.profilePicture;
      
      if (newPic) {
        toastSuccess('Profile picture updated successfully');
        queryClient.invalidateQueries({ queryKey: ['profile'] });
      }
    } catch (err) {
      console.error('Upload error:', err);
      toastError(err.message || 'Failed to update profile picture');
    } finally {
      setUploading(false);
      // Reset input
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  return (
    <div className="bg-white rounded-[24px] p-6 lg:p-8 shadow-sm border border-gray-100/30 mb-8 overflow-hidden relative group">
      {/* Background Accent */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-blue-50/20 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-blue-100/20 transition-colors duration-1000"></div>

      <div className="flex flex-col md:flex-row items-center gap-8 relative z-10">
        {/* Avatar Section */}
        <div className="relative">
          <div className="w-24 h-24 lg:w-28 lg:h-28 rounded-[32px] overflow-hidden border-4 border-white shadow-lg relative bg-blue-50/50">
            {uploading ? (
              <div className="w-full h-full flex items-center justify-center bg-gray-50">
                <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-blue-600"></div>
              </div>
            ) : student?.profilePicture ? (
              <img src={getImageURL(student.profilePicture)} alt="Avatar" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-blue-600 font-bold bg-blue-50">
                <span className="text-3xl">{(student?.firstName?.[0] || student?.email?.[0] || 'U').toUpperCase()}</span>
              </div>
            )}
          </div>
          
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileChange} 
            accept="image/*" 
            className="hidden" 
          />
          
          <button 
            onClick={handleEditClick}
            disabled={uploading}
            className="absolute -bottom-1 -right-1 w-8 h-8 lg:w-9 lg:h-9 bg-orange-600 text-white rounded-xl flex items-center justify-center shadow-lg shadow-orange-600/20 hover:scale-110 active:scale-95 transition-all disabled:opacity-50 disabled:scale-100"
          >
            <PencilSquareIcon className="w-4 h-4 lg:w-5 lg:h-5" />
          </button>
        </div>

        {/* Info Section */}
        <div className="flex-1 text-center md:text-left">
          <div className="mb-2">
            <h1 className="text-2xl lg:text-3xl font-black text-gray-900 tracking-tight mb-1 leading-tight">
              {student?.firstName} {student?.lastName}
            </h1>
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
              <StatusBadge label="Active Explorer" variant="default" />
              <div className="w-1 h-1 bg-gray-200 rounded-full"></div>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none">
                Applicant ID: <span className="text-blue-600">{applicantId}</span>
              </p>
            </div>
          </div>
          
          <div className="mt-6">
            <button className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white font-black rounded-xl shadow-md shadow-blue-600/10 hover:bg-blue-700 hover:-translate-y-0.5 active:translate-y-0 transition-all text-[11px] uppercase tracking-wider">
              <GlobeAltIcon className="w-4 h-4" />
              <span>Public View</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileHero;
