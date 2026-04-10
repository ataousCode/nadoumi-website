import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ChevronLeftIcon } from '@heroicons/react/24/outline';
import { useToast } from '../../context/ToastContext';
import ScholarshipForm from '../../features/admin/components/ScholarshipForm';
import { createScholarship } from '../../api/scholarships';
import { getUniversities } from '../../api/universities';

import AdminLoading from '../../features/admin/components/AdminLoading';

const NewScholarship = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { success, error: showError } = useToast();

  const { data: universitiesRes, isLoading: universitiesLoading } = useQuery({
    queryKey: ['admin-universities-list'],
    queryFn: () => getUniversities({ limit: 100, isAdmin: true }),
    refetchOnWindowFocus: false,
  });
  const universities = universitiesRes?.data?.universities || [];

  const mutation = useMutation({
    mutationFn: (data) => createScholarship(data),
    onSuccess: () => {
      success('Scholarship published successfully!');
      queryClient.invalidateQueries(['admin-scholarships']);
      navigate('/admin/scholarships');
    },
    onError: (err) => {
      showError(err.message || 'Failed to publish scholarship');
    }
  });

  if (universitiesLoading) {
    return <AdminLoading message="Preparing Scholarship Form..." subtext="Accessing university records for selection." />;
  }

  return (
    <div className="max-w-5xl mx-auto space-y-10">
      {/* Back Button */}
      <button 
        onClick={() => navigate('/admin/scholarships')}
        className="flex items-center gap-2 text-gray-400 hover:text-gray-900 font-bold transition-all group"
      >
        <div className="w-10 h-10 rounded-xl bg-white border border-gray-100 flex items-center justify-center group-hover:bg-gray-50 group-hover:border-gray-200 transition-all">
          <ChevronLeftIcon className="w-5 h-5" />
        </div>
        <span className="text-sm tracking-tight uppercase tracking-widest text-[11px] font-black">Back to List</span>
      </button>

      {/* Header */}
      <div>
        <h1 className="text-5xl font-black text-gray-900 tracking-tighter leading-none mb-4">New Scholarship</h1>
        <p className="text-xl text-gray-400 font-medium font-inter">Create a new opportunity for international students.</p>
      </div>

      <ScholarshipForm 
        onSubmit={(data) => mutation.mutate(data)} 
        isLoading={mutation.isPending} 
        universities={universities}
      />
    </div>
  );
};

export default NewScholarship;
