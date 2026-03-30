import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ChevronLeftIcon } from '@heroicons/react/24/outline';
import { useToast } from '../../context/ToastContext';
import UniversityForm from './components/UniversityForm';
import { createUniversity } from '../../api/universities';

const NewUniversity = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { success, error: showError } = useToast();

  const mutation = useMutation({
    mutationFn: (data) => createUniversity(data),
    onSuccess: () => {
      success('University created successfully!');
      queryClient.invalidateQueries(['admin-universities']);
      navigate('/admin/universities');
    },
    onError: (error) => {
      showError(error.message || 'Failed to create university');
    }
  });

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
        <h1 className="text-5xl font-black text-gray-900 tracking-tighter leading-none mb-4">Add University</h1>
        <p className="text-xl text-gray-400 font-medium font-inter">Enter the institution's details to publish it to the directory.</p>
      </div>

      <UniversityForm onSubmit={(data) => mutation.mutate(data)} isLoading={mutation.isPending} />
    </div>
  );
};

export default NewUniversity;
