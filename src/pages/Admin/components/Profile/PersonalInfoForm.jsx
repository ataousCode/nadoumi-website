import React, { useState, useEffect } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { UserIcon } from '@heroicons/react/24/outline';
import { authService } from '../../../../api/auth.service';
import { useToast } from '../../../../context/ToastContext';
import Input from '../../../../components/common/Input';
import Button from '../../../../components/common/Button';
import ProfileSectionHeader from './ProfileSectionHeader';

const PersonalInfoForm = ({ admin }) => {
  const toast = useToast();
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', country: '' });

  useEffect(() => {
    if (admin) setFormData({ 
      name: admin.name || '', 
      email: admin.email || '', 
      phone: admin.phone || '', 
      country: admin.country || '' 
    });
  }, [admin]);

  const updateMutation = useMutation({
    mutationFn: (data) => authService.updateAdminProfile(data),
    onSuccess: (data) => {
      queryClient.setQueryData(['admin-profile'], data);
      toast.success('Records updated successfully');
    },
    onError: (err) => toast.error(err.message || 'Failed to update records')
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const { name, phone, country } = formData;
    updateMutation.mutate({ name, phone, country });
  };

  return (
    <section className="bg-white p-12 rounded-[40px] border border-gray-100 shadow-sm">
      <ProfileSectionHeader icon={UserIcon} title="Personal Information" subtitle="Primary identity settings" color="indigo" />
      <form className="space-y-10" onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Input 
            label="Full Name" 
            value={formData.name} 
            onChange={(e) => setFormData({...formData, name: e.target.value})} 
            placeholder="Enter your full name" 
            className="rounded-2xl bg-gray-50/50 border-gray-100 py-4.5 px-6 font-bold focus:bg-white text-gray-900"
          />
          <Input 
            label="Email Address" 
            value={formData.email} 
            disabled 
            className="rounded-2xl bg-gray-50/80 border-gray-100 py-4.5 px-6 font-bold text-gray-400 cursor-not-allowed italic" 
            tooltip="Read-only" 
          />
          <Input 
            label="Phone Number" 
            value={formData.phone} 
            onChange={(e) => setFormData({...formData, phone: e.target.value})} 
            placeholder="+1 (555) 000-0000" 
            className="rounded-2xl bg-gray-50/50 border-gray-100 py-4.5 px-6 font-bold focus:bg-white text-gray-900"
          />
          <Input 
            label="Country / Region" 
            value={formData.country} 
            onChange={(e) => setFormData({...formData, country: e.target.value})} 
            placeholder="e.g. United Kingdom" 
            className="rounded-2xl bg-gray-50/50 border-gray-100 py-4.5 px-6 font-bold focus:bg-white text-gray-900"
          />
        </div>
        <div className="flex justify-end pt-4">
          <Button 
            type="submit" 
            disabled={updateMutation.isPending} 
            className="px-12 py-5 bg-gray-900 text-white font-black text-[11px] uppercase tracking-widest hover:bg-blue-600 transition-all rounded-2xl shadow-xl active:scale-95"
          >
            {updateMutation.isPending ? 'Propagating Changes...' : 'Update Records'}
          </Button>
        </div>
      </form>
    </section>
  );
};

export default PersonalInfoForm;
