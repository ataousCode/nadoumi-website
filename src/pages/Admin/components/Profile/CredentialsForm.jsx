import React, { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { ShieldCheckIcon } from '@heroicons/react/24/outline';
import { authService } from '../../../../api/auth.service';
import { useToast } from '../../../../context/ToastContext';
import Input from '../../../../components/common/Input';
import Button from '../../../../components/common/Button';
import ProfileSectionHeader from './ProfileSectionHeader';

const CredentialsForm = () => {
  const toast = useToast();
  const [data, setData] = useState({ 
    currentPassword: '', 
    newPassword: '', 
    confirmPassword: '' 
  });

  const mutation = useMutation({
    mutationFn: () => authService.updateAdminPassword(data.currentPassword, data.newPassword),
    onSuccess: () => { 
      setData({ currentPassword: '', newPassword: '', confirmPassword: '' }); 
      toast.success('Password updated successfully'); 
    },
    onError: (err) => toast.error(err.message || 'Failed to update password')
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (data.newPassword !== data.confirmPassword) {
      return toast.error('Passwords mismatch. Please confirm your new password.');
    }
    mutation.mutate();
  };

  return (
    <section className="bg-white p-10 rounded-[40px] border border-gray-100 shadow-sm">
      <ProfileSectionHeader icon={ShieldCheckIcon} title="Credentials" subtitle="Access control" color="rose" />
      <form className="space-y-6" onSubmit={handleSubmit}>
        <Input 
          label="Current Password" 
          type="password" 
          value={data.currentPassword} 
          onChange={(e) => setData({...data, currentPassword: e.target.value})} 
          className="rounded-2xl bg-gray-50/50 border-gray-100 py-4.5 px-6 font-bold"
          required 
        />
        <div className="h-[1px] bg-gray-50 my-2"></div>
        <Input 
          label="New Password" 
          type="password" 
          value={data.newPassword} 
          onChange={(e) => setData({...data, newPassword: e.target.value})} 
          className="rounded-2xl bg-gray-50/50 border-gray-100 py-4.5 px-6 font-bold"
          required 
        />
        <Input 
          label="Confirm New Password" 
          type="password" 
          value={data.confirmPassword} 
          onChange={(e) => setData({...data, confirmPassword: e.target.value})} 
          className="rounded-2xl bg-gray-50/50 border-gray-100 py-4.5 px-6 font-bold"
          required 
        />
        <div className="pt-4">
          <Button 
            type="submit" 
            disabled={mutation.isPending} 
            className="w-full py-5 bg-rose-600 text-white font-black text-[11px] uppercase tracking-widest hover:bg-rose-700 rounded-2xl transition-all shadow-xl shadow-rose-100 active:scale-95"
          >
            {mutation.isPending ? 'Updating...' : 'Update Password'}
          </Button>
        </div>
      </form>
    </section>
  );
};

export default CredentialsForm;
