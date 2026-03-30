import React, { useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import AuthHeader from '../features/auth/components/AuthHeader.jsx';
import Input from '../components/common/Input.jsx';
import Button from '../components/common/Button.jsx';
import { validate } from '../utils/validation.js';
import { authService } from '../api/auth.service.js';
import { useToast } from '../context/ToastContext.jsx';

function ResetPassword() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const toast = useToast();
  
  const [formData, setFormData] = useState({ password: '', confirmPassword: '' });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!token) {
      toast.error('Invalid or missing reset token.');
      return;
    }

    const passwordError = validate.password(formData.password) || validate.required(formData.password);
    const confirmError = validate.match(formData.confirmPassword, formData.password, 'Passwords');

    if (passwordError || confirmError) {
      setErrors({ password: passwordError, confirmPassword: confirmError });
      return;
    }
    
    setIsLoading(true);
    try {
      await authService.resetPassword(token, formData.password);
      toast.success('Password reset successful! You can now log in.');
      navigate('/login');
    } catch (err) {
      toast.error(err.message || 'Failed to reset password. Link may have expired.');
    } finally {
      setIsLoading(false);
    }
  };

  const updateField = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: null }));
  };

  return (
    <div className="min-h-screen bg-white flex flex-col font-sans overflow-hidden">
      <AuthHeader className="border-b border-gray-50" />
      
      <main className="flex-1 flex items-center justify-center p-6 relative">
        <div className="absolute inset-0 bg-[radial-gradient(#ea580c05_1px,transparent_1px)] [background-size:32px_32px]" />
        
        <div className="w-full max-w-[400px] relative z-10 animate-fade-in-up">
          <div className="bg-white rounded-[32px] p-10 md:p-12 shadow-premium border border-gray-100/50 text-center">
            
            <div className="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center mx-auto mb-8">
              <svg className="w-6 h-6 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            
            <h1 className="text-3xl font-black text-gray-900 mb-3 tracking-tighter leading-none">New Password</h1>
            <p className="text-gray-400 font-bold text-xs uppercase tracking-widest mb-10 leading-loose">
              Set a secure new password for your account
            </p>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="text-left">
                <Input 
                  label="New Password" 
                  type="password" 
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => updateField('password', e.target.value)}
                  error={errors.password}
                  className="rounded-xl border-gray-100 bg-gray-50/50 py-3.5 focus:bg-white transition-all text-sm font-bold"
                  icon={<svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>}
                  required
                />
              </div>

              <div className="text-left">
                <Input 
                  label="Confirm Password" 
                  type="password" 
                  placeholder="••••••••"
                  value={formData.confirmPassword}
                  onChange={(e) => updateField('confirmPassword', e.target.value)}
                  error={errors.confirmPassword}
                  className="rounded-xl border-gray-100 bg-gray-50/50 py-3.5 focus:bg-white transition-all text-sm font-bold"
                  icon={<svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>}
                  required
                />
              </div>

              <Button 
                type="submit" 
                disabled={isLoading}
                className="w-full py-4 rounded-xl bg-gray-900 text-white font-black text-[11px] uppercase tracking-[0.2em] shadow-xl shadow-gray-200"
              >
                 {isLoading ? 'Updating...' : 'Update Password'}
              </Button>
            </form>

            <div className="mt-10 pt-8 border-t border-gray-50">
               <Link to="/login" className="text-gray-400 font-black text-[10px] uppercase tracking-[0.2em] hover:text-orange-600 transition-colors flex items-center justify-center gap-2 group">
                 <svg className="w-4 h-4 transform group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M7 16l-4-4m0 0l4-4m-4 4h18" /></svg>
                 Return to Login
               </Link>
            </div>
          </div>
        </div>
      </main>

      <footer className="p-8 text-center bg-white opacity-50">
           <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest leading-loose">
             © 2024 Nadoumi Academic Network. All rights reserved. <br/>
             Authorized partner of Ministry of Education scholarship programs.
           </p>
      </footer>
    </div>
  );
}

export default ResetPassword;
