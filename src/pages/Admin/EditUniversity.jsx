import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ChevronLeftIcon } from '@heroicons/react/24/outline';
import { useToast } from '../../context/ToastContext';
import UniversityForm from './components/UniversityForm';
import { getUniversity, updateUniversity } from '../../api/universities';

import AdminLoading from './components/AdminLoading';
import AdminError from './components/AdminError';

const EditUniversity = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { success, error: showError } = useToast();

  const { data: university, isLoading: isFetching, isError, error, refetch } = useQuery({
    queryKey: ['admin-university', id],
    queryFn: () => getUniversity(id),
    select: (res) => res?.data,
    refetchOnWindowFocus: false,
  });

  const mutation = useMutation({
    mutationFn: (data) => updateUniversity(id, data),
    onSuccess: () => {
      success('University updated successfully!');
      queryClient.invalidateQueries(['admin-universities']);
      queryClient.invalidateQueries(['admin-university', id]);
      navigate('/admin/universities');
    },
    onError: (err) => {
      showError(err.message || 'Failed to update university');
    }
  });

  if (isFetching) {
    return <AdminLoading message="Opening University Profile..." subtext="Syncing institutional data for editing." />;
  }

  if (isError) {
    return <AdminError message={error?.message} onRetry={refetch} />;
  }

  return (
    <div className="max-w-5xl mx-auto space-y-10">
      {/* Back Button */}
      <button 
        onClick={() => navigate('/admin/universities')}
        className="flex items-center gap-2 text-gray-400 hover:text-gray-900 font-bold transition-all group"
      >
        <div className="w-10 h-10 rounded-xl bg-white border border-gray-100 flex items-center justify-center group-hover:bg-gray-50 group-hover:border-gray-200 transition-all">
          <ChevronLeftIcon className="w-5 h-5" />
        </div>
        <span className="text-sm tracking-tight uppercase tracking-widest text-[11px] font-black">Back to List</span>
      </button>

      {/* Header */}
      <div>
        <h1 className="text-5xl font-black text-gray-900 tracking-tighter leading-none mb-4">Edit University</h1>
        <p className="text-xl text-gray-400 font-medium font-inter">Update institutional details, media, and accommodation profiles.</p>
      </div>

      <UniversityForm 
        initialData={university} 
        onSubmit={(data) => mutation.mutate(data)} 
        isLoading={mutation.isPending} 
      />
    </div>
  );
};

export default EditUniversity;
